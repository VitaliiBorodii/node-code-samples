const crypto = require('crypto');

const algorithm = 'aes-256-ctr';
const password = 'd6F3Efeq';

const add = (x, y) => {
  let c = 0;
  let r = [];
  x = x.split('').map(Number);
  y = y.split('').map(Number);
  while (x.length || y.length) {
    const s = (x.pop() || 0) + (y.pop() || 0) + c;
    r.unshift(s < 10 ? s : s - 10);
    c = s < 10 ? 0 : 1;
  }
  if (c) r.unshift(c);
  return r.join('');
};

const h2d = (s) => {

  let dec = '0';
  s.split('').forEach((chr) => {
    const n = parseInt(chr, 16);
    for (let t = 8; t; t >>= 1) {
      dec = add(dec, dec);
      if (n & t) dec = add(dec, '1');
    }
  });
  return dec;
};

const d2h = (str) => { // .toString(16) only works up to 2^53
  const dec = str.toString().split('');
  const sum = [];
  const hex = [];
  let i;
  let s;

  while (dec.length) {
    s = 1 * dec.shift();
    for (i = 0; s || i < sum.length; i++) {
      s += (sum[i] || 0) * 10;
      sum[i] = s % 16;
      s = (s - sum[i]) / 16;
    }
  }
  while (sum.length) {
    hex.push(sum.pop().toString(16));
  }
  return hex.join('');
};


const encrypt = (text) => {
  const cipher = crypto.createCipher(algorithm, password);
  let crypted = cipher.update(text, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return h2d(crypted);
};

const decrypt = (text) => {
  text = d2h(text);
  const decipher = crypto.createDecipher(algorithm, password);
  let dec = decipher.update(text, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
};

const token = 't0XMKpr44leHWEqwADEf+A==';
console.log('original token:', token);
let t = Date.now();
const encrypted = encrypt(token);
console.log('encrypted:', encrypted);
console.log(`encryption took: ${Date.now() - t} ms`);
t = Date.now();
const decrypted = decrypt(encrypted);
console.log('decrypted:', decrypted);
console.log(`decryption took: ${Date.now() - t} ms`);
console.log(decrypted === token);