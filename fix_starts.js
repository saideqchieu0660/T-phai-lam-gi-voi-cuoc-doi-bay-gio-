import fs from 'fs';

const file = 'src/vibe-sandbox/VibeStudyRoom.tsx';
let content = fs.readFileSync(file, 'utf8');

let target1 = `    setCurrentIndex(0);
    setSessionCorrectCount(0);
    setSessionMasteryGained(0);
    setSessionHistory([]);
    setFinished(false);`;

let replace1 = `    setCurrentIndex(0);
    setFinished(false);`;

content = content.replaceAll(target1, replace1);
fs.writeFileSync(file, content);
