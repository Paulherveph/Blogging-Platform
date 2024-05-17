const blogSection = document.querySelector('.blogs-section');

db.collection("blogs").get().then((blogs) => {
  blogs.forEach(blog => {
    if (blog.id !== decodeURI(location.pathname.split("/").pop())) {
      createBlog(blog);
    }
  });
}).catch(error => console.error('Error fetching blogs:', error));

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
