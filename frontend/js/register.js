$(document).ready(function () {
  let heading = $("<h1>Register Page</h1>");
  // Create the login form
  let registerForm = $("<form></form>");
  let nameInput = $('<input type="text" name="name" placeholder="Name">');
  let emailInput = $('<input type="email" name="email" placeholder="Email">');
  let passwordInput = $(
    '<input type="password" name="password" placeholder="Password">'
  );
  let submitButton = $('<button type="submit">Register</button>');
  let newUser = $('<p>Already have an account? <a href="/login">Login</a></p>');
  let loadingIndicator = $(
    '<div class="loading-spinner style="display:none">Loading...</div>'
  ).hide();

  // Add the form elements to the form
  registerForm.append(
    nameInput,
    emailInput,
    passwordInput,
    submitButton,
    newUser,
    loadingIndicator
  );

  const token = localStorage.getItem("token");
  if (token) {
    window.location.href = "/login";
  }

  $("body").append(heading, registerForm);

  // Handle form submission
  registerForm.submit(function (event) {
    event.preventDefault();
    loadingIndicator.show();
    submitButton.hide();

    let name = nameInput.val();
    let email = emailInput.val();
    let password = passwordInput.val();
    $.ajax({
      url: "/api/auth/register",
      method: "POST",
      data: { name, email, password },
      success: function (response) {
        // Save the token in local storage
        localStorage.setItem("token", response.token);

        // User is logged in, redirect to dashboard or profile page
        window.location.href = "/notes";
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
