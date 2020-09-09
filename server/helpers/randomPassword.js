var randomstring = require("randomstring");

export const generatePassword = () => {
  return randomstring.generate({
    length: 12,
    charset: 'alphanumeric'
  });
}