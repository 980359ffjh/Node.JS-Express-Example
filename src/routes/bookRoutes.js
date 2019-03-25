const express = require('express');
const bookController = require('../controllers/bookController');

const bookRouter = express.Router();

function router(nav) {
  const { getAllBooks, getById, middleware } = bookController(nav);

  bookRouter.use(middleware);

  bookRouter.route('/')
    .get(getAllBooks);

  bookRouter.route('/:id')
    .get(getById);

  return bookRouter;
}

module.exports = router; // export module call bookRouter
