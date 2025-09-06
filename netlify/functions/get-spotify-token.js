// We use the 'node-fetch' library to make HTTP requests in a Node.js environment.
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  // Get our secure credentials from the environment variables.
  const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;

  // Base64 encode the client ID and client secret, as required by the Spotify API.
  const authBuffer = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authBuffer}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    });

    if (!response.ok) {
      // If the response is not successful, we throw an error.
      const errorData = await response.json();
      throw new Error(`Spotify API error: ${response.status}`, { cause: errorData });
    }

    const data = await response.json();

    // If successful, return the access token to our frontend.
    return {
      statusCode: 200,
      body: JSON.stringify({ accessToken: data.access_token })
    };

  } catch (error) {
    console.error('Error fetching Spotify token:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch Spotify access token.' })
    };
  }
};
