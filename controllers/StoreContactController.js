var express = require("express");
var router = express.Router();
const fs = require("fs");
const xml2js = require("xml2js");
var conn = require("../config/connection");
const path = require("path");
var multer = require("multer");
var bodyParser = require("body-parser");
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../../uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});
var upload = multer({ storage: storage });

router.post("/import", upload.single("file"), async (req, res, next) => {
  try {
    //Check uploaded file...
    if (!req.file) {
      return res
        .status(400)
        .json({ error: "No file uploaded or file buffer missing" });
    }

    //Read the uploaded file
    fs.readFile(req.file.path, "utf-8", (err, xmlFileData) => {
      if (err) {
        console.error("Error reading file:", err);
        return res.status(500).json({ error: "Error reading file" });
      }
      // Parse XML data
      xml2js.parseString(xmlFileData, (err, result) => {
        if (err) {
          console.error("Error parsing XML: ", err);
          return;
        }
        //Transform parsed data
        const contacts = result.contacts.contact.map((contact) => ({
          name: contact.name[0],
          lastName: contact.lastName[0],
          phone: contact.phone[0],
        }));
        //Insert data into database
        const sql = "INSERT INTO contacts (name, lastName, phone) VALUES ?";
        const values = contacts.map((contact) => [
          contact.name,
          contact.lastName,
          contact.phone,
        ]);
        conn.query(sql, [values], (err, results) => {
          if (err) {
            console.error("Error inserting data into database: ", err);
            return;
          }
          // Return the results as JSON response
          return res.status(200).json({
            status: "success",
            message: "Contacts imported successfully.",
          });
        });
      });
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send("Internal server error");
  }
});

router.get("/", async (req, res, next) => {
  try {
    conn.query("SELECT * FROM contacts", (err, results) => {
      if (err) {
        console.error("Error querying database:", err);
        return res.status(500).json({
          // Return an error response if there's an error
          status: "error",
          message: "Error querying database",
        });
      }

      // Log the results
      console.log("Data fetched:", results);

      // Return the results as JSON response
      return res.status(200).json({
        status: "success",
        result: results,
      });
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send("Internal server error");
  }
});

router.post("/", async (req, res, next) => {
  try {
    //Read XML file
    fs.readFile("contacts.xml", "utf-8", (err, data) => {
      if (err) {
        console.error("Error reading xml file: ", err);
        return;
      }
      // Parse XML data
      xml2js.parseString(data, (err, result) => {
        if (err) {
          console.error("Error parsing XML: ", err);
          return;
        }
        //Transform parsed data
        const contacts = result.contacts.contact.map((contact) => ({
          name: contact.name[0],
          lastName: contact.lastName[0],
          phone: contact.phone[0],
        }));
        //Insert data into database
        const sql = "INSERT INTO contacts (name, lastName, phone) VALUES ?";
        const values = contacts.map((contact) => [
          contact.name,
          contact.lastName,
          contact.phone,
        ]);
        conn.query(sql, [values], (err, results) => {
          if (err) {
            console.error("Error inserting data into database: ", err);
            return;
          }
          // Return the results as JSON response
          return res.status(200).json({
            status: "success",
            message: "Contacts imported successfully.",
          });
        });
      });
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send("Internal server error");
  }
});

// Update contact by id
router.put("/:id", async (req, res, next) => {
  try {
    const { name, lastName, phone } = req.body;
    conn.query(
      `UPDATE contacts SET name = ?, lastName = ?, phone = ? WHERE id = ?`,
      [name, lastName, phone, req.params.id],
      (err, results) => {
        if (err) {
          console.error("Error querying database:", err);
          return res.status(500).json({
            status: "error",
            message: "Error querying database",
          });
        }

        // Check if any rows were affected
        if (results.affectedRows === 0) {
          return res.status(404).json({
            status: "error",
            message: "Contact not found or not updated",
          });
        }

        // Return success response
        return res.status(200).json({
          status: "success",
          message: "Contact updated successfully.",
        });
      }
    );
  } catch (e) {
    console.log(e);
    return res.status(500).send("Internal server error");
  }
});

// Delete contact by id
router.delete("/:id", async (req, res, next) => {
  try {
    let reqData = req.params.id;
    conn.query(`DELETE FROM contacts WHERE id = ${reqData}`, (err, results) => {
      if (err) {
        console.error("Error querying database:", err);
        return res.status(500).json({
          // Return an error response if there's an error
          status: "error",
          message: "Error querying database",
        });
      }

      // Return the results as JSON response
      return res.status(200).json({
        status: "success",
        result: "Contact deleted successfully.",
      });
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send("Internal server error");
  }
});

module.exports = router;
