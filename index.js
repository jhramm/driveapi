let express = require("express");
let cors = require("cors");
let bcrypt = require("bcrypt");
let nodemailer = require("nodemailer");
require("dotenv").config();;

const Packages = require("./Models/Packages");
const Users = require("./Models/Users");
const Files = require("./Models/Files");
const Blog = require("./Models/Blogs");

require("./DB/Conn");
let app = express();
app.use(express.json({ limit: "5mb" }));
app.use(cors());
app.use(express.static("public"));

let port = 8080;

app.post("/addPackage", (req, res) => {
  try {
    const packages = new Packages(req.body);
    packages
      .save()
      .then(() => {
        res.status(200).send(packages);
      })
      .catch((e) => {
        res.status(404).send("Could not save the package!");
      });
  } catch {
    res.status(500).send("External Server Error");
  }
});

app.get("/packages", async (req, res) => {
  try {
    const allPackages = await Packages.find();
    res.status(200).send(allPackages);
  } catch {
    res.status(404).send("External Server Error");
  }
});

app.post("/signup", async (req, res) => {
  try {
    const user = new Users(req.body);

    const findEmail = await Users.find({ email: req.body.email });

    if (findEmail.length === 0) {
      user
        .save()
        .then(() => {
          res.status(200).send(user);
        })
        .catch(() => {
          res.status(404).send("Could not save the user!");
        });
    } else {
      res.status(416).send("Email already exists");
    }
  } catch {
    res.status(500).send("External Server Error");
  }
});

app.post("/login", async (req, res) => {
  try {
    const findUser = await Users.findOne({ email: req.body.email });

    if (findUser !== null) {
      const matchPassword = await bcrypt.compare(
        req.body.password,
        findUser.password
      );
      if (matchPassword) {
        res.status(200).send(findUser);
      } else {
        res.status(416).send("Passwords do not match");
      }
    } else {
      res.status(404).send("user not found");
    }
  } catch {
    res.status(500).send("External Server Error");
  }
});

app.post("/addFiles", (req, res) => {
  try {
    const files = new Files(req.body);
    files
      .save()
      .then(() => {
        res.status(200).send(files);
      })
      .catch((e) => {
        res.status(404).send("Could not save the file!");
      });
  } catch {
    res.status(500).send("External Server Error");
  }
});

app.get("/files", async (req, res) => {
  try {
    const allFiles = await Files.find();
    res.status(200).send(allFiles);
  } catch {
    res.status(404).send("External Server Error");
  }
});

//============ Email Service Start ========================//

app.post("/email", async (req, res) => {
  try {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "jhrnewwebdesign@gmail.com",
        pass: "qnfu zzpx fwmo hxcw",
      },
    });

    const htmlContent = `
  <html>
    <head>
      <style>
        .content {
          padding: 20px 40px 20px 40px;
          background-color: #f0f0f0;
          font-family: Arial, sans-serif;
          border: 1px solid red;
          border-radius: 5px;
        }

        img {
          width: 150px;
        }
      </style>
    </head>
    <body>
      <div class="content">
       <h1>Hello,</h1>
       <h2>${req.body.name}</h2>
           <p>Sender Email: ${req.body.email}</p>
           <p>Message: ${req.body.message}</p>
           <img src="https://onlyessexdriving.co.uk/wp-content/uploads/2018/05/overseas-drivers.png" alt="car" />
           <p><i>Your Road to Success.</i></p>
      </div>
    </body>
  </html>
`;

    let mailOptions = {
      from: "jhrnewwebdesign@gmail.com",
      to: "admin@onlyessexdriving.co.uk",
      cc: req.body.email,
      subject: req.body.subject,
      html: htmlContent,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
        res.status(200).send("Email sent successfully");
      }
    });
  } catch {
    res.status(404).send("Internal Server Error");
  }
});

//============ Email Service End   ========================//


app.post("/blogs", async (req, res) => {
  try {
    const newBlog = new Blog(req.body);
    newBlog.save().then(() => {
      res.status(200).send(newBlog);
    }).catch((e) => {
      res.status(404).send("Something went wrong"+ e)
    })
    
  } catch (error) {
    res.status(500).send("Server error"+ error)
  }
})

app.get("/blogs", async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.status(200).send(blogs);
  } catch (error) {
     res.status(500).send("Server error"+ error);
  }
})

app.get("/blogs/:id", async(req, res) => {
  try {
    const _id = req.params.id;
    const getBlog = await Blog.findById(_id);
    res.status(200).send(getBlog);
    
  } catch (error) {
     res.status(500).send("Server error" + error);
  }
})

app.patch("/likes/:id", async (req, res) => {
    try {
      const _id = req.params.id;
      const findBlog = await Blog.findById(_id);
      const updatedLikes = [...findBlog.likes, ...req.body.likes];
      const updateBlog = await Blog.findByIdAndUpdate(
        _id,
        { likes: updatedLikes },
        { new: true }
      );
       res.status(200).send(updateBlog);
      
    } catch (error) {
       res.status(500).send("Server error" + error);
    }
})

app.patch("/comments/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const getComments = await Blog.findById(_id);
    const updateComments = [...getComments.comments, ...req.body.comments]
    const addComment = await Blog.findByIdAndUpdate(_id, {comments: updateComments}, {new: true} )
    res.status(200).send(addComment);
  } catch (error) {
    res.status(500).send("Server error" + error);
  }
})

app.listen(port, () => {
  console.log("Api is running on port: " + port);
});
