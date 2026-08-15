const fs = require('fs');
let content = fs.readFileSync('src/vibe-sandbox/VibeFlashcardActiveView.tsx', 'utf8');
content = content.replace('Quên ({incorrectCount})', 'Quên');
content = content.replace('Nhớ ({correctCount})', 'Nhớ');
fs.writeFileSync('src/vibe-sandbox/VibeFlashcardActiveView.tsx', content);
