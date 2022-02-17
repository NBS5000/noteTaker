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
    let newTitle = theBody.title;
    let newText = theBody.text;

    if (theBody) {
        const saveNote = {
            id: uuid(),
            newTitle,
            newText,
        };

        console.info(saveNote);
        // const parsedData = JSON.parse(saveNote);
        // parsedData.push(content);

        db.push(saveNote);
        

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