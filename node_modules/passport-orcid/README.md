# passport-orcid

[Passport](http://passportjs.org/) strategy for authenticating with [ORCID](https://orcid.org/) using the OAuth 2.0 API.

This module lets you authenticate using ORCID in your Node.js applications. By plugging into Passport, ORCID authentication can be easily and unobtrusively integrated into any application or framework that supports [Connect](http://www.senchalabs.org/connect/)-style middleware, including [Express](http://expressjs.com/).

## Install

```bash
$ npm install passport-orcid
```

## Usage

#### Create an Application

Before using `passport-orcid`, you must register an application with ORCID. If you have not already done so, a new project can be created using [ORCID's Developer Tools](http://support.orcid.org/knowledgebase/articles/343182). Your application will be issued a client ID and client secret, which need to be provided to the strategy. You will also need to configure a redirect URI which matches the route in your application.

#### Configure Strategy

The ORCID authentication strategy authenticates users using a ORCID account and OAuth 2.0 tokens.  The client ID and secret obtained when creating an application are supplied as options when creating the strategy.  The strategy also requires a `verify` callback, which receives the access token and optional refresh token, as well as `params` which contains the authenticated user's ORCID identifier and name. The `verify` callback must call `done` providing a user to complete authentication.

```javascript
var OrcidStrategy = require('passport-orcid').Strategy;

passport.use(new OrcidStrategy({
    sandbox: process.env.NODE_ENV !== 'production', // use the sandbox for non-production environments
    clientID: ORCID_CLIENT_ID,
    clientSecret: ORCID_CLIENT_SECRET,
    callbackURL: "http://www.example.com/auth/orcid/callback"
  },
  function(accessToken, refreshToken, params, profile, done) {
    // NOTE: `profile` is empty, use `params` instead
    User.findOrCreate({ orcid: params.id }, function (err, user) {
      return done(err, user);
    });
  }
));
```

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'orcid'` strategy, to authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/) application:

```javascript
app.get('/auth/orcid',
  passport.authenticate('orcid'));

app.get('/auth/orcid/callback', 
  passport.authenticate('orcid', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
  ```

## Example

Developers using the popular [Express](http://expressjs.com/) web framework can refer to an [example](https://gitlab.coko.foundation/pubsweet/passport-orcid/blob/master/example/index.js) as a starting point for their own web applications.
