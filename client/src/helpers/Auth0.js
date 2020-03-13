import auth0 from "auth0-js";
export const webAuth = new auth0.WebAuth({
  domain: "bcombs.auth0.com",
  clientID: process.env.AUTH_CLIENT_ID
});
export const managementAUth = token =>
  new auth0.Management({
    domain: "bcombs.auth0.com/api/v2/",
    token
  });
