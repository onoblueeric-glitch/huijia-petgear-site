const test = require('node:test');
const assert = require('node:assert/strict');
const { createHandler } = require('../lib/rfq.js');
const env = { SMTP_HOST: 'smtp.example.com', SMTP_USER: 'sender@example.com', SMTP_PASSWORD: 'test-only', SMTP_PORT: '465' };
const request = (body = {}) => ({ method: 'POST', headers: { origin: 'https://www.huijiapetgear.com', 'content-type': 'application/json', 'x-forwarded-for': '192.0.2.1' }, body: { name: 'Test buyer', email: 'buyer@example.com', requirements: 'Please quote a printed leash.', ...body } });
async function invoke(handler, req) {
  const result = { headers: {} };
  await handler(req, { setHeader: (key, value) => result.headers[key] = value, status(code) { result.status = code; return this; }, json(body) { result.body = body; return this; } });
  return result;
}
test('missing credentials advertise offline mode and never report delivery', async () => {
  const h = createHandler({ env: {}, send: () => assert.fail('must not send') });
  assert.deepEqual((await invoke(h, { method: 'GET' })).body, { available: false });
  assert.equal((await invoke(h, request())).status, 503);
});
test('server controls recipient; buyer email becomes reply-to and content stays plain text', async () => {
  let sent;
  const h = createHandler({ env, send: async message => { sent = message; } });
  const result = await invoke(h, request({ assignedSalesEmail: 'attacker@example.com', product: 'Rope\r\nBcc: stranger@example.com' }));
  assert.equal(result.status, 200);
  assert.equal(sent.to, 'andy@huijiapetgear.com');
  assert.equal(sent.replyTo, 'buyer@example.com');
  assert.equal(sent.from.address, 'sender@example.com');
  assert.equal(sent.html, undefined);
  assert.ok(!/[\r\n]/.test(sent.subject));
});
test('SMTP failure does not return false success or private diagnostics', async () => {
  const result = await invoke(createHandler({ env, send: async () => { throw new Error('secret test password'); } }), request());
  assert.equal(result.status, 502);
  assert.equal(result.body.ok, false);
  assert.ok(!JSON.stringify(result).includes('secret'));
});
test('rejects foreign origins, malformed fields, header injection and oversize content', async () => {
  const h = createHandler({ env, send: () => assert.fail('must not send') });
  const foreign = request(); foreign.headers.origin = 'https://example.org';
  assert.equal((await invoke(h, foreign)).status, 403);
  assert.equal((await invoke(h, request({ email: 'buyer@example.com\r\nBcc: other@example.com' }))).status, 400);
  assert.equal((await invoke(h, request({ name: ['invalid'] }))).status, 400);
  assert.equal((await invoke(h, request({ requirements: 'x'.repeat(6001) }))).status, 400);
  assert.equal((await invoke(h, request({ requirements: 'x'.repeat(13000) }))).status, 413);
});
test('honeypot does not send mail and repeated requests are limited', async () => {
  let calls = 0;
  const h = createHandler({ env, send: async () => { calls += 1; } });
  assert.equal((await invoke(h, request({ website: 'spam' }))).status, 202);
  assert.equal(calls, 0);
  for (let i = 0; i < 5; i++) assert.equal((await invoke(h, request())).status, 200);
  assert.equal((await invoke(h, request())).status, 429);
  assert.equal(calls, 5);
});
test('preview origin comes from deployment environment rather than arbitrary request host', async () => {
  const h = createHandler({ env: { ...env, VERCEL_URL: 'preview.vercel.app' }, send: async () => {} });
  const req = request(); req.headers.origin = 'https://preview.vercel.app';
  assert.equal((await invoke(h, req)).status, 200);
  req.headers.origin = 'https://other.vercel.app';
  assert.equal((await invoke(h, req)).status, 403);
});
