var util = require('util')
var OAuth2Strategy = require('passport-oauth2')

/**
 * First, register an ORCID API client:
 * https://orcid.org/content/register-client-application-0
 *
 * Options:
 *   - `sandbox`       whether to use the ORCID sandbox API (for non-production environments)
 *   - `clientID`      your ORCID application's client id
 *   - `clientSecret`  your ORCID application's client secret
 *   - `callbackURL`   URL to which ORCID will redirect the user after granting authorization
 *
 * Example:
 *
 *     passport.use(new OrcidStrategy({
 *         sandbox: process.env.NODE_ENV !== 'production',
 *         state: true, // remove this if not using sessions,
 *         clientID: process.env.ORCID_CLIENT_ID,
 *         clientSecret: process.env.ORCID_CLIENT_SECRET,
 *         callbackURL: 'https://your.host/auth/orcid/callback',
 *       },
 *       function(accessToken, refreshToken, params, profile, done) {
 *         // NOTE: `profile` is empty, but `params` contains `orcid` and `name`
 *         profile = { orcid: params.orcid, name: params.name }
 *
 *         User.findOrCreate(profile, function (err, user) {
 *           done(err, user)
 *         })
 *       }
 *     ))
 *
 * @constructor
 * @param {object} options
 * @param {function} verify
 * @access public
 */
function Strategy (options, verify) {
  options.scope = options.scope || '/authenticate'

  if (options.sandbox) {
    options.authorizationURL = 'https://sandbox.orcid.org/oauth/authorize'
    options.tokenURL = 'https://sandbox.orcid.org/oauth/token'
  } else {
    options.authorizationURL = 'https://orcid.org/oauth/authorize'
    options.tokenURL = 'https://orcid.org/oauth/token'
  }

  delete options.sandbox

  OAuth2Strategy.call(this, options, verify)
  this.name = 'orcid'
}

util.inherits(Strategy, OAuth2Strategy)

module.exports = Strategy
