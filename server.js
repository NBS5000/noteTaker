const express = require('express');
const fs = require('fs');
const path = require('path');
var db = require('./db/db.json');
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
app.get('/api/notes', (req, res) => {
    // let dbJson;
    // fs.readFile('./db/db.json', function (err, data) {
    //     dbJson = JSON.parse(data);
    // });
    // res.json(dbJson);
    res.json(db);
});


// POST



// POST for saving note
app.post('/api/notes', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received saving a note`);

    
    // console.info(req.body);
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



        // db.push(saveNote);

        const response = {
            status: 'success',
            body: saveNote,
        };

        res.json(response);
    } else {
        res.json('Error in saving note');
    }
});



// PORT 

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);