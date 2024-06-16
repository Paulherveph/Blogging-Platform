import { auth, db, signInWithEmailAndPassword, collection, query, where, getDocs, doc, deleteDoc } from './firebase.js';

document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.getElementById("loginFormElement");

  auth.onAuthStateChanged((user) => {
    const loginElement = document.querySelector('.login');
    if (loginElement) {
      if (user) {
        loginElement.style.display = 'none';
        getUserWrittenBlogs(); // Fetch user's written blogs
      } else {
        loginElement.style.display = 'flex';
      }
    }
  });

  loginForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const email = loginForm.loginEmail.value;
    const password = loginForm.loginPassword.value;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Login successful
        alert('Login Successful');
        document.querySelector('.login').style.display = 'none';
        getUserWrittenBlogs(); // Fetch user's written blogs
      })
      .catch((error) => {
        // Handle errors here
        console.error('Error logging in:', error.message);
      });
  });

  const getUserWrittenBlogs = () => {
    if (!auth.currentUser) return; // Exit if user is not logged in

    const blogsQuery = query(
      collection(db, 'blogs'),
      where('author', '==', auth.currentUser.email.split('@')[0])
    );

    getDocs(blogsQuery)
      .then((blogs) => {
        const blogSection = document.querySelector('.blogs-section');
        if (blogSection) {
          blogSection.innerHTML = ''; // Clear existing content
          blogs.forEach((blog) => {
            createBlog(blog, blogSection);
          });
        }
      })
      .catch((error) => {
        console.error("Error getting user's blogs:", error);
      });
  };

  const createBlog = (blog, blogSection) => {
    const data = blog.data();
    const blogCard = document.createElement('div');
    blogCard.classList.add('blog-card');
    blogCard.innerHTML = `
      <img src="${data.bannerImage}" class="blog-image" alt="Blog Banner">
      <h1 class="blog-title">${data.title.substring(0, 100) + '...'}</h1>
      <p class="blog-overview">${data.article.substring(0, 200) + '...'}</p>
      <a href="/${blog.id}" class="btn dark">read</a>
      <a href="/${blog.id}/editor" class="btn grey" data-blog-id="${blog.id}">edit</a>
      <a href="#" onclick="deleteBlog('${blog.id}')" class="btn danger">delete</a>
    `;
    blogSection.appendChild(blogCard);

    const editBtn = blogCard.querySelector('.btn.grey');
    if (editBtn) {
      editBtn.addEventListener('click', handleEditClick);
    }
  };

  const handleEditClick = (event) => {
    event.preventDefault();
    const blogId = event.target.getAttribute('data-blog-id');
    if (blogId) {
      window.location.href = `/editor.html?blogId=${blogId}`;
    }
  };

  window.deleteBlog = (id) => {
    if (confirm('Are you sure you want to delete this blog?')) {
      deleteDoc(doc(db, 'blogs', id))
        .then(() => {
          location.reload();
        })
        .catch((error) => {
          console.error('Error deleting blog:', error);
        });
    }
  };
});
