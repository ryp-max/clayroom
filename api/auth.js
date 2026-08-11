// Step 1 of the Decap CMS GitHub OAuth handshake.
// Redirects the editor to GitHub to approve access, then GitHub sends
// them back to /api/callback with a one-time code.
module.exports = (req, res) => {
  const clientId = process.env.OAUTH_CLIENT_ID;
  if (!clientId) {
    res.status(500).send('Missing OAUTH_CLIENT_ID environment variable.');
    return;
  }

  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const redirectUri = `${protocol}://${req.headers.host}/api/callback`;
  const state = Math.random().toString(36).slice(2);

  const authorizeUrl = 'https://github.com/login/oauth/authorize'
    + '?client_id=' + encodeURIComponent(clientId)
    + '&redirect_uri=' + encodeURIComponent(redirectUri)
    + '&scope=' + encodeURIComponent('repo,user')
    + '&state=' + encodeURIComponent(state);

  res.writeHead(302, { Location: authorizeUrl });
  res.end();
};
