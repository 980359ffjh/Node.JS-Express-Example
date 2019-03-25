const express = require('express');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:authRoutes');
const passport = require('passport');

const authRouter = express.Router();

function router(nav) {
  authRouter.route('/login')
    .post((req, res) => {
      const { userName, password } = req.body;
      // MongoDB
      const url = 'mongodb://localhost:27017';
      const dbName = 'NodeJS';

      (async function addUser() {
        let client;
        try {
          client = await MongoClient.connect(url);
          debug('Connected to MongoDB server');

          const db = client.db(dbName);
          const col = await db.collection('Users');
          const user = { userName, password };

          const mongoResponse = await col.insertOne(user);
          debug(mongoResponse);
          req.login(mongoResponse.ops[0], () => {
            res.redirect('/auth/profile');
          });
        } catch (err) {
          debug(err);
        }

        client.close();
      }());
    });

  authRouter.route('/signIn')
    .get((req, res) => {
      res.render('signIn', {
        nav,
        title: 'Sign In'
      });
    })
    .post(passport.authenticate('local', {
      successRedirect: '/auth/profile',
      failureRedirect: '/'
    }));
  authRouter.route('/profile')
    .all((req, res, next) => {
      if (req.user) {
        next();
      } else {
        res.redirect('/');
      }
    })
    .get((req, res) => {
      res.json(req.user);
    });

  return authRouter;
}

module.exports = router;
