document.addEventListener('DOMContentLoaded', () => {
  const blogTitleField = document.querySelector('.title');
  const articleField = document.querySelector('.article');

  const bannerImage = document.querySelector('#banner-upload');
  const banner = document.querySelector(".banner");
  let bannerPath;

  const publishBtn = document.querySelector('.publish-btn');
  const uploadInput = document.querySelector('#image-upload');

  bannerImage.addEventListener('change', () => {
    const file = bannerImage.files[0];
    if (file && file.type.includes("image")) {
      // Preview image immediately using FileReader
      const reader = new FileReader();
      reader.onload = function(e) {
        banner.style.backgroundImage = `url(${e.target.result})`; // Set background image to blob URL
      };
      reader.readAsDataURL(file);

      // Upload image to the server
      uploadImage(bannerImage, "banner");
    }
  });

  uploadInput.addEventListener('change', () => {
    uploadImage(uploadInput, "image");
  });

  const uploadImage = (uploadFile, uploadType) => {
    const [file] = uploadFile.files;
    if (file && file.type.includes("image")) {
      const formdata = new FormData();
      formdata.append('image', file);

      fetch('/upload', {
        method: 'post',
        body: formdata
      })
      .then(res => res.json())
      .then(data => {
        if (uploadType === "image") {
          addImage(`${location.origin}/${data}`, file.name);
        } else {
          bannerPath = `${location.origin}/${data}`;
          // Optionally update the banner image on successful upload as well
          // banner.style.backgroundImage = `url("${bannerPath}")`;
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
});
