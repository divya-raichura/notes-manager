$(document).ready(function () {
  let heading = $("<h1>Login Page</h1>");
  // Create the login form
  let loginForm = $("<form></form>");
  let emailInput = $('<input type="email" name="email" placeholder="Email">');
  let passwordInput = $(
    '<input type="password" name="password" placeholder="Password">'
  );
  let submitButton = $('<button type="submit">Login</button>');
  let newUser = $(
    '<p>Don\'t have an account? <a href="/register">Register</a></p>'
  );
  let loadingIndicator = $(
    '<div class="loading-spinner style="display:none">Loading...</div>'
  ).hide();

  // Add the form elements to the form
  loginForm.append(
    emailInput,
    passwordInput,
    submitButton,
    newUser,
    loadingIndicator
  );

  const token = localStorage.getItem("token");
  if (token) {
    // show already logged in and give link to notes page
    const loggedInContainer = $("<div class='container'></div>");
    const alreadyLoggedIn = $("<h1>You are already logged in.</h1>");
    const notesLink = $(
      "<p><a href='/notes'>Click here to go to the notes page.</a><br/>Or</p>"
    );
    const logoutButton = $("<button >Logout</button>");

    logoutButton.click(function () {
      localStorage.removeItem("token");
      window.location.href = "/login";
      return;
    });

    loggedInContainer.append(alreadyLoggedIn, notesLink, logoutButton);
    $("body").append(loggedInContainer);

    return;
  }

  $("body").append(heading, loginForm);

  // Handle form submission
  loginForm.submit(function (event) {
    event.preventDefault();
    loadingIndicator.show();
    submitButton.hide();

    let email = emailInput.val();
    let password = passwordInput.val();
    $.ajax({
      url: "/api/auth/login",
      method: "POST",
      data: { email: email, password: password },
      success: function (response) {
        // Save the token in local storage
        localStorage.setItem("token", response.token);

        // User is logged in, redirect to dashboard or profile page
        window.location.href = "/notes";
        return;
      },
      error: function (xhr, status, error) {
        submitButton.show();
        alert(
          `Login failed: ${
            xhr.responseJson
              ? xhr.responseJson.message
              : xhr.responseText
              ? xhr.responseText
              : error
          }}`
        );
      },
      complete: function () {
        loadingIndicator.hide();
      },
    });
  });
});
