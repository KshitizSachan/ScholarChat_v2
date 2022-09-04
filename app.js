var express = require('express')
var session = require('express-session')
var passport = require('passport')
var OrcidStrategy = require('passport-orcid').Strategy

// these are needed for storing the user in the session
passport.serializeUser(function (user, done) {
  done(null, user)
})

passport.deserializeUser(function (user, done) {
  done(null, user)
})

// add the ORCID authentication strategy
passport.use(new OrcidStrategy({
  sandbox: true, // remove this to use the production API
  state: true, // remove this if not using sessions
  clientID: 'APP-KPRNA1YNG31M58AQ',
  clientSecret: '03d79811-cc94-4768-a561-b996307b6786',
  callbackURL: 'http://localhost:5000/auth/orcid/callback'
}, function (accessToken, refreshToken, params, profile, done) {
  // `profile` is empty as ORCID has no generic profile URL,
  // so populate the profile object from the params instead

  profile = { orcid: params.orcid, name: params.name }

  return done(null, profile)
}))

var app = express()

app.use(session({ secret: 'foo', resave: false, saveUninitialized: false }))
app.use('/files', express.static('files'))

app.use(passport.initialize())
app.use(passport.session())

// show sign in or sign out link
app.get('/', function (req, res) {
  if (req.isAuthenticated()) {
    res.send('<a href="/auth/logout">Sign out</a>')
  } else {
    res.send('<a href="/auth/orcid/login">Sign in with ORCID</a>')
  }
})

// start authenticating with ORCID
app.get('/auth/orcid/login', passport.authenticate('orcid'))

// finish authenticating with ORCID
app.get('/auth/orcid/callback', passport.authenticate('orcid', {
  successRedirect: '/profile',
  failureRedirect: '/'
}))

// sign out
app.get('/auth/logout', function (req, res) {
  req.logout()
  res.redirect('/')
})

// show the authenticated user's profile data
app.get('/profile', checkAuth, function (req, res) {
  res.json(req.user)
})

function checkAuth (req, res, next) {
  if (!req.isAuthenticated()) res.redirect('/auth/orcid/login')
  return next()
}

app.listen(5000, function (err) {
  if (err) return console.log(err)
  console.log('Listening at http://localhost:5000/')
})
