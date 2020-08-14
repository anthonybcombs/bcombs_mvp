import auth0 from "auth0-js";
export const webAuth = new auth0.WebAuth({
  domain: process.env.AUTH_API,
  clientID: process.env.AUTH_CLIENT_ID
});
export const managementAUth = token =>
  new auth0.Management({
    domain: process.env.AUTH_API,
    token
  });
