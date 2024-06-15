const express = require('express');
const path = require('path');
const fileupload = require('express-fileupload');
const fs = require('fs');

const app = express();

const initialPath = path.join(__dirname, "public");
app.use(express.static(initialPath));
app.use(fileupload());

app.get('/', (req, res) => {
  res.sendFile(path.join(initialPath, "home.html"));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(initialPath, "about.html"));
});

app.get('/editor', (req, res) => {
  res.sendFile(path.join(initialPath, "editor.html"));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(initialPath, "login.html"));
});

// upload link
app.post('/upload', (req, res) => {
  if (!req.files || !req.files.image) {
    return res.status(400).send('No files were uploaded.');
  }

  const file = req.files.image;
  const date = new Date();
  // image name
  const imageName = `${date.getTime()}_${file.name}`;
  // image upload path
  const uploadPath = path.join(__dirname, 'public/uploads', imageName);

  // create uploads directory if not exists
  const uploadDir = path.join(__dirname, 'public/uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // move file to upload path
  file.mv(uploadPath, (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(`uploads/${imageName}`);
  });
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(initialPath, "dashboard.html"));
});

app.get('/:blog', (req, res) => {
  res.sendFile(path.join(initialPath, "blog.html"));
});

app.get(':/blog/editor', (req, res) => {
  res.sendFile(path.join(initialPath, "editor.html"));
})

app.use((req,res) => {
  res.json("404");
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API is running on port ${PORT}`);
});
