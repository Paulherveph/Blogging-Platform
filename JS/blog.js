// Import necessary Firebase modules
import { db, auth, doc, getDoc } from './firebase.js';

// Extract the blogId from the URL query parameters
const params = new URLSearchParams(window.location.search);
let blogId = params.get('blogId');

// If blogId is not present in the query params, redirect to home page
if (!blogId) {
  console.error('BlogId not found in URL parameters.');
  location.replace("/");
} else {
  console.log("Fetching blog with blogId:", blogId); // Debug output to check blogId

  // Construct a reference to the blog document in Firestore
  let docRef = doc(db, "blogs", blogId);

  // Fetch the blog document from Firestore
  getDoc(docRef)
    .then((doc) => {
      if (doc.exists()) {
        setupBlog(doc.data()); // Call setupBlog function if document exists
      } else {
        console.log(`Blog document with id '${blogId}' does not exist.`);
        location.replace("/"); // Redirect to home page if blog document doesn't exist
      }
    })
    .catch((error) => {
      console.error("Error fetching document:", error);
      // Handle the error appropriately, e.g., redirect or display a message to the user
      location.replace("/"); // Redirect to home page on error
    });
}

// Function to set up the blog content on the page
const setupBlog = (data) => {
  console.log("Setting up blog with data:", data); // Debug output to check data

  // Select elements from the DOM to display blog information
  const banner = document.querySelector('.banner');
  const blogTitle = document.querySelector('.title');
  const publish = document.querySelector('.published');
  const editBtn = document.getElementById('edit-blog-btn');

  // Update DOM elements with blog data
  banner.style.backgroundImage = `url(${data.bannerImage})`;
  blogTitle.innerHTML = data.title;
  publish.innerHTML = `${data.publishedAt} -- ${data.author}`;

  // Check if the current user is the author of the blog
  auth.onAuthStateChanged((user) => {
    if (user && data.author === user.email.split('@')[0]) {
      // Show edit button
      editBtn.style.display = "inline";
      // Update edit button href with the correct blogId
      editBtn.href = `/editor.html?blogId=${blogId}`; // Set proper URL for editing
    }
  });

  // Select article element and add article content
  const article = document.querySelector('.article');
  addArticle(article, data.article);
};

// Function to parse article content and add to the DOM
const addArticle = (ele, data) => {
  data = data.split("\n").filter(item => item.length); // Split data into paragraphs

  data.forEach(item => {
    if (item.startsWith('#')) {
      let hCount = 0;
      let i = 0;
      while (item[i] === '#') {
        hCount++;
        i++;
      }
      let tag = `h${hCount}`;
      ele.innerHTML += `<${tag}>${item.slice(hCount + 1).trim()}</${tag}>`; // Add heading tags
    } else if (item.startsWith('![') && item.includes('](') && item.endsWith(')')) {
      let separator = item.indexOf('](');
      let alt = item.slice(2, separator);
      let src = item.slice(separator + 2, item.length - 1);
      ele.innerHTML += `<img src="${src}" alt="${alt}" class="article-image">`; // Add image tag
    } else {
      ele.innerHTML += `<p>${item}</p>`; // Add paragraph tags
    }
  });
};
