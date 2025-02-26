const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
app.use(cors());
app.use(express.json());
app.use(helmet());

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});