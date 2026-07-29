import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send('Missing authorization code');
  }

  try {
    const response = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code'
      })
    });

    const data = await response.json();

    res.status(200).send(`
      <h1>Connexion Strava réussie !</h1>
      <p>Athlète : ${data.athlete?.firstname || ''} ${data.athlete?.lastname || ''}</p>
      <p>Access Token : ${data.access_token}</p>
      <p>Refresh Token : ${data.refresh_token}</p>
      <p>Expires At : ${data.expires_at}</p>
    `);
  } catch (err) {
    console.error(err);
    res.status(500).send('Token exchange failed');
  }
}
