const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const urlencoded = require("body-parser/lib/types/urlencoded");
const app = express();
const https = require("https");

app.use(express.static("public")); // this will allow the the server to load the bootstrap and css files.

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  console.log(email);

  const data = {
    //inorder to use mailchimp
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us14.api.mailchimp.com/3.0/lists/e6c97f9071";

  const options = {
    method: "POST",
    auth: "hasaan1:fcce8e5d2a445a8487a5a4b966f2f9f1-us14",
  };

  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("server is running at 3000");
});

// api Key
// fcce8e5d2a445a8487a5a4b966f2f9f1-us14fff
// Audience Id: e6c97f9071
