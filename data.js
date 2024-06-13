const express = require('express');
const mysql = require('mysql');

const app = express();
app.use(express.json());

// MySQL connection details
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'your_database'
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database!');
});

// Handle registration form submission
app.post('/register', (req, res) => {
  const { name, age, dob, phone, email } = req.body;

  // Insert the user data into the MySQL database
  const query = 'INSERT INTO users (name, age, dob, phone, email) VALUES (?, ?, ?, ?, ?)';
  connection.query(query, [name, age, dob, phone, email], (err, result) => {
    if (err) {
      console.error('Error inserting user data:', err);
      res.status(500).send('Error registering user');
      return;
    }

    res.status(200).send('Registration successful');
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});