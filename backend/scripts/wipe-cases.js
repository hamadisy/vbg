#!/usr/bin/env node
/**
 * One-off: delete every row from `cases` (and its dependent `victims` /
 * `follow_up_entries` rows) from the SQLite file this backend points at.
 *
 * Plain Node + better-sqlite3 + dotenv only (both are regular, not dev,
 * dependencies) - no ts-node/NestJS bootstrap required, so this runs the
 * same way whether or not devDependencies are installed on the VPS.
 *
 * Usage (run from the backend/ directory, same cwd as the app itself so
 * it reads the same .env / DB_STORAGE the running app uses):
 *   node scripts/wipe-cases.js            -> dry run, shows what would happen
 *   node scripts/wipe-cases.js --yes      -> actually deletes everything
 *
 * Always makes a timestamped backup copy of the .sqlite file first.
 */

require('dotenv').config();
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const DB_PATH = path.resolve(process.cwd(), process.env.DB_STORAGE || './data/vbg-dev.sqlite');
const CONFIRMED = process.argv.includes('--yes');

function main() {
  if (!fs.existsSync(DB_PATH)) {
    console.error(`Database file not found at: ${DB_PATH}`);
    console.error('Check DB_STORAGE in .env and that you ran this from the backend/ directory.');
    process.exit(1);
  }

  const db = new Database(DB_PATH);
  const caseCount = db.prepare('SELECT COUNT(*) c FROM cases').get().c;
  const victimCount = db.prepare('SELECT COUNT(*) c FROM victims').get().c;
  const followUpCount = db.prepare('SELECT COUNT(*) c FROM follow_up_entries').get().c;

  console.log(`Database: ${DB_PATH}`);
  console.log(`Currently: ${caseCount} cases, ${victimCount} victims, ${followUpCount} follow-up entries.`);

  if (!CONFIRMED) {
    console.log('\nDry run only - nothing was deleted.');
    console.log('Re-run with --yes to actually delete all of the above.');
    db.close();
    return;
  }

  if (caseCount === 0) {
    console.log('\nNo cases to delete. Nothing to do.');
    db.close();
    return;
  }

  const backupPath = `${DB_PATH}.bak-wipe-cases-${new Date().toISOString().replace(/[:.]/g, '-')}`;
  fs.copyFileSync(DB_PATH, backupPath);
  console.log(`\nBacked up database to: ${backupPath}`);

  const wipe = db.transaction(() => {
    db.prepare('DELETE FROM follow_up_entries').run();
    db.prepare('DELETE FROM victims').run();
    db.prepare('DELETE FROM cases').run();
  });
  wipe();

  const remaining = db.prepare('SELECT COUNT(*) c FROM cases').get().c;
  console.log(`Deleted. Cases remaining: ${remaining}`);
  db.close();
}

main();
