const fetch = require('node-fetch');
const { parse } = require('url');

const { newAgent } = require('./agents');

const agentConfig = {
  // ca: "./cloud-ca.pem",
  cert: "./client.crt",
  key: "./client.key",
};

const agents = {
  'http:': newAgent('http'),
  'https:': newAgent('https'),
};

const secureAgents = {
  'http:': newAgent('http', agentConfig),
  'https:': newAgent('https', agentConfig),
};

const defaultParseFunction = res => res.json();

module.exports = ({
  headers,
  parseFunction = defaultParseFunction,
  timeout = 4000,
  useCert = true,
  expectedStatusList = [200],
} = {}) => {

  const request = method => async opts => {
    const url = opts.url || opts;
    console.log(`[HTTP Client] GET Request ${url}`);

    const requestOptions = {
      agent: (useCert ? secureAgents : agents)[parse(url).protocol],
      body: opts.body ? JSON.stringify(opts.body) : undefined,
      compress: true,
      headers: { ...headers, ...opts.headers },
      method,
      timeout,
    };

    try {
      const res = await fetch(url, requestOptions);

      if (!expectedStatusList.includes(res.status)) {
        const err = new Error(
          `[HTTP Client] Expected status ${expectedStatusList}, but got status ${res.status}`
        );
        err.status = res.status;
        throw err;
      }

      return parseFunction(res);
    } catch (e) {
      console.log(`[HTTP Client] Request ${url} failed`, e);
      throw e;
    }
  };

  return {
    delete: request('DELETE'),
    get: request('GET'),
    post: request('POST'),
    put: request('PUT'),
  };
};
