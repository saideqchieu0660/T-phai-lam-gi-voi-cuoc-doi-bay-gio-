import fs from 'fs';

const file = 'src/vibe-sandbox/VibeStudyRoom.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the useState with a derived variable
content = content.replace(
  '  const [sessionCorrectCount, setSessionCorrectCount] = useState(0);',
  '  const sessionCorrectCount = sessionHistory.filter(h => h.status === "correct").length;'
);

// Remove the setter from the loading part
content = content.replace(/setSessionCorrectCount\([^)]*\);/g, '');

fs.writeFileSync(file, content);
console.log("Fixed correct count");
