var crypto = require('crypto'),
  algorithm = 'aes-256-ctr',
  password = 'd6F3Efeq';


const quatToHex = (quat) => {
  let acc = '';

  quat = quat.length % 2 ? `0${quat}` : quat;
  for (let i = 0; i < quat.length; i += 2) {
    const token = quat.slice(i, i + 2);
    const hex = parseInt(token, 4).toString(16);
    acc += hex
  }
  return acc;
};

const hexToQuat = (hex) => {
  let acc = '';

  for (let i = 0; i < hex.length; i++) {
    const token = hex.slice(i, i + 1);
    let quat = parseInt(token, 16).toString(4);
    quat = quat.length < 2 ? `0${quat}` : quat;
    acc += quat
  }

  return acc
};

function encrypt(text) {
  var cipher = crypto.createCipher(algorithm, password);
  var crypted = cipher.update(text, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return hexToQuat(crypted);
}

function decrypt(text) {
  text = quatToHex(text);
  var decipher = crypto.createDecipher(algorithm, password);
  var dec = decipher.update(text, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
}

var token = 't0XMKpr44leHWEqwADEf+A==';
console.log('original token:', token);
let t = Date.now();
var encrypted = encrypt(token);
console.log('encrypted:', encrypted);
console.log(`encryption took: ${Date.now() - t} ms`);
t = Date.now();
var decrypted = decrypt(encrypted);
console.log('decrypted:', decrypted);
console.log(`decryption took: ${Date.now() - t} ms`);
console.log(decrypted === token);