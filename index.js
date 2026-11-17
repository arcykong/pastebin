
const express = require('express');
const app = express();
const path = require('path');
const { randomInt } = require('crypto');

// In-memory storage for pastes
const pastes = {};

// Set up EJS as the template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// --- Routes ---

// Route to display the form for creating a new paste
app.get('/', (req, res) => {
  res.render('index');
});

// Route to handle the creation of a new paste
app.post('/', (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).send('Content cannot be empty');
  }

  const id = generateId();
  const now = new Date();
  const expiration = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now

  pastes[id] = {
    text,
    createdAt: now,
    ip: req.ip,
    expiresAt: expiration,
    deleted: false,
    lastRead: null,
  };

  res.redirect(`/${id}`);
});

// Route to display a paste
app.get('/:id', (req, res) => {
  const { id } = req.params;
  const paste = pastes[id];

  if (!paste || paste.deleted || new Date() > paste.expiresAt) {
    return res.status(404).render('notfound');
  }

  paste.lastRead = new Date();
  res.render('paste', { text: paste.text, id });
});

// --- Helper Functions ---

function generateId(length = 8) {
  const alphabet = '23456789abcdefghijkmnpqrstuvwxyz';
  let id = '';
  for (let i = 0; i < length; i++) {
    id += alphabet[randomInt(alphabet.length)];
  }
  return id;
}

// --- Server ---

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
