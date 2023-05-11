$(document).ready(function () {
  // get the user's token from local storage
  let token = localStorage.getItem("token");

  // if the token is not present, redirect to login page
  if (!token) {
    window.location.href = "/login";
  }

  // if the token is present, display the notes page
  const navbar = $("<div class='navbar'></div>");

  // link to the notes page
  const notesLink = $("<h3>Go to profile page: <a href='/'>Me</a></h3><br/>");
  navbar.append(notesLink);

  // create the logout button
  const logoutButton = $("<button>Logout</button>");
  logoutButton.click(function () {
    localStorage.removeItem("token");
    window.location.href = "/login";
  });

  navbar.append(logoutButton);

  // create the form to add a new note
  const addNoteHeading = $("<h2>Add a Note</h2>");
  const addNoteForm = $("<form id='add-note-form'></form>");
  const titleInput = $("<input type='text' name='title' placeholder='Title'>");
  const contentInput = $(
    "<textarea name='content' placeholder='Content'></textarea>"
  );
  const addNoteLoading = $("<h4>Adding Note...</h4>").hide();
  const submitButton = $("<button type='submit'>Add Note</button>");

  addNoteForm.append(
    addNoteHeading,
    titleInput,
    contentInput,
    addNoteLoading,
    submitButton
  );

  $("body").append(navbar);
  $("body").append("<hr/>");
  $("body").append(addNoteForm);
  $("body").append("<hr/><h2>Notes</h2>");
  $("body").append("<div id='notes-container'  class='grid'></div>");

  // handle form submission
  addNoteForm.submit(function (event) {
    event.preventDefault();

    const title = titleInput.val();
    const content = contentInput.val();

    $.ajax({
      url: "/api/notes",
      type: "POST",
      headers: {
        Authorization: "Bearer " + token, // include the token in the request headers
      },
      data: {
        title: title,
        content: content,
      },
      beforeSend: function () {
        // Show loading state
        addNoteLoading.show();
        submitButton.hide();
      },
      success: function (data) {
        // add the new note to the notes container
        console.log("add note data: ", data);
        const { newNote } = data;
        const createdDate = new Date(newNote.created_at);
        const formattedDate = createdDate.toLocaleString();

        $("#notes-container").append(
          "<div class='note'>" +
            "<h2>" +
            newNote.title +
            "</h2><p>" +
            newNote.content +
            "</p>" +
            "<span>" +
            formattedDate +
            "</span>" +
            "</div>"
        );

        // clear the form inputs
        titleInput.val("");
        contentInput.val("");

        // hide the loading state
        addNoteLoading.hide();
        submitButton.show();
      },
      error: function (xhr, status, error) {
        // handle error responses
        console.error(error);
      },
    });
  });

  // fetch notes from server and display them
  $.ajax({
    url: "/api/notes",
    type: "GET",
    headers: {
      Authorization: "Bearer " + token, // include the token in the request headers
    },
    beforeSend: function () {
      // Show loading state
      $("#notes-container").append("<p>Loading...</p>");
    },
    success: function (data) {
      // Clear loading state
      $("#notes-container").empty();
      const { notes } = data;

      console.log(notes);

      notes.forEach(function (note) {
        const createdDate = new Date(note.created_at);
        const formattedDate = createdDate.toLocaleString();

        $("#notes-container").append(
          "<div class='note'>" +
            "<h2>" +
            note.title +
            "</h2><p>" +
            note.content +
            "</p>" +
            "<span>" +
            formattedDate +
            "</span>" +
            "</div>"
        );
      });
    },
    error: function (xhr, status, error) {
      // handle error responses
      console.error(error);
    },
  });
});
