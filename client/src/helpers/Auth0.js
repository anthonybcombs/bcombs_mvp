import auth0 from "auth0-js";
export const webAuth = new auth0.WebAuth({
  domain: "bcombd.us.auth0.com",
  clientID: process.env.AUTH_CLIENT_ID
});
export const managementAUth = token =>
  new auth0.Management({
    domain: "bcombd.us.auth0.com",
    token
  });
