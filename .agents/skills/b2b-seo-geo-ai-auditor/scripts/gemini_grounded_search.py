#!/usr/bin/env python3
"""Run a grounded Gemini web-research prompt without logging the API key.

Usage:
  export GEMINI_API_KEY="..."
  python scripts/gemini_grounded_search.py --prompt "Research ..."
  printf '%s' "Research ..." | python scripts/gemini_grounded_search.py

The script uses only Python's standard library and prints normalized JSON.
The model can be changed with --model or GEMINI_MODEL.
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import urllib.error
import urllib.request
from datetime import datetime, timezone
from typing import Any


DEFAULT_MODEL = "gemini-3.8-flash"
DEFAULT_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/interactions"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Query Gemini with Google Search grounding."
    )
    parser.add_argument(
        "--prompt",
        help="Research prompt. If omitted, prompt is read from stdin.",
    )
    parser.add_argument(
        "--model",
        default=os.environ.get("GEMINI_MODEL", DEFAULT_MODEL),
        help="Gemini model name.",
    )
    parser.add_argument(
        "--endpoint",
        default=os.environ.get("GEMINI_INTERACTIONS_ENDPOINT", DEFAULT_ENDPOINT),
        help="Gemini Interactions API endpoint.",
    )
    parser.add_argument(
        "--timeout",
        type=int,
        default=90,
        help="HTTP timeout in seconds.",
    )
    parser.add_argument(
        "--raw",
        action="store_true",
        help="Print the complete API response instead of normalized output.",
    )
    return parser.parse_args()


def get_prompt(args: argparse.Namespace) -> str:
    if args.prompt:
        prompt = args.prompt.strip()
    elif not sys.stdin.isatty():
        prompt = sys.stdin.read().strip()
    else:
        prompt = ""

    if not prompt:
        raise ValueError("A non-empty prompt is required via --prompt or stdin.")
    return prompt


def walk(value: Any):
    if isinstance(value, dict):
        yield value
        for child in value.values():
            yield from walk(child)
    elif isinstance(value, list):
        for child in value:
            yield from walk(child)


def normalize_response(payload: dict[str, Any], model: str) -> dict[str, Any]:
    texts: list[str] = []
    citations: list[dict[str, Any]] = []
    search_queries: list[str] = []

    for node in walk(payload):
        node_type = node.get("type")

        if node_type == "google_search_call":
            arguments = node.get("arguments", {})
            if isinstance(arguments, dict):
                queries = arguments.get("queries", [])
                if isinstance(queries, list):
                    for query in queries:
                        if isinstance(query, str) and query not in search_queries:
                            search_queries.append(query)

        if node_type in {"text", "output_text"}:
            text = node.get("text")
            if isinstance(text, str) and text.strip() and text not in texts:
                texts.append(text.strip())

        annotations = node.get("annotations")
        if isinstance(annotations, list):
            for annotation in annotations:
                if not isinstance(annotation, dict):
                    continue
                if annotation.get("type") != "url_citation":
                    continue
                citation = {
                    "url": annotation.get("url"),
                    "title": annotation.get("title"),
                    "start_index": annotation.get("start_index")
                    if "start_index" in annotation
                    else annotation.get("startIndex"),
                    "end_index": annotation.get("end_index")
                    if "end_index" in annotation
                    else annotation.get("endIndex"),
                }
                if citation not in citations:
                    citations.append(citation)

    if not texts:
        direct_text = payload.get("output_text") or payload.get("outputText")
        if isinstance(direct_text, str) and direct_text.strip():
            texts.append(direct_text.strip())

    return {
        "retrieved_at": datetime.now(timezone.utc).isoformat(),
        "model": model,
        "grounding_tool": "google_search",
        "search_queries": search_queries,
        "output_text": "\n\n".join(texts),
        "citations": citations,
    }


def main() -> int:
    args = parse_args()

    try:
        prompt = get_prompt(args)
    except ValueError as exc:
        print(json.dumps({"error": str(exc)}, ensure_ascii=False), file=sys.stderr)
        return 2

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print(
            json.dumps(
                {
                    "error": "GEMINI_API_KEY is not set.",
                    "fallback": "Use the session web-search tool and preserve citations.",
                },
                ensure_ascii=False,
            ),
            file=sys.stderr,
        )
        return 2

    request_body = {
        "model": args.model,
        "input": prompt,
        "tools": [{"type": "google_search"}],
    }

    request = urllib.request.Request(
        args.endpoint,
        data=json.dumps(request_body).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "x-goog-api-key": api_key,
            "User-Agent": "b2b-seo-geo-ai-auditor/1.0",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=args.timeout) as response:
            payload = json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace")
        print(
            json.dumps(
                {
                    "error": "Gemini API HTTP error",
                    "status": exc.code,
                    "response": body[:4000],
                },
                ensure_ascii=False,
            ),
            file=sys.stderr,
        )
        return 1
    except urllib.error.URLError as exc:
        print(
            json.dumps(
                {"error": "Gemini API network error", "detail": str(exc.reason)},
                ensure_ascii=False,
            ),
            file=sys.stderr,
        )
        return 1
    except (TimeoutError, json.JSONDecodeError) as exc:
        print(
            json.dumps(
                {"error": "Invalid or timed-out Gemini response", "detail": str(exc)},
                ensure_ascii=False,
            ),
            file=sys.stderr,
        )
        return 1

    result = payload if args.raw else normalize_response(payload, args.model)
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
