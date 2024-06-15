import { auth } from './firebase.js'; 

document.addEventListener('DOMContentLoaded', function () {
  let ul = document.querySelector('.links-container');

  auth.onAuthStateChanged((user) => { 
    if (user) {
      // User is logged in
      ul.innerHTML += `
        <li class="link-item"><a href="/admin" class="link">Dashboard</a></li>
      `;
    } else {
      // No user is logged in
      ul.innerHTML += `
        <li class="link-item"><a href="/login" class="link">Login</a></li>
      `;
    }
  });
});

function LogoutUser() {
  auth.signOut().then(() => {
    location.reload();
  }).catch((error) => {
    console.error('Error signing out:', error);
  });
}
