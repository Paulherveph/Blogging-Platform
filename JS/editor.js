// editor.js

import { db, imagesRef, auth } from './firebase.js';
import { collection, doc, setDoc, getDoc } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import { uploadBytes, getDownloadURL, ref } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js';

document.addEventListener('DOMContentLoaded', () => {
  auth.onAuthStateChanged((user) => {
    if (!user) {
      location.replace("/editor");
    } else {
      const blogID = getBlogIdFromUrl();

      const blogTitleField = document.querySelector('.title');
      const articleField = document.querySelector('.article');
      const bannerImage = document.querySelector('#banner-upload');
      const banner = document.querySelector('.banner');
      let bannerPath;

      const publishBtn = document.querySelector('.publish-btn');
      const uploadInput = document.querySelector('#image-upload');

      bannerImage.addEventListener('change', (e) => handleImageUpload(e.target.files[0], "banner"));
      uploadInput.addEventListener('change', (e) => handleImageUpload(e.target.files[0], "image"));

      async function handleImageUpload(file, uploadType) {
        if (file && file.type.includes("image")) {
          try {
            const downloadURL = await uploadImageToFirebase(file, file.name);
            console.log(`Image uploaded successfully. downloadURL: ${downloadURL}`);
            if (uploadType === "image") {
              addImage(downloadURL, file.name);
            } else {
              bannerPath = downloadURL;
              banner.style.backgroundImage = `url("${bannerPath}")`;
            }
          } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error uploading image: ' + error.message);
          }
        } else {
          alert("Please upload an image file.");
        }
      }

      async function uploadImageToFirebase(file, fileName) {
        const imageRef = ref(imagesRef, fileName);
        const snapshot = await uploadBytes(imageRef, file);
        return getDownloadURL(snapshot.ref);
      }

      function addImage(imagePath, alt) {
        console.log(`addImage called with imagePath: ${imagePath} and alt: ${alt}`);
        const curPos = articleField.selectionStart;
        const textToInsert = `\r![${alt}](${imagePath})\r`;

        // Insert the image markdown at the cursor position
        const existingText = articleField.value;
        const textBefore = existingText.slice(0, curPos);
        const textAfter = existingText.slice(curPos);
        const newText = textBefore + textToInsert + textAfter;

        articleField.value = newText;
      }

      publishBtn.addEventListener('click', async () => {
        if (articleField.value.length && blogTitleField.value.length) {
          const docName = blogID ? blogID : generateDocName(blogTitleField.value);
          const date = new Date();
          const publishedAt = `${date.getDate()} ${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
          const author = auth.currentUser.email.split("@")[0];

          try {
            await setDoc(doc(collection(db, "blogs"), docName), {
              title: blogTitleField.value,
              article: articleField.value,
              bannerImage: bannerPath,
              publishedAt,
              author
            });
            alert('Blog post published successfully');
            location.href = `/${docName}`;
          } catch (error) {
            console.error('Error saving data:', error);
            if (error.message.includes("Function setDoc() called with invalid data. Unsupported field value: undefined")) {
              alert("Error saving data: Please ensure all fields, including the banner image, are filled out correctly.");
            } else {
              alert('Error saving data: ' + error.message);
            }
          }
        } else {
          alert("Please provide both a blog title and content.");
        }
      });

      function generateDocName(title) {
        const letters = 'abcdefghijklmnopqrstuvwxyz';
        const blogTitle = title.replace(/\s+/g, '-').toLowerCase();
        let id = '';
        for (let i = 0; i < 4; i++) {
          id += letters[Math.floor(Math.random() * letters.length)];
        }
        return `${blogTitle}-${id}`;
      }

      async function fetchBlogData() {
        if (!blogID) return;

        const docRef = doc(collection(db, "blogs"), blogID);
        try {
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            bannerPath = data.bannerImage;
            banner.style.backgroundImage = `url(${bannerPath})`;
            blogTitleField.value = data.title;
            articleField.value = data.article;
          } else {
            location.replace("/");
          }
        } catch (error) {
          console.error('Error fetching document:', error);
          alert('Error fetching blog data: ' + error.message);
        }
      }

      function getBlogIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('blogId');
      }

      fetchBlogData();
    }
  });
});
