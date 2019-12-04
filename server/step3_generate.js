const otplib = require('otplib');

const gSecret = 'JRBEYWCLLFKEYT2NGJCUWTKMJFHFUTCXJ5NFISCIIJLUIS2OGNHA';

const code = otplib.authenticator.generate(gSecret);

console.info('code = ', code);