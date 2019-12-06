//File Dependancies
var express = require("express");
var path = require("path");
var fs = require('fs');
var util = require('util');


//Express Setup
var app = express();
var PORT = process.env.PORT || 4040;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "./public")));


// Global Variables
let writefileAsync = util.promisify(fs.writeFile);
let appendfileAsync = util.promisify(fs.appendFile);
let readFileAsync = util.promisify(fs.readFile);

// Database storage,
// Takes the contents of the API, stores as copy, appends to it, and overwrites it on update,
let noteList;

// Routes:
// Home Route:
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});
// Note route:
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});
// Note API route:
app.get("/api/notes", function (req, res) {
    readFileAsync(path.join(__dirname, "./db/db.json"), "utf8")
        .then(function (data) {
            return res.json(JSON.parse(data));
        });
});

//Post
app.post("/api/notes", function (req, res) {
    let newNote = req.body;
    readFileAsync(path.join(__dirname, "./db/db.json"), "utf8")
        .then(function (data) {
            notesList = JSON.parse(data);
            if (newNote.id || newNote.id===0) {   
                let curNote = notesList[newNote.id];
                curNote.title = newNote.title;
                curNote.text = newNote.text;
            } else {  
                noteList.push(newNote);
            }
            //overwrites old db file
            writefileAsync(path.join(__dirname, "./db/db.json"), JSON.stringify(notesList))
                .then(function () {
                    console.log("-A new note was writed to db.json");
                })
        });
    res.json(newNote);
});

//Delete
app.delete("/api/notes/:id", function (req, res) {
    var id = req.params.id;
    readFileAsync(path.join(__dirname, "./db/db.json"), "utf8")
        .then(function (data) {
            noteList = JSON.parse(data);
            noteList.splice(id, 1);
            writefileAsync(path.join(__dirname, "./db/db.json"), JSON.stringify(notesList))
                .then(function () {
                    console.log("-Note was deleted from db.json");
                })
        });
    res.json(id);
});

//Server Listener
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});