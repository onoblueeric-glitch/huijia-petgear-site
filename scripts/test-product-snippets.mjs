import test from 'node:test';
import assert from 'node:assert/strict';
import {productSnippetIssues} from './product-snippet-policy.mjs';

test('rejects quote-only Product nodes, including nested collection entries',()=>{
  const product={'@type':['Product'],name:'Example'};
  assert.equal(productSnippetIssues({'@graph':[product]}).length,1);
  assert.equal(productSnippetIssues({'@type':'ItemList',itemListElement:[{'@type':'ListItem',item:product}]}).length,1);
});

test('accepts page metadata and does not prohibit future supported product offers',()=>{
  assert.deepEqual(productSnippetIssues({'@type':'WebPage',name:'Example'}),[]);
  assert.deepEqual(productSnippetIssues({'@type':'Product',name:'Test fixture',offers:{'@type':'Offer',price:20,priceCurrency:'USD'}}),[]);
});
