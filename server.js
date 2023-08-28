const express = require('express');
const path = require('path');
const fs = require('fs');

const PORT = 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}));


app.use(express.static('public'));

app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './Develop/db/db.json'));

    console.info(`${req.method} request has been received to get notes`);

})

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add a review`);

    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title, 
            text,
        };

        const noteString = JSON.stringify(newNote);

        fs.readFile('./Develop/db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
            } else {
                const parsedNote = JSON.parse(data);
                parsedNote.push(newNote);


                fs.writeFile('./Develop/db/db.json', JSON.stringify(parsedNote, null, 4), (err) => 
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





app.listen(PORT, () => {
    console.info(`app listening at http://localhost:${PORT}`);
})