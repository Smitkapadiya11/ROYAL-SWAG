#!/usr/bin/env node
/**
 * Prints SHA-256 hex for ADMIN_PASSWORD_HASH (must match src/app/api/admin/login/route.ts).
 * Usage: npm run admin:hash-password -- "YourSecurePassword"
 *    or: node scripts/hash-admin-password.js "YourSecurePassword"
 */
const crypto = require("crypto");

const pwd = process.argv[2];
if (!pwd) {
  console.error('Usage: node scripts/hash-admin-password.js "<password>"');
  console.error('   or: npm run admin:hash-password -- "<password>"');
  process.exit(1);
}

console.log(crypto.createHash("sha256").update(pwd, "utf8").digest("hex"));
