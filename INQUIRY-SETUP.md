# Online inquiry delivery

The existing static pages use `/api/rfq`, a Vercel Node.js function. The public recipient is `andy@huijiapetgear.com`. An optional private server-side BCC recipient is configured through `RFQ_BCC_EMAIL`. Visitors cannot override either recipient. The visitor's email becomes Reply-To.

Set these values in the existing Vercel project's environment settings for the intended deployment environments:

| Variable | Value |
| --- | --- |
| `SMTP_HOST` | The mail provider's authenticated SMTP hostname |
| `SMTP_PORT` | `465` for implicit TLS or `587` for mandatory STARTTLS |
| `SMTP_USER` | Authorized sending mailbox/login |
| `SMTP_PASSWORD` | Provider-approved SMTP/app password |
| `SMTP_FROM` | Optional verified sender address; defaults to `SMTP_USER` |
| `RFQ_BCC_EMAIL` | Optional single private BCC address; store as a production secret, never in client config or source |

Use the existing business mailbox provider. Confirm its region-specific hostname and SMTP authentication requirements. Store credentials only in Vercel environment settings, never in source files or chat. Redeploy after adding them.

Before configuration, `GET /api/rfq` returns `{"available":false}`. Forms say **Prepare Inquiry** and provide email/WhatsApp drafts. They do not claim a message was sent. After configuration, forms use **Send Inquiry**. Only SMTP acceptance of the public and configured BCC recipients returns success; this does not prove inbox delivery. A malformed BCC configuration disables sending. Responses never disclose recipient configuration.

BCC is applied only to inquiries sent by this API. Email/WhatsApp drafts never include the private recipient. For messages sent directly to the public mailbox, configure private forwarding within the mailbox provider separately.

Acceptance check after configuration: with the owner's authorization, send one clearly labeled test RFQ, confirm it arrives in the sales inbox, and verify Reply-To. No real email is sent by `npm test`.

The handler checks origin, field lengths and required fields, uses a honeypot and applies a per-instance request limit. The in-memory limiter is best-effort; configure deployment-wide limits in Vercel Firewall if needed. Failure keeps the entered details and offers email/WhatsApp drafts.

References: https://vercel.com/docs/functions/runtimes/node-js and https://nodemailer.com/smtp
