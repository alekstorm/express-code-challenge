const app = require('./app')({secret: process.env.CODE_CHALLENGE_SECRET});
require('./models');
const index = require('./routes/index');
const users = require('./routes/users');

app.get('/', index);
app.use('/users', users);

app.listen(3000, () => console.log(`Open http://localhost:3000 to see a response.`));
