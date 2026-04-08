export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'connected',
      message: 'Aurora Access initialized. Your key is active under local session.'
    });
  }

  if (req.method === 'POST') {
    const { user } = req.body;
    if (!user) {
      return res.status(400).json({ error: 'Missing user data' });
    }

    const auroraKey = `${user}-AURORA-${Date.now().toString(36)}`;
    return res.status(201).json({
      status: 'created',
      key: auroraKey,
      message: 'Aurora key successfully created for ' + user
    });
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
