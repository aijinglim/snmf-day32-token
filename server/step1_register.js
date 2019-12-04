const otplib = require('otplib');
const secret = otplib.authenticator.generateSecret();
const gSecret = otplib.authenticator.encode(secret); // google encoded. if you want to use google, must use this

console.info("secret=", secret);
console.info("gSecret=", gSecret);