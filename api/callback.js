// Step 2 of the Decap CMS GitHub OAuth handshake.
// Exchanges the one-time code GitHub sent back for a real access token,
// then hands that token to the CMS popup window via postMessage.
module.exports = async (req, res) => {
  const clientId = process.env.OAUTH_CLIENT_ID;
  const clientSecret = process.env.OAUTH_CLIENT_SECRET;
  const code = req.query && req.query.code;

  if (!clientId || !clientSecret) {
    res.status(500).send('Missing OAUTH_CLIENT_ID or OAUTH_CLIENT_SECRET environment variable.');
    return;
  }
  if (!code) {
    res.status(400).send('Missing code from GitHub.');
    return;
  }

  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code: code }),
    });
    const tokenData = await tokenRes.json();

    if (tokenData.error) {
      res.status(400).send(renderHandshakePage('error', { message: tokenData.error_description || tokenData.error }));
      return;
    }

    res.status(200).send(renderHandshakePage('success', { token: tokenData.access_token, provider: 'github' }));
  } catch (err) {
    res.status(500).send(renderHandshakePage('error', { message: err.message }));
  }
};

function renderHandshakePage(status, payload) {
  const message = 'authorization:github:' + status + ':' + JSON.stringify(payload);
  return '<!DOCTYPE html><html><body><script>'
    + '(function() {'
    + 'function receiveMessage(e) {'
    + 'window.opener.postMessage(' + JSON.stringify(message) + ', e.origin);'
    + 'window.removeEventListener("message", receiveMessage, false);'
    + '}'
    + 'window.addEventListener("message", receiveMessage, false);'
    + 'window.opener.postMessage("authorizing:github", "*");'
    + '})();'
    + '</script></body></html>';
}
