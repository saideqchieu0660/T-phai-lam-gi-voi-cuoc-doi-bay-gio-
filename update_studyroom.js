import fs from 'fs';

const file = 'src/vibe-sandbox/VibeStudyRoom.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = `        correctCount={sessionCorrectCount}
        incorrectCount={sessionHistory.filter((item) => item.status === "incorrect").length}`;

const replacement = `        correctCount={sessionCorrectCount}
        incorrectCount={sessionHistory.filter((item) => item.status === "incorrect").length}
        weakCardsCount={weakCardIds.length}
        onReviewWeakCards={startReviewXCards}`;

content = content.replace(target, replacement);

fs.writeFileSync(file, content);
