const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}));


app.use(express.static('public'));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
    console.info(`${req.method} response received for index.html file`)
})

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
    console.info(`${req.method} request for notes.html received`);

})

app.get('/api/notes', (req, res) => {
    
    // directions say to make sure to return all saved notes as JSON
    // to do so need to to the same method as POST 
    // bc sendFile send the entire file rather than the content itself (we want that data);

    fs.readFile(path.join('./db/db.json'),'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        } else {
            const parsedNoteData = JSON.parse(data);
            res.json(parsedNoteData);
            console.info(`${req.method} request has been received to get notes`);
        }
    });
})

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add a note`);

    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title, 
            text,
            id: uuidv4(),
        };

        const noteString = JSON.stringify(newNote);

        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
            } else {
                const parsedNote = JSON.parse(data);
                parsedNote.push(newNote);


                fs.writeFile('./db/db.json', JSON.stringify(parsedNote, null, 4), (err) => 
                    err
                    ? console.error(err)
                    : console.log(
                        `Note for ${newNote.title} has been written to JSON file`
                        )
                );
            }
        })
        const response = {
            status: 'success',
            body: newNote,
          };

          console.log(response);
          res.status(201).json(response);
        } else {
          res.status(500).json('Error in posting review');
        }
})


app.delete('/api/notes/:id', (req, res) => {
    const { id } = req.params;

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
            }else {
                const notes = JSON.parse(data);
                const updatedNotes = notes.filter(note => note.id !== id);

                fs.writeFile('./db/db.json', JSON.stringify(updatedNotes, null, 4), (err) => {
                   if (err){
                    console.error(err)
                   } else {
                    console.log(`Note has been deleted`);
                    res.sendFile(path.resolve('./db/db.json'));
                   }
                }
                );
            }
    })
})



app.listen(PORT, () => {
    console.info(`app listening at http://localhost:${PORT}`);
})