const express = require('express');

require('./models');
const index = require('./routes/index.js');
const users = require('./routes/users.js');

const app = express();
app.use(express.json());
app.get('/', index);
app.use('/users', users);

app.listen(3000, () => console.log(`Open http://localhost:3000 to see a response.`));
