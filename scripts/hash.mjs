import crypto from 'node:crypto';
const pw=process.argv[2];
if(!pw||pw.length<10){console.error('Usage: node scripts/hash.mjs "<password, 10+ characters>"');process.exit(1)}
const salt=crypto.randomBytes(16).toString('hex');
console.log(salt+':'+crypto.scryptSync(pw,salt,64).toString('hex'));
