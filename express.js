const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const sql = require('mssql');

const app = express();
const port = process.env.PORT || 3000; // package.json setting's PORT
const nav = [
  { link: '/books', title: 'Books' },
  { link: '/authors', title: 'Authors' }
];
const bookRouter = require('./src/routes/bookRoutes')(nav); // require myself module
const adminRouter = require('./src/routes/adminRoutes')(nav); // require myself module

// config for your database
const config = {
  user: 'rongchang',
  password: '@Rong0913',
  server: '172.23.0.57', // You can use 'localhost\\instance' to connect to named instance
  database: 'NodeJS',

  options: {
    encrypt: false // Use this if you're on Windows Azure
  },
};
sql.connect(config).catch(err => debug(err));

app.use(morgan('tiny'));
app.use((request, response, next) => {
  debug('Middleware');
  next();
});
// provide static(靜態) file
// automatically to catch css, bootstrap and jquery file
app.use(express.static(path.join(__dirname, 'public'))); // css or js file
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css'))); // css
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js'))); // javascript
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist'))); // jqery
app.use('/books', bookRouter);
app.use('/admin', adminRouter);

app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'ejs');

app.listen(port, () => {
  debug(`listening on port ${chalk.green(port)}`);
});

app.get('/', (request, response) => {
  // response.sendFile(path.join(__dirname, 'views', 'index.html'));
  // response.render('index', { title: 'Send from server side', list: ['ls1', 'ls2'] });
  response.render(
    'example',
    {
      title: 'Send from server side',
      nav
    }
  );
});

// can use app.get or use express's Router()
// app.get('/books', (request, response) => {
//   response.send('Hello books from server side response');
// });

// app.get('/books/single', (request, response) => {
//   response.send('Hello single book from server side response');
// });
