const fs = require('fs');
const os = require('os');

console.log(`User: ${os.userInfo().username} (uid=${os.userInfo().uid})`);
console.log('--- Tests d écriture ---');

// Test 1 : écrire dans /app (devrait être bloqué en read_only)
try {
  fs.writeFileSync('/app/forbidden.txt', 'oops');
  console.log('/app/forbidden.txt        : ⚠️  ÉCRITURE RÉUSSIE (mauvais)');
} catch (e) {
  console.log(`/app/forbidden.txt        : ✅  bloqué (${e.code})`);
}

// Test 2 : écrire dans /tmp (autorisé via tmpfs)
try {
  fs.writeFileSync('/tmp/allowed.txt', 'ok');
  console.log('/tmp/allowed.txt          : ✅  écriture autorisée (tmpfs)');
} catch (e) {
  console.log(`/tmp/allowed.txt          : ⚠️  bloqué (${e.code})`);
}

// Test 3 : tenter de modifier /etc (bloqué)
try {
  fs.writeFileSync('/etc/evil.conf', 'hack');
  console.log('/etc/evil.conf            : ⚠️  ÉCRITURE RÉUSSIE (mauvais)');
} catch (e) {
  console.log(`/etc/evil.conf            : ✅  bloqué (${e.code})`);
}
