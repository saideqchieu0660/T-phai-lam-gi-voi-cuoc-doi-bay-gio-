import fs from 'fs';

const file = 'src/vibe-sandbox/VibeStudyRoom.tsx';
let content = fs.readFileSync(file, 'utf8');

// remove the line
content = content.replace('  const sessionCorrectCount = sessionHistory.filter(h => h.status === "correct").length;\n', '');

// insert it after sessionHistory
const searchStr = '  >([]);\n';
content = content.replace(searchStr, searchStr + '  const sessionCorrectCount = sessionHistory.filter(h => h.status === "correct").length;\n');

fs.writeFileSync(file, content);
console.log("Fixed initialization error");
