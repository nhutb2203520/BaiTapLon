const express = require('express');
const cors = require('cors');
const database = require('./config/database');
const route = require('./routes');
require('dotenv').config();

const app = express();
database.connect();

app.use(cors());
app.use(express.json());
route(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
