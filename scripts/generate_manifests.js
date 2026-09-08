/* eslint-disable */
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'src', 'data', 'challenges');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Generate an array of challenges for a given category
function generateChallenges(category, prefix, count, startId = 1) {
  const challenges = [];
  for (let i = 0; i < count; i++) {
    const id = `${prefix}-${String(startId + i).padStart(2, '0')}`;
    let difficulty = 'intermediate';
    if (i === 0) difficulty = 'beginner';
    if (i === count - 1) difficulty = 'hard';

    challenges.push({
      id,
      category,
      difficulty,
      title: `${category.toUpperCase()} Challenge ${i + 1}`,
      objective: `[PLACEHOLDER] Analyze and exploit the intended vulnerability in ${category}.`,
      prerequisites: [],
      dependencies: i > 0 ? [`${prefix}-${String(startId + i - 1).padStart(2, '0')}`] : [],
      relationshipTypes: i > 0 ? ['softDependency'] : ['entryPoint'],
      estimatedMinutes: 30,
      entities: [],
      storyEvents: [],
      artifactPaths: [],
      technicalMechanism: `[PLACEHOLDER] Technical details for ${id}`,
      hintLevels: [
        'Directional hint placeholder',
        'Technical hint placeholder',
        'Near-solution hint placeholder'
      ],
      interactive: category === 'web' || category === 'pwn',
      points: 100 * (i + 1)
    });
  }
  return challenges;
}

const categories = [
  { file: 'web.json', cat: 'web', prefix: 'WEB', count: 5 },
  { file: 'forensics.json', cat: 'forensics', prefix: 'FOR', count: 4 },
  { file: 'osint.json', cat: 'osint', prefix: 'OSINT', count: 4 },
  { file: 'crypto.json', cat: 'crypto', prefix: 'CRY', count: 4 },
  { file: 'reverse.json', cat: 'reverse engineering', prefix: 'REV', count: 4 },
  { file: 'pwn.json', cat: 'pwn', prefix: 'PWN', count: 3 },
  { file: 'misc.json', cat: 'misc/steg', prefix: 'MISC', count: 3 },
];

let allChallenges = [];

for (const c of categories) {
  const chalList = generateChallenges(c.cat, c.prefix, c.count);
  allChallenges = allChallenges.concat(chalList);
  fs.writeFileSync(path.join(dataDir, c.file), JSON.stringify(chalList, null, 2));
}

// Bosses (2 challenges)
const bosses = [
  {
    id: 'BOSS-01',
    category: 'boss',
    difficulty: 'boss',
    title: 'AURELIA CORE',
    objective: '[PLACEHOLDER] Compromise the deepest technical layer of AURELIA.',
    prerequisites: [],
    dependencies: ['WEB-05', 'REV-04', 'PWN-03'],
    relationshipTypes: ['bossDependency'],
    estimatedMinutes: 120,
    entities: ['SYS-AURELIA'],
    storyEvents: [],
    artifactPaths: [],
    technicalMechanism: '[PLACEHOLDER] Multi-stage web + pwn + RE exploitation of the AURELIA engine.',
    hintLevels: [],
    interactive: true,
    points: 1000
  },
  {
    id: 'BOSS-02',
    category: 'boss',
    difficulty: 'boss',
    title: 'GHOST',
    objective: '[PLACEHOLDER] Uncover the true nature of GHOST and Project ECHO.',
    prerequisites: [],
    dependencies: ['BOSS-01', 'FOR-04', 'OSINT-04', 'CRY-04', 'MISC-03'],
    relationshipTypes: ['bossDependency'],
    estimatedMinutes: 120,
    entities: ['PRJ-ECHO', 'EMP-005'],
    storyEvents: [],
    artifactPaths: [],
    technicalMechanism: '[PLACEHOLDER] Correlation of all evidence and cryptographic culmination.',
    hintLevels: [],
    interactive: false,
    points: 1000
  }
];

allChallenges = allChallenges.concat(bosses);
fs.writeFileSync(path.join(dataDir, 'bosses.json'), JSON.stringify(bosses, null, 2));

// Central Manifest
const manifest = {
  version: "1.0",
  totalChallenges: allChallenges.length,
  categories: categories.map(c => c.cat).concat(['boss']),
  files: categories.map(c => c.file).concat(['bosses.json']),
  challenges: allChallenges.map(c => c.id)
};

fs.writeFileSync(path.join(dataDir, 'manifest.json'), JSON.stringify(manifest, null, 2));

console.log(`Generated ${allChallenges.length} challenges and written to manifest.`);
