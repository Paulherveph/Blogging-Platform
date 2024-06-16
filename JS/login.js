<!DOCTYPE html>
<!-- Coding By CodingNepal - www.codingnepalweb.com -->
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login And Register</title>
  <link rel="stylesheet" href="CSS/login.css">
</head>
<body>
  <div class="form-container">
    <div class="wrapper" id="loginForm">
      <form id="loginFormElement" action="#">
        <h2>Login</h2>
        <div class="input-field">
          <input type="text" id="loginEmail" required>
          <label>Enter your email</label>
        </div>
        <div class="input-field">
          <input type="password" id="loginPassword" required>
          <label>Enter your password</label>
        </div>
        <div class="forget">
          <label for="remember">
            <input type="checkbox" id="remember">
            <p>Remember me</p>
          </label>
          <a href="#">Forgot password?</a>
        </div>
        <button type="submit">Log In</button>
        <div class="register">
          <p>Don't have an account? <a href="#" id="showRegister">Register</a></p>
        </div>
      </form>
    </div>

    <div class="wrapper" id="registerForm" style="display: none;">
      <form id="registerFormElement" action="#">
        <h2>Register</h2>
        <div class="input-field">
          <input type="text" id="registerEmail" required>
          <label>Enter your email</label>
        </div>
        <div class="input-field">
          <input type="password" id="registerPassword" required>
          <label>Create a password</label>
        </div>
        <div class="input-field">
          <input type="password" id="confirmPassword" required>
          <label>Confirm your password</label>
        </div>
        <button type="submit">Register</button>
        <div class="register">
          <p>Already have an account? <a href="#" id="showLogin">Login</a></p>
        </div>
      </form>
    </div>
  </div>

  <script type="module" src="https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js"></script>
  <script type="module" src="https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js"></script>
  <script type="module" src="js/login.js"></script>

</body>
</html>
