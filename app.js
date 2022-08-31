// REQUIRED
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const app = express();
const port = 3000;

// import modules
const {
  loadContacts,
  findContact,
  addContact,
  checkDuplicate,
  deleteContact,
} = require("./utils/contact.js");
const { body, validationResult } = require("express-validator");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

app.set("view engine", "ejs");
// built in middleware
app.use(expressLayouts);
app.use(express.urlencoded());
app.use((req, res, next) => {
  console.log("this is first middleware");
  next();
});
app.use((req, res, next) => {
  console.log("Second middleware");
  next();
});
// flash configuration
app.use(cookieParser("secret"));
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: "secret",
    resave: true,
    seveUninitialized: true,
  })
);
app.use(flash());

// REQUIRED
app.get("/", (req, res) => {
  const students = [
    { name: "yokut", email: "cakbenu" },
    { name: "tokecang", email: "bentobento" },
  ];
  res.render("index", {
    layout: "layouts/mainLayout",
    name: "Simail",
    title: "this is home Title",
    students,
  });
});

app.get("/about", (req, res) => {
  console.log("go to about page");
  res.render("about", {
    layout: "layouts/mainLayout",
    title: "This is about title",
  });
});

app.get("/contact", (req, res) => {
  // load contacts list from json file contacts.json
  const contacts = loadContacts();
  console.log("go to contact page");
  res.render("contact", {
    layout: "layouts/mainLayout",
    title: "Contacts List Title",
    // passing contacts list as params to contacts page
    contacts,
    msg: req.flash("msg"),
  });
});

app.get("/contact/add", (req, res) => {
  console.log("contact addition page");
  res.render("addContact", {
    layout: "layouts/mainLayout",
    title: "Add Contact Title",
  });
});

app.post(
  "/contact",
  [
    body("name").custom((value) => {
      const duplicate = checkDuplicate(value);
      if (duplicate) {
        throw new Error("Contact's name already exists");
      }
      return true;
    }),
    body("email", "Invalid email address").isEmail(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return res.status(400).json({ errors: errors.array() });
      res.render("addContact", {
        layout: "layouts/mainLayout",
        title: "Add Contact Title",
        errors: errors.array(),
      });
    } else {
      addContact(req.body);
      console.log(req.body);
      req.flash("msg", "Successfully add new contact");
      res.redirect("/contact");
    }
  }
);

app.get("/contact/delete/:name", (req, res) => {
  if (findContact(req.params.name)) {
    deleteContact(req.params.name);
    console.log("Deleting contact");
    req.flash("msg", "Contact deleted");
    res.redirect("/contact");
  } else {
    res.status(404);
    res.render("contactDetail", {
      layout: "layouts/mainLayout",
      title: "Error: user not found",
      contact: null,
    });
  }
});

app.get("/contact/edit/:name", (req, res) => {
  const contact = findContact(req.params.name);
  console.log("Go to edit contact page");
  res.render("editContact", {
    layout: "layouts/mainLayout",
    title: "Edit contact form",
    contact,
  });
});

app.post(
  "/contact/update",
  [
    body("name").custom((value, { req }) => {
      const duplicate = checkDuplicate(value);
      if (duplicate && value !== req.body.oldName) {
        throw new Error("Contact's name already exists");
      }
      return true;
    }),
    body("email", "Invalid email address").isEmail(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(req.body);
      res.render("editContact", {
        layout: "layouts/mainLayout",
        title: "Edit Contact Title",
        contact: req.body,
        errors: errors.array(),
      });
    } else {
      res.send("Want to update");
    }
  }
);

app.get("/contact/:name", (req, res) => {
  const contact = findContact(req.params.name);
  console.log(req.params.name);
  console.log(contact);
  res.render("contactDetail", {
    layout: "layouts/mainLayout",
    title: "Contact Detail Title",
    contact,
  });
});

app.use((req, res) => {
  res.status(404);
  res.json({
    status: 404,
    message: "404 Page not found",
  });
});

// REQUIRED
app.listen(port, () => {
  console.log("listening to port 3000");
});
