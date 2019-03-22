const express = require('express');
// const sql = require('mssql');
const { MongoClient, ObjectID } = require('mongodb');
const debug = require('debug')('app:bookRoutes');

const bookRouter = express.Router();

function router(nav) {
  bookRouter.route('/').get((req, res) => {
    // // mssql
    // (async function sqlQuery() {
    //   const sqlRequest = new sql.Request();
    //   const result = await sqlRequest.query('SELECT * FROM Books');
    //   res.render(
    //     'bookListView',
    //     {
    //       title: 'Book List',
    //       nav,
    //       bookList: result.recordset
    //     }
    //   );
    // }());

    // MongoDB
    const url = 'mongodb://localhost:27017';
    const dbName = 'NodeJS';

    (async function mongo() {
      let client;
      try {
        client = await MongoClient.connect(url);
        debug('Connected to MongoDB server');

        const db = client.db(dbName);
        const col = await db.collection('Books');
        const books = await col.find().toArray();

        res.render(
          'bookListView',
          {
            title: 'Book List',
            nav,
            books
          }
        );
      } catch (error) {
        debug(error.stack);
      }

      client.close();
    }());
  });

  bookRouter.route('/:id')
    // // mssql
    // .all((req, res, next) => {
    //   (async function sqlQuery() {
    //     const { id } = req.params;
    //     const sqlRequest = new sql.Request();
    //     const { recordset } = await sqlRequest.input('id', sql.Int, id)
    //       .query('SELECT * FROM Books WHERE Id = @id');
    //     [req.book] = recordset; // 相當於req.book = recordset[0]
    //     next();
    //   }());
    // })
    // .get((req, res) => {
    //   res.render(
    //     'bookView',
    //     {
    //       title: req.book,
    //       nav,
    //       book: req.book
    //     }
    //   );
    // });
    // MongoDB
    .get((req, res) => {
      const { id } = req.params;
      const url = 'mongodb://localhost:27017';
      const dbName = 'NodeJS';

      (async function mongo() {
        let client;
        try {
          client = await MongoClient.connect(url);
          debug('Connected to MongoDB server');

          const db = client.db(dbName);
          const col = await db.collection('Books');
          const book = await col.findOne({ _id: new ObjectID(id) });

          res.render(
            'bookView',
            {
              title: book.title,
              nav,
              book
            }
          );
        } catch (error) {
          debug(error.stack);
        }

        client.close();
      }());
    });
  return bookRouter;
}

module.exports = router; // export module call bookRouter
