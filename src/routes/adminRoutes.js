const express = require('express');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:adminRoutes');

const adminRouter = express.Router();
// const books = [
//   {
//     title: 'Add book from adminRoutes',
//     genre: 'Test',
//     author: 'Rong',
//     read: false
//   }
// ];
function router(nav) {
  adminRouter.route('/').get((req, res) => {
    const url = 'mongodb://localhost:27017';
    const dbName = 'NodeJS';

    (async function mongo() {
      let client;
      try {
        client = await MongoClient.connect(url);
        debug('Connected to MongoDB server');

        const db = client.db(dbName);
        const mongoResponse = await db.collection('Books').insertMany(books);

        res.json(mongoResponse);
      } catch (error) {
        debug(error.stack);
      }

      client.close();
    }());
  });
  return adminRouter;
}

module.exports = router;
