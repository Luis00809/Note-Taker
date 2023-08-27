const express = require('express');
const path = require('path');
const fs = require('fs');

const PORT = 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}));


app.use(express.static('public'));







app.listen(PORT, () => {
    console.info(`app listening at http://localhost:${PORT}`);
})