//html attachments
var $noteTitle = $(".note-title");
var $noteText = $(".note-textarea");
var $saveNoteBtn = $(".save-note");
var $newNoteBtn = $(".new-note");
var $editNoteBtn = $(".edit-note");
var $noteList = $(".list-container .list-group");

// Container for the text content currently displayed on the main page
var currentNote = {};

var callNotes = function () {
    return $.ajax({
        url:"/api/notes",
        method: "GET"
    });
};

var saveNotestoDB = function (note) {
    return $.ajax({
        url: "/api/notes",
        data: note,
        method: "POST"
    });
};

var dbNoteDelete = function (id) {
    return $.ajax({
        url: "api/notes/" + id,
        method: "DELETE"
    })
}

var displayNoteList = function (notes) {
    $noteList.empty();

    let listItems = [];

    for (let i = 0; i < notes.length; i++){
        let note = notes[i];
        note.id = i;
        let $li = $("<li class='list-group-item").data(note);
        let $span = $("<span>").text(note.title);
        let $delBtn = $("<i class='fas fa-trash float-right text-danger delete-note>");

        $li.append($span, $delBtn);
        listItems.push($li);
    }
};


//todo
/* Processes
    display data from API
 */

/* Tools
    toggleing visibility?
    display curent note
        edit that note

    show button
    show new not view
    

    master/main function?
 */