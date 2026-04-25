const { GoogleOAuthProvider } = require('@react-oauth/google');
const React = require('react');
const ReactDOMServer = require('react-dom/server');

try {
  const result = ReactDOMServer.renderToString(
    React.createElement(GoogleOAuthProvider, { clientId: undefined }, React.createElement('div', null, 'Hello'))
  );
  console.log('Success:', result);
} catch (e) {
  console.error('Error:', e.message);
}
