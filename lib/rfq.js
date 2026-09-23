const nodemailer = require('nodemailer');

const recipient = 'andy@huijiapetgear.com';
const emailPattern = /^[^\s@<>\r\n]+@[^\s@<>\r\n]+\.[^\s@<>\r\n]+$/;
const limits = { name: 100, email: 254, company: 160, phone: 80, product: 200, quantity: 100, market: 120, requirements: 6000 };

function smtpReady(env) {
  return Boolean(env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASSWORD &&
    emailPattern.test(env.SMTP_FROM || env.SMTP_USER) &&
    [465, 587].includes(Number(env.SMTP_PORT || 465)));
}

async function deliver(message, env) {
  const port = Number(env.SMTP_PORT || 465);
  const transport = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port,
    secure: port === 465,
    requireTLS: true,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASSWORD },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 12000,
    disableFileAccess: true,
    disableUrlAccess: true
  });
  try {
    const result = await transport.sendMail(message);
    if (!result.accepted?.some(address => String(address).toLowerCase() === recipient)) {
      throw new Error('Recipient not accepted');
    }
  } finally {
    transport.close();
  }
}

function createHandler({ env = process.env, send = deliver, now = Date.now } = {}) {
  // Best-effort per-instance protection; use Vercel Firewall for deployment-wide limits.
  const attempts = new Map();
  return async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    const respond = (status, body) => res.status(status).json(body);
    if (req.method === 'GET') return respond(200, { available: smtpReady(env) });
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'GET, POST');
      return respond(405, { ok: false, error: 'Method not allowed.' });
    }
    const origins = new Set(['https://www.huijiapetgear.com', 'https://huijiapetgear.com']);
    if (env.VERCEL_URL) origins.add(`https://${env.VERCEL_URL}`);
    if (env.VERCEL_BRANCH_URL) origins.add(`https://${env.VERCEL_BRANCH_URL}`);
    if (!origins.has(req.headers.origin)) return respond(403, { ok: false, error: 'Invalid origin.' });
    if (!/^application\/json(?:\s*;|$)/i.test(req.headers['content-type'] || '')) {
      return respond(415, { ok: false, error: 'JSON required.' });
    }
    if (Number(req.headers['content-length']) > 12000) return respond(413, { ok: false, error: 'Inquiry too long.' });
    let input;
    try {
      const raw = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
      if (!raw || Buffer.byteLength(raw) > 12000) return respond(413, { ok: false, error: 'Inquiry too long.' });
      input = JSON.parse(raw);
      if (!input || Array.isArray(input) || typeof input !== 'object') throw new Error('Invalid body');
    } catch {
      return respond(400, { ok: false, error: 'Invalid inquiry.' });
    }
    if (input.website) return respond(202, { ok: true });
    const data = {};
    for (const [key, max] of Object.entries(limits)) {
      const value = input[key] ?? '';
      if (typeof value !== 'string' || value.length > max || value.includes('\0')) {
        return respond(400, { ok: false, error: 'Please shorten the inquiry or check the fields.' });
      }
      data[key] = value.trim();
    }
    if (!data.name || !data.requirements || !emailPattern.test(data.email)) {
      return respond(400, { ok: false, error: 'Name, valid email and requirements are required.' });
    }
    if (!smtpReady(env)) return respond(503, { ok: false, error: 'Online delivery is unavailable. Please use email or WhatsApp.' });
    const timestamp = now();
    for (const [key, value] of attempts) if (timestamp - value.start > 900000) attempts.delete(key);
    if (attempts.size >= 5000) return respond(429, { ok: false, error: 'Please try again later.' });
    const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
    const record = attempts.get(ip) || { start: timestamp, count: 0 };
    if (record.count >= 5) {
      res.setHeader('Retry-After', '900');
      return respond(429, { ok: false, error: 'Please wait before submitting another inquiry.' });
    }
    record.count += 1;
    attempts.set(ip, record);
    const text = Object.entries(data).map(([key, value]) => `${key}: ${value}`).join('\n\n');
    try {
      await send({
        from: { name: 'HUIJIA PET Website', address: env.SMTP_FROM || env.SMTP_USER },
        to: recipient,
        replyTo: data.email,
        subject: `Website RFQ: ${data.product || 'Dog walking gear'}`.replace(/[\r\n]/g, ' ').slice(0, 220),
        text,
        disableFileAccess: true,
        disableUrlAccess: true
      }, env);
      return respond(200, { ok: true });
    } catch {
      // Never expose credentials, visitor content or SMTP diagnostics in logs/responses.
      return respond(502, { ok: false, error: 'Delivery could not be confirmed. Please use email or WhatsApp.' });
    }
  };
}

module.exports = { createHandler, smtpReady };
