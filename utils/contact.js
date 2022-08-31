// import file system
const fs = require("fs");

// make folder path
const dataPath = "./data";
if (!fs.existsSync(dataPath)) {
  fs.mkdirSync(dataPath);
}

// make file for contacts list
const filePath = "./data/contacts.json";
if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, "[]", "utf-8");
}

// make file for contact list if file already exists
// but it has empty contents
if (fs.readFileSync(filePath, "utf-8").length < 1) {
  fs.writeFileSync(filePath, "[]", "utf-8");
}

// load contacts list function A.K.A module
const loadContacts = () => {
  const fileBuffer = fs.readFileSync(filePath, "utf-8");
  const contacts = JSON.parse(fileBuffer);
  return contacts;
};

// find contact
const findContact = (name) => {
  const contacts = loadContacts();
  const contact = contacts.find(
    (contact) => contact.name.toLowerCase() === name.toLowerCase()
  );
  return contact;
};

// make contact
const addContact = (contact) => {
  const contacts = loadContacts();
  contacts.push(contact);
  fs.writeFileSync(filePath, JSON.stringify(contacts));
};

// check duplicated contact
const checkDuplicate = (name) => {
  const contacts = loadContacts();
  return contacts.find((contact) => contact.name === name);
};

// delete contact
const deleteContact = (name) => {
  const contacts = loadContacts();
  const filteredContacts = contacts.filter((contact) => contact.name !== name);
  fs.writeFileSync(filePath, JSON.stringify(filteredContacts));
};

module.exports = {
  loadContacts,
  findContact,
  addContact,
  checkDuplicate,
  deleteContact,
};
