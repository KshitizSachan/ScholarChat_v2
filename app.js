const express = require("express");
const passport = require("passport");
const session = require("express-session");
const OrcidStrategy = require("passport-orcid").Strategy;
const axios = require("axios");
const bodyParser = require("body-parser");
const path = require('path')


// these are needed for storing the user in the session
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

// add the ORCID authentication strategy
passport.use(
  new OrcidStrategy(
    {
      state: true, // remove this if not using sessions
      clientID: "APP-RIU99EAXIMJAA7TX",
      clientSecret: "ff079043-138a-467f-9491-63899cab2ece",
      callbackURL: "https://scholar-chat-home.herokuapp.com/auth/orcid/callback",
    },
    function (accessToken, refreshToken, params, profile, done) {
      // `profile` is empty as ORCID has no generic profile URL,
      // so populate the profile object from the params instead

      profile = { orcid: params.orcid, name: params.name };

      return done(null, profile);
    }
  )
);

const app = express();
app.use(express.static(path.join(__dirname, 'public')))
app.set("view engine", "ejs");
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded());
// in latest body-parser use like below.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))



app.use(session({ secret: "foo", resave: false, saveUninitialized: false }));
// app.use('/files', express.static('files'))

app.use(passport.initialize());
app.use(passport.session());

// show sign in or sign out link
app.get("/", function (req, res) {
  if (req.isAuthenticated()) {
    res.render('index.ejs');
  } else {
    // res.send('<a href="/auth/orcid/login">Sign in with ORCID</a>')
    res.render("index.ejs");
  }
});


app.get("/team", function (req, res) {
  if (req.isAuthenticated()) {
    res.render('teams_page');
  } else {
    // res.send('<a href="/auth/orcid/login">Sign in with ORCID</a>')
    res.render("teams_page");
  }
});

// start authenticating with ORCID
app.get("/auth/orcid/login", passport.authenticate("orcid"));

// finish authenticating with ORCID
app.get(
  "/auth/orcid/callback",
  passport.authenticate("orcid", {
    successRedirect: "/profile",
    failureRedirect: "/",
  })
);

// sign out
app.get("/auth/logout", function (req, res) {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/');
  });

});

let data = {};

// show the authenticated user's profile data
app.get("/profile", checkAuth, function (req, res) {
  // here a page will appear which will take input for pass
  // res.json(req.user)
  res.render("setPassword");
  data = req.user;
  // res.json(data)
});

app.get("/error", function (req, res) {
  res.render("error");
});

app.get("/success", function (req, res) {
  res.render("success");
});

let statusCode = -1;

app.get("/done", function (req, res) {
  console.log('statusCode =', statusCode)
  if (statusCode != '404' & statusCode != -1) {
    res.render('success')
  }
  else {
    res.render('error')
  }
})

const createUser = async (req, res) => {
  // console.log("hit createUser");
  // console.log("user create karnewali api", req);
  data["password"] = req.body["password"];
  // console.log("data", data);
  try {
    // console.log("before req");
    // const res = await axios.post('https://scholar-chat-orcid.herokuapp.com/api/oauthData', data);

    const response = await axios({
      method: "post",
      url: "https://scholar-chat-orcid.herokuapp.com/api/oauthData",
      data: data,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // console.log("done waiting..");
    // console.log(`Status: ${response.status}`);
    statusCode = response.status

    res.send(200);
    // console.log('Body: ', res.data);
  } catch (err) {
    // console.error("error11", err["response"]);
    statusCode = res.status
    res.send(404);
  }
};

app.post("/sendData", createUser);

function checkAuth(req, res, next) {
  if (!req.isAuthenticated()) res.redirect("/auth/orcid/login");
  return next();
}

app.listen(process.env.PORT || 3000, function (err) {
  if (err) return console.log(err);
  console.log("Listening at http://localhost:3000/");
});
