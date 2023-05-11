$(document).ready(function () {
  const token = localStorage.getItem("token");

  const container = $("<div id='container'></div>");

  $("body").append(container);

  if (!token) {
    window.location.href = "/login";
  }

  $.ajax({
    url: "/api/user/me",
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
    beforeSend: function () {
      // Show loading state
      container.append("<h1 class='loading-spinner'>Loading...</h1>");
    },
    success: function (data) {
      // Show the user's name
      container.append("<h1>Hello " + data.name + "</h1>");

      // Show the user's email
      container.append("<p>Email: " + data.email + "</p>");

      // Show the user's notes
      container.append("<h4>View Notes: <a href='/notes'>notes</a></h4>");

      // clear loading
      $(".loading-spinner").remove();
    },
    error: function (error) {
      // redirect to login if there is an error
      window.location.href = "/login";
    },
  });
});
