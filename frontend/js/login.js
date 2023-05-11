$(document).ready(function () {
  let heading = $("<h1>Login Page</h1>");
  // Create the login form
  let loginForm = $("<form></form>");
  let emailInput = $('<input type="email" name="email" placeholder="Email">');
  let passwordInput = $(
    '<input type="password" name="password" placeholder="Password">'
  );
  let submitButton = $('<button type="submit">Login</button>');
  let loadingIndicator = $(
    '<div class="loading-spinner style="display:none">Loading...</div>'
  ).hide();

  // Add the form elements to the form
  loginForm.append(emailInput, passwordInput, submitButton, loadingIndicator);
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
        // window.location.href = "/notes";
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
