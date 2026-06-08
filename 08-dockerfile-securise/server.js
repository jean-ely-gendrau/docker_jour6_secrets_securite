const os = require('os');
const u = os.userInfo();

console.log('====== Identité du processus ======');
console.log(`Username : ${u.username}`);
console.log(`UID      : ${u.uid}`);
console.log(`GID      : ${u.gid}`);
console.log(`HOME     : ${u.homedir}`);
console.log(`UID est root ? ${u.uid === 0 ? '⚠️  OUI (mauvais)' : '✅  NON (bon)'}`);
