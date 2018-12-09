import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import React from 'react';
import { renderToString } from 'react-dom/server';

import connect from './connect';
import Foobar from './models/foobar';
import App from '../common/App';

dotenv.config();
const db = process.env.DB || 'test';

const app = express();

app.use(cors({ optionSuccessStatus: 200 }));
app.use(express.static('.build/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

connect(`mongodb://localhost:27017/${db}`);

app.get('/', function(req, res) {
  const script =
    app.get('env') === 'production'
      ? 'client.js'
      : 'http://localhost:3000/client.js';

  const title = 'Microservice Boilerplate';
  const application = renderToString(<App />);

  const html = `<!doctype html>
  <html class="no-js" lang="">
    <head>
      <meta charset="utf-8">
      <meta http-equiv="x-ua-compatible" content="ie=edge">
      <title>${title} | freeCodeCamp</title>
      <meta name="description" content="">
      <meta name="viewport" content="width=device-width,  initial-scale=1">
    </head>
    <body>
      <div id="root">${application}</div>
      <script src="${script}"></script>
    </body>
  </html>`;

  res.send(html);
});

app.get('/api/:input?', function(req, res) {
  const { input } = req.params;

  res.json({ method: 'get', ...(input ? { input } : {}) });
});

app.post('/api/post', async (req, res) => {
  try {
    const doc = await Foobar.create(req.body);
    res.json(doc);
  } catch (e) {
    console.error(e);
  }
});

export default app;
