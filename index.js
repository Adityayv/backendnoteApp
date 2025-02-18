const express = require("express");
const fs = require("fs");
const app = express();
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json()); // For JSON data
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
const folderPath = path.join(__dirname, "data");

app.get("/", (req, res) => {
  fs.readdir(folderPath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    res.render("index", { files: data });
  });
});

app.post("/submit", (req, res) => {
  const filePath = path.join(folderPath,`${req.body.title.split(" ").join("")}.txt`);
  fs.writeFile(filePath, `${req.body.content}`, function (err) {
    if (err) throw err;
    res.redirect("/");
  });
});

app.get("/paste/:id", (req, res) => {
  fs.readFile(path.join(folderPath, req.params.id), "utf8", (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    res.render("paste", { title: req.params.id, content: data });
  });
});

app.get("/edit/:id", (req, res) => {
  res.render("edit", { title: req.params.id });
});

app.post("/edit", (req, res) => {
  fs.rename(
    `${folderPath}/${req.body.prevtitle}`,
    `${folderPath}/${req.body.newtitle.toLowerCase().split(" ").join("")}.txt`,
    (err) => {
      if (err) {
        console.error("Error renaming file:", err);
        return
      } else {
        console.log("File renamed successfully");
        res.redirect("/");
      }
    }
  );
});

app.listen(3000);
