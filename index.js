import {parseString} from 'xml2js';
import {processors} from 'xml2js';
const stripPrefix = processors.stripPrefix;

import express from 'express';
import fetch from 'node-fetch';

import config from './config.js';

const app = express()
const port = process.env.PORT || 3000

const xmlHandler = async function sampleActionHandler(res, upstreamEndpoint) {

  console.log('Hitting this upstream endpoint: ' + upstreamEndpoint);

  // TODO: convert graphql input to params/payload for upstream endpoint
  // const requestPayload = json2xml(req.body);

  // Make a request to the upstream endpoint
  const response = await fetch(upstreamEndpoint);
  if (!response.ok) {
    // return error
    res.status(500).send('Unexpected response from upstream endpoint: ' + upstreamEndpoint);
    return;
  }

  // Extract the response body and attempt parsing XML into JSON
  const responseData = await response.text();
  parseString(responseData,
    {
      tagNameProcessors: [stripPrefix] // Apply processors to convert XML tags into the appropriate format
    },
    function (err, result) {
      if (err) {
        console.error(err);
        res.status(500)
          .send('Could not parse XML/convert to JSON for response received from: ' + upstreamEndpoint);
        return;
      }
      res.json(result);
    }
  );
};

app.get('/:actionName', async (req, res) => {

  // Use actionName to find the appropriate endpoint
  const upstreamEndpoint = config.actionEndpointMapping[req.params.actionName];

  if (upstreamEndpoint) {
      xmlHandler(res, upstreamEndpoint);
  } else {
    res.status(404).send('Could find upstream endpoint for action name: ' + req.params.actionName);
  }
});

app.listen(port, () => {
  console.log(config);
  console.log(`XML handler listening at http://localhost:${port}`)
});
