const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

const grid = 
    { map: [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 3, 3, 3, 3, 3, 1, 3, 3, 3, 3, 3, 1, 3, 3, 3, 3, 3, 1, 4, 4, 4, 4, 4, 4, 4, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 1],
        [1, 3, 3, 3, 3, 3, 1, 3, 3, 3, 3, 3, 1, 3, 3, 3, 3, 3, 1, 4, 4, 4, 4, 4, 4, 4, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 1],
        [1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 4, 4, 4, 4, 4, 4, 4, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 1],
        [1, 3, 3, 3, 3, 3, 1, 3, 3, 3, 3, 3, 1, 3, 3, 3, 3, 3, 1, 4, 4, 4, 4, 4, 4, 4, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 1],
        [1, 3, 3, 3, 3, 3, 1, 3, 3, 3, 3, 3, 1, 3, 3, 3, 3, 3, 1, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 4, 4, 4, 4, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 4, 4, 4, 5, 4, 4, 4, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 1],
        [1, 3, 3, 3, 3, 3, 1, 3, 3, 3, 3, 3, 1, 3, 3, 3, 3, 3, 1, 4, 5, 5, 5, 4, 4, 4, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 1],
        [1, 3, 3, 3, 3, 3, 1, 3, 3, 3, 3, 3, 1, 3, 3, 3, 3, 3, 1, 4, 5, 4, 4, 4, 4, 4, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 1],
        [1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 4, 5, 4, 4, 4, 4, 4, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 1],
        [1, 3, 3, 3, 3, 3, 1, 3, 3, 3, 3, 3, 1, 3, 3, 3, 3, 3, 1, 4, 5, 4, 4, 2, 2, 2, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 1],
        [1, 3, 3, 3, 3, 3, 1, 3, 3, 3, 3, 3, 1, 3, 3, 3, 3, 3, 1, 4, 5, 4, 2, 2, 2, 2, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 1],
        [1, 1, 1, 3, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 5, 4, 2, 2, 2, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 1],
        [1, 3, 3, 3, 3, 3, 1, 3, 3, 3, 3, 3, 1, 4, 4, 4, 4, 4, 4, 4, 5, 4, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1],
        [1, 3, 3, 3, 3, 3, 1, 3, 3, 3, 3, 3, 1, 4, 4, 4, 4, 4, 4, 5, 5, 4, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1],
        [1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 4, 4, 4, 4, 4, 4, 5, 4, 4, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1],
        [1, 3, 3, 3, 3, 3, 1, 3, 3, 3, 3, 3, 1, 4, 4, 4, 4, 4, 4, 5, 4, 4, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1],
        [1, 3, 3, 3, 3, 3, 1, 3, 3, 3, 3, 3, 1, 4, 4, 4, 4, 4, 4, 5, 4, 4, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1],
        [1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 5, 4, 4, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1],
        [1, 3, 3, 3, 3, 3, 1, 3, 3, 3, 3, 3, 1, 4, 4, 4, 4, 4, 4, 5, 4, 4, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1],
        [1, 3, 3, 3, 3, 3, 1, 3, 3, 3, 3, 3, 1, 4, 4, 4, 4, 4, 4, 5, 4, 4, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1],
        [1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 4, 4, 4, 4, 4, 5, 5, 4, 4, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1],
        [1, 3, 3, 3, 3, 3, 1, 3, 3, 3, 3, 3, 1, 4, 4, 4, 4, 4, 5, 4, 4, 4, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1],
        [1, 3, 3, 3, 3, 3, 1, 3, 3, 3, 3, 3, 1, 4, 4, 4, 4, 4, 5, 4, 4, 4, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 4, 4, 4, 4, 4, 5, 4, 4, 4, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1],
        [1, 3, 3, 3, 3, 3, 1, 3, 3, 3, 3, 3, 1, 4, 5, 5, 5, 5, 5, 4, 4, 4, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1],
        [1, 3, 3, 3, 3, 3, 1, 3, 3, 3, 3, 3, 1, 4, 5, 4, 4, 4, 4, 4, 4, 4, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1],
        [1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 4, 5, 4, 4, 4, 4, 4, 4, 4, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1],
        [1, 3, 3, 3, 3, 3, 1, 3, 3, 3, 3, 3, 1, 4, 5, 4, 4, 4, 4, 4, 4, 4, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1],
        [1, 3, 3, 3, 3, 3, 1, 3, 3, 3, 3, 3, 1, 4, 5, 4, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1],
        [1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 5, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1],
        [1, 3, 3, 3, 3, 3, 1, 3, 3, 3, 3, 3, 1, 4, 5, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1],
        [1, 3, 3, 3, 3, 3, 1, 3, 3, 3, 3, 3, 1, 4, 5, 4, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1],
        [1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 5, 5, 4, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1],
        [1, 3, 3, 3, 3, 3, 1, 3, 3, 3, 3, 3, 1, 4, 4, 4, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1],
        [1, 3, 3, 3, 3, 3, 1, 3, 3, 3, 3, 3, 1, 4, 4, 4, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ]};

app.listen();

app.get('/', (req, res) => {
    res.send('Hello World!');
});
        
app.get("/api/map", (req, res) => {
    res.json(grid)
});