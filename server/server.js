import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import React from 'react';
import { renderToString } from 'react-dom/server';
import 'babel-polyfill';

import connect from './connect';
import userSchema from './models/user';
import exerciseSchema from './models/exercise';
import App from '../client/App';

const app = express();

app.use(cors({ optionSuccessStatus: 200 }));
app.use(express.static('.build/public'));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res) {
    const script =
        app.get('env') === 'production'
            ? 'client.js'
            : 'http://localhost:3000/client.js';

    const title = 'Exercise Tracker | freeCodeCamp';
    const application = renderToString(<App />);

    const html = `<!doctype html>
        <html class="no-js" lang="">
            <head>
                <meta charset="utf-8">
                <meta http-equiv="x-ua-compatible" content="ie=edge">
                <title>${title} | freeCodeCamp</title>
                <meta name="description" content="">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <link rel="stylesheet" type="text/css" href="/style.css" />
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
    const User = await connect(
        'user',
        userSchema
    );

    const users = await User.find({})
        .lean()
        .exec();
    res.status(200).json(users);
});

// Get exercises for a user
app.get('/api/exercise/log', async (req, res) => {
    const User = await connect(
        'user',
        userSchema
    );
    const Exercise = await connect(
        'exercise',
        exerciseSchema
    );

    const { userId, from, to, limit } = req.query;

    let user;
    try {
        user = await User.findById(userId)
            .lean()
            .exec();

        if (!user) {
            throw null;
        }

        try {
            let exercises;

            const fromDate = new Date(from);
            const toDate = new Date(to);
            if (
                !(fromDate instanceof Date && !isNaN(fromDate)) ||
                !(toDate instanceof Date && !isNaN(toDate)) ||
                toDate < fromDate
            ) {
                // invalid dates
                exercises = await Exercise.find({ userId })
                    .lean()
                    .limit(parseInt(limit) || 0)
                    .exec();
            } else {
                // valid dates
                exercises = await Exercise.find({
                    userId,
                    date: { $gte: fromDate, $lt: toDate },
                })
                    .lean()
                    .limit(parseInt(limit) || 0)
                    .exec();
            }

            if (exercises.length > 0) {
                res.status(200).json({ ...user, exercises });
            } else {
                res.status(404).json(
                    `No records found for user ${user.username}`
                );
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
    const User = await connect(
        'user',
        userSchema
    );

    try {
        const user = await User.create(req.body);
        res.status(200).json(user.toJSON());
    } catch (error) {
        res.status(400).json({ error: 'username must be unique' });
    }
});

// Add an exercise to a user
app.post('/api/exercise/add', async (req, res) => {
    const User = await connect(
        'user',
        userSchema
    );
    const Exercise = await connect(
        'exercise',
        exerciseSchema
    );

    const { userId, description, duration, date: inDate } = req.body;

    let date = new Date(inDate);
    if (!(date instanceof Date && !isNaN(date))) {
        date = new Date();
    }

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

            res.status(200).json({ ...user, exercises });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    } catch (error) {
        res.status(404).json({ error: 'User not found' });
    }
});

export default app;
