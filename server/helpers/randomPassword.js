var randomstring = require("randomstring");

export const generatePassword = () => {
  let pass = randomstring.generate({
    length: 7,
    charset: 'alphabetic'
  });

  pass += randomstring.generate({
    length: 5,
    charset: 'alphanumeric'
  })

  pass += randomstring.generate({
    length: 5,
    charset: 'numeric'
  })

  pass += randomstring.generate({
    length: 3,
    charset: 'alphabetic',
    capitalization: 'uppercase'
  })

  return pass;
}