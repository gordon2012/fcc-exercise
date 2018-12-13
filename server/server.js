import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import React from 'react';
import { renderToString } from 'react-dom/server';

// Database
import connect from './connect';
import User from './models/user';
import Exercise from './models/exercise';

// Frontend
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
      <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    <body>
      <div id="root">${application}</div>
      <script src="${script}"></script>
    </body>
  </html>`;

  res.send(html);
});

// Get all users
app.get('/api/exercise/users', async (req, res) => {
  const users = await User.find({})
    .lean()
    .exec();
  res.status(200).json(users);
});

// Get exercises for a user
// TODO: date range
app.get('/api/exercise/log', async (req, res) => {
  const { userId, from, to, limit } = req.query;

  let user;
  try {
    user = await User.findById(userId)
      .lean()
      .exec();

    if(!user) {
      throw null;
    }

    try {
      const exercises = await Exercise.find({ userId })
        .lean()
        .limit(parseInt(limit) || 0)
        .exec();

      if (exercises.length > 0) {
        res.status(200).json({ ...user, exercises });
      } else {
        res
          .status(404)
          .json(`No records found for user ${user.username}`);
      }
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  } catch (error) {
    res.status(404).json(`User ${userId} not found`);
  }
});

// Add a user
app.post('/api/exercise/new-user', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(200).json(user.toJSON());
  } catch (error) {
    res.status(400).json({ error: 'username must be unique' });
  }
});

// Add an exercise to a user
// TODO: validation, date
app.post('/api/exercise/add', async (req, res) => {
  const { userId } = req.body;

  let user;
  try {
    user = await User.findById(userId)
      .lean()
      .exec();

    try {
      await Exercise.create(req.body);
      const exercises = await Exercise.find({ userId })
        .lean()
        .exec();

      // date

      res.status(200).json({ ...user, exercises });
    } catch (error) {
      res.status(400).json({ error });
    }
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: 'User not found' });
  }
});

export default app;
