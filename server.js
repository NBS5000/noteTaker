const express = require('express');
const path = require('path');
const db = require('./db/db.json');
const uuid = require('./helpers/uuid');

const PORT = process.env.PORT || 3001;

const app = express();

// Middleware *****
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use('/api', api);
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
app.get('/api/notes', (req, res) =>
    res.json(db)
);


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
        console.info("Test");
        const saveNote = {
            id: uuid(),
            title,
            text,
        };
        console.info("Test2");
        console.info(saveNote);

        console.info("Test3");
        db.push(saveNote);
        console.info("Test4");

        const response = {
            status: 'success',
            body: saveNote,
        };
        console.info("Test5");
        console.info(response);
        res.json(response);
    } else {
        res.json('Error in saving note');
    }
});



// PORT 

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);