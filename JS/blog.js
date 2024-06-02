import { db, /* auth, */ collection, doc, getDoc } from './firebase.js';

let blogId = decodeURI(location.pathname.split("/").pop());

let docRef = doc(db, "blogs", blogId);

getDoc(docRef)
  .then((doc) => {
    if (doc.exists()) {
      setupBlog(doc.data());
    } else {
      location.replace("/");
    }
  })
  .catch((error) => {
    console.error("Error fetching document:", error);
    // Handle the error appropriately, e.g., redirect or display a message to the user
  });

const setupBlog = (data) => {
    const banner = document.querySelector('.banner');
    const blogTitle = document.querySelector('.title');
    const publish = document.querySelector('.published');

    banner.style.backgroundImage = `url(${data.bannerImage})`;

    blogTitle.innerHTML = data.title;
    publish.innerHTML = `${data.publishedAt} -- ${data.author}`;

/*     try {
        // Ensure the current user is available
        if (auth.currentUser && data.author === auth.currentUser.email.split('@')[0]) {
            let editBtn = document.getElementById('edit-blog-btn');
            editBtn.style.display = "inline";
            editBtn.href = `${blogId}/editor`;
        }
    } catch (error) {
        console.error("Error checking editing permissions: ", error);
        // Optionally, handle the error more gracefully, like showing a user-friendly message
    } */

    const article = document.querySelector('.article');
    addArticle(article, data.article);
};

const addArticle = (ele, data) => {
    data = data.split("\n").filter(item => item.length);

    data.forEach(item => {
        if (item.startsWith('#')) {
            let hCount = 0;
            let i = 0;
            while (item[i] === '#') {
                hCount++;
                i++;
            }
            let tag = `h${hCount}`;
            ele.innerHTML += `<${tag}>${item.slice(hCount + 1).trim()}</${tag}>`;
        } else if (item.startsWith('![') && item.includes('](') && item.endsWith(')')) {
            let separator = item.indexOf('](');
            let alt = item.slice(2, separator);
            let src = item.slice(separator + 2, item.length - 1);
            ele.innerHTML += `<img src="${src}" alt="${alt}" class="article-image">`;
        } else {
            ele.innerHTML += `<p>${item}</p>`;
        }
    });
};

