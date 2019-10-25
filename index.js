const app = require('./app')({secret: process.env.CODE_CHALLENGE_SECRET});
const {associate} = require('./models');
const index = require('./routes/index');
const books = require('./routes/books');
const users = require('./routes/users');

associate();

app.get('/', index);
app.use('/books', books);
app.use('/users', users);

app.listen(3000, () => console.log(`Open http://localhost:3000 to see a response.`));
