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
    url: "/api/notes",
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

var getNotelist = function () {
  return callNotes().then(function (data) {
    displayNoteList(data);
  });
};

var displayNoteList = function (notes) {
  $noteList.empty();

  var listItems = [];

  for (let i = 0; i < notes.length; i++) {
    let note = notes[i];
    note.id = i;
    let $li = $("<li class='list-group-item").data(note);
    let $span = $("<span>").text(note.title);
    let $delBtn = $("<i class='fas fa-trash float-right text-danger delete-note>");

    $li.append($span, $delBtn);
    listItems.push($li);
  }
};

var displayActiveNote = function () {
  $saveNoteBtn.hide();
  if (currentNote.id || currentNote.id === 0) {
    $editNoteBtn.show();
    $noteTitle.attr("readonly", true);
    $noteText.attr("readonly", true);
    $noteTitle.val(currentNote.title);
    $noteText.val(currentNote.text);
  } else {
    $noteTitle.attr("readonly", false);
    $noteText.attr("readonly", false);
    $noteTitle.val("");
    $noteText.val("");
  }
};

var editNote = function () {
  $editNoteBtn.hide();
  $saveNoteBtn.show();
  $noteTitle.attr("readonly", false);
  $noteText.attr("readonly", false);
};

var saveNote = function () {
  if (currentNote.id || currentNote.id === 0) { //updating current note
    currentNote.title = $noteTitle.val();
    currentNote.text = $noteText.val();
    saveNotestoDB(currentNote).then(function (data) {
      currentNote = {};
      getNotelist();
      displayActiveNote();
    });
  } else {   //create a new note object
    var newNote = {
      title: $noteTitle.val(),
      text: $noteText.val()
    };

    saveNotestoDB(newNote).then(function (data) {
      getNotelist();
      displayActiveNote();
    });
  }
};

var pageNoteDelete = function (event) {
  event.stopPropagation();

  var note = $(this)
    .parent(".list-group-item")
    .data();

  if (currentNote.id === note.id) {
    currentNote = {};
  }

  deleteNote(note.id).then(function () {
    getNotelist();
    displayActiveNote();
  });
};

var selectListNote = function () {
  currentNote = $(this).data();
  displayActiveNote();
};

var createNewNote = function () {
  $editNoteBtn.hide();
  currentNote = {};
  displayActiveNote();
};

var handleRenderSaveBtn = function () {
  if (!$noteTitle.val().trim() || !$noteText.val().trim()) {
    $saveNoteBtn.hide();
  } else {
    $saveNoteBtn.show();
  }
};

$saveNoteBtn.on("click", saveNote);
$editNoteBtn.on("click", editNote);
$noteList.on("click", ".list-group-item", selectListNote);
$newNoteBtn.on("click", createNewNote);
$noteList.on("click", ".delete-note", pageNoteDelete);
$noteTitle.on("keyup", handleRenderSaveBtn);
$noteText.on("keyup", handleRenderSaveBtn);

//functionally the master/main function
getNotelist();