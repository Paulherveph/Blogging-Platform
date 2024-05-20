document.addEventListener('FirebaseReady', function () {
  let ul = document.querySelector('.links-container');

  auth().onAuthStateChanged((user) => { 
    if (user) {
      // User is logged in
      ul.innerHTML += `
        <li class="link-item"><a href="/admin" class="link">Dashboard</a></li>
        <li class="link-item"><a href="#" class="link">Logout</a></li>
      `;
    } else {
      // No user is logged in
      ul.innerHTML += `
        <li class="link-item"><a href="/admin" onclick="LogoutUser()" class="link">Login</a></li>
      `;
    }
  });
});
