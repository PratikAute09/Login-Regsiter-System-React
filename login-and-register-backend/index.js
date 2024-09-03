import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
app.use(express.json());
app.use(express.urlencoded({  }));
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/myloginregistration", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("DB connected");
})
.catch(err => {
    console.error("DB connection error:", err);
});

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

const User = mongoose.model("User", userSchema);

// Root route
app.get("/", (req, res) => {
    res.send("<h2>Welcome to the Server</h2>");
});

// Routes
app.post("/login", (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email: email })
        .then(user => {
            if (user) {
                if (password === user.password) {
                    res.send({ message: "Login Successful", user: user });
                } else {
                    res.send({ message: "Password didn't match" });
                }
            } else {
                res.send({ message: "User not registered" });
            }
        })
        .catch(err => {
            res.status(500).send({ message: "Error finding user", error: err });
        });
});

app.post("/register", (req, res) => {
    const { name, email, password } = req.body;
    User.findOne({ email: email })
        .then(user => {
            if (user) {
                res.send({ message: "User already registered" });
            } else {
                const newUser = new User({
                    name,
                    email,
                    password
                });
                newUser.save()
                    .then(() => {
                        res.send({ message: "Successfully Registered, Please login now." });
                    })
                    .catch(err => {
                        res.status(500).send({ message: "Error saving user", error: err });
                    });
            }
        })
        .catch(err => {
            res.status(500).send({ message: "Error finding user", error: err });
        });
});

app.listen(9003, () => {
    console.log(" DB Server started at port 9003");
});
