/* eslint-disable */
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'src', 'data', 'challenges');
const nextDir = path.join(__dirname, '..', '.next');

// Load manifest
const manifest = JSON.parse(fs.readFileSync(path.join(dataDir, 'manifest.json'), 'utf-8'));

let allChallenges = [];
for (const file of manifest.files) {
  const content = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf-8'));
  allChallenges = allChallenges.concat(content);
}

let errors = [];

// [1] ID uniqueness
const ids = new Set();
for (const c of allChallenges) {
  if (ids.has(c.id)) {
    errors.push(`Duplicate ID found: ${c.id}`);
  }
  ids.add(c.id);
}

// [2] Category validity
const validCategories = ['web', 'forensics', 'osint', 'crypto', 'reverse engineering', 'pwn', 'misc/steg', 'boss'];
for (const c of allChallenges) {
  if (!validCategories.includes(c.category)) {
    errors.push(`Invalid category '${c.category}' for ${c.id}`);
  }
}

// [3] Difficulty validity
const validDifficulties = ['beginner', 'intermediate', 'hard', 'boss'];
for (const c of allChallenges) {
  if (!validDifficulties.includes(c.difficulty)) {
    errors.push(`Invalid difficulty '${c.difficulty}' for ${c.id}`);
  }
}

// [4] & [5] Dependency and Relationship validity
for (const c of allChallenges) {
  for (const dep of c.dependencies) {
    if (!ids.has(dep)) {
      errors.push(`Challenge ${c.id} depends on nonexistent challenge ${dep}`);
    }
  }
  const validRelTypes = ['entryPoint', 'hardDependency', 'softDependency', 'evidenceLink', 'bossDependency'];
  for (const rel of c.relationshipTypes) {
    if (!validRelTypes.includes(rel)) {
      errors.push(`Invalid relationshipType '${rel}' in ${c.id}`);
    }
  }
}

// [8] Intentional entry points & [9] Unreachable challenges
const entryPoints = allChallenges.filter(c => c.relationshipTypes.includes('entryPoint')).map(c => c.id);
if (entryPoints.length === 0) {
  errors.push(`No entry points defined in the graph!`);
}
const reached = new Set(entryPoints);
let added = true;
while (added) {
  added = false;
  for (const c of allChallenges) {
    if (!reached.has(c.id)) {
      const canReach = c.dependencies.some(dep => reached.has(dep));
      if (canReach) {
        reached.add(c.id);
        added = true;
      }
    }
  }
}

for (const c of allChallenges) {
  if (!reached.has(c.id)) {
    errors.push(`Challenge ${c.id} is unreachable from any entry point.`);
  }
}

// [11] Client-bundle flag-like strings (Pure Node check)
// IMPORTANT: Only scan .next/static (browser-delivered assets).
// .next/server/ contains server-side route handler bundles that are NEVER sent
// to the browser — flags there are correct, secure, and expected.
function scanDirectory(directory, pattern) {
  let matches = [];
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      matches = matches.concat(scanDirectory(fullPath, pattern));
    } else if (stat.isFile() && (fullPath.endsWith('.js') || fullPath.endsWith('.html') || fullPath.endsWith('.json'))) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (pattern.test(content)) {
        matches.push(fullPath);
      }
    }
  }
  return matches;
}

// Only scan the client-facing static directory, not server chunks
const clientStaticDir = path.join(nextDir, 'static');
if (fs.existsSync(clientStaticDir)) {
  const leaks = scanDirectory(clientStaticDir, /flag\{/i);
  if (leaks.length > 0) {
    errors.push(`Potential flag leak detected in CLIENT static files: \n` + leaks.join('\n'));
  }
} else if (fs.existsSync(nextDir)) {
  console.log("WARN: .next/static directory not found. Did you run `npm run build`?");
} else {
  console.log("WARN: .next directory not found. Did you run `npm run build`?");
}

if (errors.length > 0) {
  console.error("AUDIT FAILED WITH THE FOLLOWING ERRORS:");
  errors.forEach(e => console.error("-", e));
  process.exit(1);
} else {
  console.log("AUDIT PASSED. All challenge manifests are valid, and graph is connected properly.");
}
