import React, { useState, useEffect } from 'react';
import './style.css';
import axios from 'axios';

function App() {
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({
    name: '',
    phoneNumber: '',
    email: '',
  });
  const [editContactId, setEditContactId] = useState(null);
   const [updatedContact, setUpdatedContact] = useState({
     name: "",
     phoneNumber: "",
     email: "",
   });

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await axios.get('/api/contacts');
      setContacts(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewContact((prevContact) => ({ ...prevContact, [name]: value }));
     setUpdatedContact((prevContact) => ({
       ...prevContact,
       [name]: value,
     }));
   };
  

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      if(newContact){
      await axios.post('/api/contacts', newContact);
      fetchContacts();
      setNewContact({ name: '', phoneNumber: '', email: '' });
    }
   
     else if(editContactId){
       await axios.put(`/api/contacts/${editContactId}`, updatedContact);
       fetchContacts();
       setUpdatedContact({ name: "", phoneNumber: "", email: "" });
       setEditContactId(null);
     };
     } catch (error) {
       console.error("Error:", error);
     }
  };
  const setEditMode = (contactId) => {
    const contact = contacts.find((contact) => contact.id === contactId);
    setEditContactId(contactId);
    setUpdatedContact({
      name: contact.name,
      phoneNumber: contact.phoneNumber,
      email: contact.email,
    });
  };

  const handleDelete = async (contactId) => {
    try {
      await axios.delete(`/api/contacts/${contactId}`);
      fetchContacts();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="container">
      <h1>Contact List</h1>
      <ul>
      {contacts.map((contact) => (
           <li key={contact.id}>
             {contact.name} - {contact.phoneNumber} - {contact.email}
             <button onClick={() => setEditMode(contact.id)}>Edit</button>
             <button onClick={() => handleDelete(contact.id)}>Delete</button>
           </li>
        ))}
      </ul>
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={editContactId ? updatedContact.name : newContact.name}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="phoneNumber"
          placeholder="Phone number"
          value={editContactId ? updatedContact.phoneNumber : newContact.phoneNumber}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="email"
          placeholder="Email address"
          value={editContactId ? updatedContact.email : newContact.email}
          onChange={handleInputChange}
        />
        <button type="submit">{editContactId ? "Update Contact" : "Add Contact"}</button>
      </form>
    </div>
  );
}

export default App;
