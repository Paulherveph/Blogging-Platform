document.addEventListener('DOMContentLoaded', () => {
  const blogTitleField = document.querySelector('.title');
  const articleField = document.querySelector('.article');

  const bannerImage = document.querySelector('#banner-upload');
  const banner = document.querySelector('.banner');
  let bannerpath;

  const publishBtn = document.querySelector('.publish-btn');
  const uploadInput = document.querySelector('#image-upload');

  bannerImage.addEventListener('change', () => {
    uploadImage(bannerImage, "banner");
  });

  uploadInput.addEventListener('change', () => {
    uploadImage(uploadInput, "image");
  });

  const uploadImage = (uploadFile, uploadType) => {
    const [file] = uploadFile.files;
    if (file && file.type.includes("image")) {
      const formData = new FormData();
      formData.append('image', file);

      fetch('/upload', {
        method: 'POST',
        body: formData
      })
      .then(res => res.json())
      .then(data => {
        if (uploadType === "image") {
          addImage(`${location.origin}/${data}`, file.name);
        } else {
          bannerpath = `${location.origin}/${data}`;
          banner.style.backgroundImage = `url("${bannerpath}")`;
        }
      })
      .catch(error => console.error('Error uploading image:', error));
    } else {
      alert("Please upload an image file.");
    }
  };

  const addImage = (imagepath, alt) => {
    let curPos = articleField.selectionStart;
    let textToInsert = `\r![${alt}](${imagepath})\r`;
    articleField.value = articleField.value.slice(0, curPos) + textToInsert + 
    articleField.value.slice(curPos);
  };

  publishBtn.addEventListener('click', () => {
    if (articleField.value.length && blogTitleField.value.length) {
      let letters = 'abcdefgijklmnopqrstuvwxyz';
      let blogTitle = blogTitleField.value.replace(/\s+/g, '-').toLowerCase();
      let id = '';
      for (let i = 0; i < 4; i++) {
        id += letters[Math.floor(Math.random() * letters.length)];
      }

      let docName = `${blogTitle}-${id}`;
      let date = new Date();

      db.collection("blogs").doc(docName).set({
        title: blogTitleField.value,
        article: articleField.value,
        bannerImage: bannerpath,
        publishedAt: `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
      })
      .then(() => {
        console.log('Data entered successfully');
      })
      .catch((err) => {
        console.error('Error saving data:', err);
      });
    }
  });
});
