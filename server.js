const express = require('express');
const fs = require('fs');
const path = require('path');
let db = require('./db/db.json');
const uuid = require('./helpers/uuid');

const PORT = process.env.PORT || 3001;

const app = express();

// Middleware *****
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes *****
// GET

// GET Route for homepage
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);
// GET Route for notes page
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);
// GET Route for notes list
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', { encoding: "utf-8" },function (err, data) {
        if(err){ 
            return res.status(500).json({ error: err.message})
        }
        res.json(JSON.parse(data));
    });
});

// POST

// POST for saving note
app.post('/api/notes', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received saving a note`);
    const theBody = req.body;
    let title = theBody.title;
    let text = theBody.text;
    if (theBody) {
        let saveNote = {
            id: uuid(),
            title,
            text,
        };
        fs.readFile('./db/db.json', function (err, data) {
            const dbJson = JSON.parse(data);
            console.log(dbJson);
            dbJson.push(saveNote);
            console.log(dbJson);
            fs.writeFile('./db/db.json', JSON.stringify(dbJson),function(err, result) {
                if(err) console.log('Error writing to db: ', err);
            });
        });
        const response = {
            status: 'success',
            body: saveNote,
        };
        res.json(response);
    } else {
        res.json('Error in saving note');
    }
});

// DELETE 
app.delete('/api/notes/:id', (req, res) =>{
    console.info(`${req.method} request received deleting a note`);
    let x = req.params.id;
    fs.readFile('./db/db.json', function (err, data) {
        const dbJson = JSON.parse(data);
        const removeById = (arr,id) => {
            const requiredIndex = arr.findIndex(el => {
                return el.id === String(x);
            });
            if(requiredIndex === -1){
                return false;
            };
            return !!arr.splice(requiredIndex, 1);
        }
        removeById(dbJson,x);
        fs.writeFile('./db/db.json', JSON.stringify(dbJson),function(err, result) {
            if(err) console.log('Error writing to db: ', err);
        });
    });
    const response = {
        status: 'success'
    };
    res.json(response);
});

// PORT *****
app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);