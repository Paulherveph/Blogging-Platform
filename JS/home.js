import { db } from './firebase.js';
import { doc, getDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const blogSection = document.querySelector('.blogs-section');

const fetchBlogs = async () => {
  try {
    const blogsCollection = collection(db, "blogs");
    const blogsSnapshot = await getDocs(blogsCollection);
    blogsSnapshot.forEach((blog) => {
      if (blog.id !== decodeURI(location.pathname.split("/").pop())) {
        createBlog(blog);
      }
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
  }
};

fetchBlogs();

const createBlog = (blog) => {
  let data = blog.data();
  blogSection.innerHTML += `
    <div class="blog-card">
      <img src="${data.bannerImage}" class="blog-image" alt="Blog Banner">
      <h1 class="blog-title">${data.title.substring(0, 100)}...</h1>
      <p class="blog-overview">${data.article.substring(0, 200)}...</p>
      <a href="/${blog.id}" class="btn dark">read</a>
    </div>
  `;
};

const setupBlog = (data) => {
    const banner = document.querySelector('.banner');
    const blogTitle = document.querySelector('.title');
    const publish = document.querySelector('.published');

    banner.style.backgroundImage = `url(${data.bannerImage})`;
    blogTitle.textContent = data.title;
    publish.textContent = `Published at ${data.publishedAt} -- ${data.author}`;

    try {
        if (auth.currentUser && data.author === auth.currentUser.email.split('@')[0]) {
            let editBtn = document.getElementById('edit-blog-btn');
            editBtn.style.display = "inline";
            editBtn.href = `${blogId}/editor`;
        }
    } catch (error) {
        console.error('Error processing editing permissions:', error);
    } 

    const article = document.querySelector('.article');
    addArticle(article, data.article);
};

const addArticle = (ele, data) => {
    data.split("\n").filter(item => item.length).forEach(item => {
        if (item.startsWith('#')) {
            const hCount = item.match(/^#+/)[0].length;
            let tag = `h${hCount}`;
            ele.innerHTML += `<${tag}>${item.slice(hCount).trim()}</${tag}>`;
        } else if (item.startsWith("!") && item.includes("](") && item.endsWith(")")) {
            const separator = item.indexOf('](');
            const alt = item.slice(2, separator);
            const src = item.slice(separator + 2, item.length - 1);
            ele.innerHTML += `<img src="${src}" alt="${alt}" class="article-image">`;
        } else {
            ele.innerHTML += `<p>${item}</p>`;
        }
    });
};
