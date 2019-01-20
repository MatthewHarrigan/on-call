const http = require('http');
const https = require('https');

const { loadCA, loadCertificate, loadKey } = require('./ssl');

const defaultCAs = [
  '/etc/pki/cloud-ca.pem',
  '/etc/pki/cosmos/current/client.crt',
  '/etc/pki/tls/certs/ca-bundle.crt',
];

const protocols = {
  http,
  https,
};

const newAgent = (type, certs = {}) => {
  const { ca, cert, key } = certs;
  const sslOptions = certs
    ? {
        ca: [ca, ...defaultCAs].map(loadCA).reduce((a, b) => {
          a.push(...b);
          return a;
        }, []),
        cert: loadCertificate(cert),
        key: loadKey(key),
      }
    : {};

  const agentOptions = {
    ...sslOptions,
    keepAlive: true,
    keepAliveMsecs: 30000,
  };

  return new protocols[type].Agent(agentOptions);
};

module.exports = {
  newAgent,
};
