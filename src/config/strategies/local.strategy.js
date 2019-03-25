const passport = require('passport');
const { Strategy } = require('passport-local');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:local.strategy');

module.exports = function localStrategy() {
  passport.use(new Strategy(
    {
      userNameField: 'userName',
      passwordField: 'password'
    }, (userName, password, done) => {
      const url = 'mongodb://localhost:27017';
      const dbName = 'NodeJS';

      (async function addUser() {
        let client;
        try {
          client = await MongoClient.connect(url);
          debug('Connected to MongoDB server');

          const db = client.db(dbName);
          const col = await db.collection('Users');

          const user = await col.findOne(userName);

          if (user.password === password) {
            done(null, user);
          } else {
            done(null, false);
          }
        } catch (err) {
          console.log(err);
        }

        client.close();
      }());
    }
  ));
};
