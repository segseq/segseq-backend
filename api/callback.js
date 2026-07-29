import fetch from "node-fetch";

export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send("Missing authorization code");
  }

  try {
    const response = await fetch("https://www.strava.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        code,
        grant_type: "authorization_code"
      })
    });

    const data = await response.json();

    // Stockage en mémoire (MVP)
    global.accessToken = data.access_token;

    // Redirection vers ton site statique
    res.redirect("https://segseq.github.io/segseq/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Token exchange failed");
  }
}
