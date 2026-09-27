// Minimum eligibility guard, not a complete Google Rich Results validator.
// Published offers/reviews must also be real and visible to the buyer.
export function productSnippetIssues(data) {
  const issues=[];
  function visit(node) {
    if (!node || typeof node !== 'object') return;
    if ([node['@type']].flat().includes('Product')) {
      if (!node.name) issues.push('Product is missing its name');
      if (!node.offers && !node.review && !node.aggregateRating) {
        issues.push(`${node.name || 'Product'}: Product requires a genuine published offer or review; use WebPage metadata for quote-only pages`);
      }
    }
    Object.values(node).forEach(value => Array.isArray(value) ? value.forEach(visit) : visit(value));
  }
  visit(data);
  return issues;
}
