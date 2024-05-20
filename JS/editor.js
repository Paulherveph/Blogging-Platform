import { db } from './firebase.js';

document.addEventListener('DOMContentLoaded', () => {
  // Check if we are editing an existing blog post
  let blogiID = location.pathname.split("/");
  blogiID.shift(); // Remove the first element which is empty from the array

  // Selecting DOM elements
  const blogTitleField = document.querySelector('.title');
  const articleField = document.querySelector('.article');

  const bannerImage = document.querySelector('#banner-upload');
  const banner = document.querySelector('.banner'); 
  let bannerPath; 

  const publishBtn = document.querySelector('.publish-btn');
  const uploadInput = document.querySelector('#image-upload');

  // Event listener for banner image upload
  bannerImage.addEventListener('change', () => {
    uploadImage(bannerImage, "banner");
  });

  // Event listener for article image upload
  uploadInput.addEventListener('change', () => {
    uploadImage(uploadInput, "image");
  });

  // Function to handle image uploads
  const uploadImage = (uploadFile, uploadType) => {
    const [file] = uploadFile.files;
    if (file && file.type.includes("image")) {
      const formData = new FormData();
      formData.append('image', file);

      fetch('/upload', {
        method: 'POST',
        body: formData
      })
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to upload image');
        }
        return res.json();
      })
      .then(data => {
        if (uploadType === "image") {
          addImage(`${location.origin}/${data}`, file.name); // Fixed data access
        } else {
          bannerPath = `${location.origin}/${data}`;
          banner.style.backgroundImage = `url("${bannerPath}")`;
        }
      })
      .catch(error => {
        console.error('Error uploading image:', error);
        // Handle error here
      });
    } else {
      alert("Please upload an image file.");
    }
  };

  // Function to insert uploaded image into the article content
  const addImage = (imagePath, alt) => {
    let curPos = articleField.selectionStart;
    let textToInsert = `\r![${alt}](${imagePath})\r`;
    articleField.value = articleField.value.slice(0, curPos) + textToInsert + articleField.value.slice(curPos);
  };

  // Event listener for the publish button to save blog post data
  publishBtn.addEventListener('click', () => {
    if (articleField.value.length && blogTitleField.value.length) {
      let docName;
      if (blogiID[0] === 'editor') {
        // Generate a unique ID for the new blog post
        let letters = 'abcdefghijklmnopqrstuvwxyz';
        let blogTitle = blogTitleField.value.replace(/\s+/g, '-').toLowerCase();
        let id = '';
        for (let i = 0; i < 4; i++) {
          id += letters[Math.floor(Math.random() * letters.length)];
        }
        docName = `${blogTitle}-${id}`;
      } else {
        docName = decodeURI(blogiID[0]);
      }

      let date = new Date();
      let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

      // Save blog post data to Firestore
      db.collection("blogs").doc(docName).set({
        title: blogTitleField.value,
        article: articleField.value,
        bannerImage: bannerPath,
        publishedAt: `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`,
        author: auth.currentUser.email.split("@")[0] // this will return ["example","@gmail.com"]
      })
      .then(() => {
        console.log('Data entered successfully');
      })
      .catch((error) => {
        console.error('Error saving data:', error); // Log the error to the console
      });
    } else {
      // If the necessary fields are not filled, display an alert or handle it appropriately
      alert("Please provide both a blog title and content.");
    }
  });
});

// Check if the user is logged in
auth.onAuthStateChanged((user) => {
  if (!user) {
    location.replace("/admin"); // Redirect to admin route if no one is logged in
  }
}); 

if (blogiID[0] !== "editor") {
  // We are in an existing blog edit route
  let docRef = db.collection("blogs").doc(decodeURI(blogiID[0]));
  docRef.get().then((doc) => {
    if (doc.exists) {
      let data = doc.data();
      bannerPath = data.bannerImage; // Fixed variable name
      banner.style.backgroundImage = `url(${bannerPath})`;
      blogTitleField.value = data.title;
      articleField.value = data.article;
    } else {
      location.replace("/");  // Redirect to home route
    }
  });
}
