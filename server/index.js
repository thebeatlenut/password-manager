const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const PORT = 3001;

const { encrypt, decrypt } = require("./EncryptionHandler");

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "password",
  database: "passwordmanager",
});

app.get("/", (req, res) => {
  res.send("Hello, Nikita!");
});

app.get("/showPasswords", (req, res) => {
  db.query("SELECT * FROM passwords;", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.post("/decryptPassword", (req, res) => {
  res.send(decrypt(req.body));
});

app.post("/addPassword", (req, res) => {
  const { password, website, username } = req.body;

  const hashedPassword = encrypt(password);

  db.query(
    "INSERT INTO passwords (password, website, username,iv) VALUES (?,?,?,?)",
    [hashedPassword.password, website, username, hashedPassword.iv],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("success");
      }
    }
  );
});

app.listen(PORT, () => {
  console.log("server is running");
});
