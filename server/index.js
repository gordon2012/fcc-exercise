import dotenv from 'dotenv';
import http from 'http';
import mongoose from 'mongoose';

import app from './server';

dotenv.config();

const server = http.createServer(app);
let currentApp = app;

const port = process.env.PORT || 4000;
const db = process.env.DB || 'test';

mongoose.connection.on('connected', () =>
  console.log(`Mongoose connected to db ${db}`)
);

server.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

if (module.hot) {
  module.hot.accept('./server', () => {
    server.removeListener('request', currentApp);
    server.on('request', app);
    currentApp = app;
  });
}
