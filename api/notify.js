const webpush = require('web-push');

webpush.setVapidDetails(
  'mailto:tenniswant.art@gmail.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { title, body, subscriptions } = req.body;
  if (!subscriptions || !subscriptions.length) return res.status(200).json({ sent: 0 });

  const payload = JSON.stringify({ title, body });
  let sent = 0;

  await Promise.all(
    subscriptions.map(sub =>
      webpush.sendNotification(sub, payload)
        .then(() => sent++)
        .catch(() => {})
    )
  );

  res.status(200).json({ ok: true, sent });
};
