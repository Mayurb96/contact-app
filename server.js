const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 8000;

// Middleware
app.use(bodyParser.json());

// API endpoints
app.get('/api/contacts', (req, res) => {
  fs.readFile('contacts.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    const contacts = JSON.parse(data);
    res.json(contacts);
  });
});

app.get('/api/contacts/:id', (req, res) => {
  const contactId = req.params.id;
  fs.readFile('contacts.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    const contacts = JSON.parse(data);
    const contact = contacts.find((c) => c.id === contactId);
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json(contact);
  });
});

app.post('/api/contacts', (req, res) => {
  const newContact = req.body;
  fs.readFile('contacts.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    const contacts = JSON.parse(data);
    const contactExists = contacts.find((c) => c.email === newContact.email);
    if (contactExists) {
      return res.status(400).json({ error: 'Contact already exists' });
    }
    newContact.id = Date.now().toString();
    contacts.push(newContact);
    fs.writeFile('contacts.json', JSON.stringify(contacts), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      res.status(201).json(newContact);
    });
  });
});


app.delete('/api/contacts/:id', (req, res) => {
  const contactId = req.params.id;
  fs.readFile('contacts.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    const contacts = JSON.parse(data);
    const contactIndex = contacts.findIndex((c) => c.id === contactId);
    if (contactIndex === -1) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    const deletedContact = contacts.splice(contactIndex, 1);
    fs.writeFile('contacts.json', JSON.stringify(contacts), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      res.json(deletedContact[0]);
    });
  });
});

app.put("/api/contacts/:id", (req, res) => {
  const contactId = req.params.id;
  const updatedContact = req.body;
  fs.readFile("contacts.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    const contacts = JSON.parse(data);
    const contactIndex = contacts.findIndex((c) => c.id === contactId);
    if (contactIndex === -1) {
      return res.status(404).json({ error: "Contact not found" });
    }
    contacts[contactIndex] = { id: contactId, ...updatedContact };
    fs.writeFile("contacts.json", JSON.stringify(contacts), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.json(contacts[contactIndex]);
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});