$(document).ready(function () {
  // get the user's token from local storage
  let token = localStorage.getItem("token");

  // if the token is not present, redirect to login page
  if (!token) {
    window.location.href = "/login";
  }

  // if the token is present, display the notes page
  $("body").append("<h1 class='page-title'>Notes</h1>");
  $("body").append("<div id='notes-container'  class='grid'></div>");

  // fetch notes from server and display them
  $.ajax({
    url: "/api/notes",
    type: "GET",
    headers: {
      Authorization: "Bearer " + token, // include the token in the request headers
    },
    beforeSend: function () {
      // Show loading state
      $("#notes-container").html("<p>Loading...</p>");
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
