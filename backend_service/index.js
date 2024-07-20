const express = require('express');
const cors = require("cors");

const app = express();
app.use(cors())

app.get('/api/demo', (req, res) => {
    res.send('Hello from the demo API!');
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});