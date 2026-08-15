const fs = require('fs');
let content = fs.readFileSync('src/vibe-sandbox/VibeFlashcardActiveView.tsx', 'utf8');
content = content.replace('<X className="w-5 h-5 sm:w-6 sm:h-6"/> Quên', '<X className="w-5 h-5 sm:w-6 sm:h-6"/> Quên ({incorrectCount})');
content = content.replace('<Check className="w-5 h-5 sm:w-6 sm:h-6"/> Nhớ', '<Check className="w-5 h-5 sm:w-6 sm:h-6"/> Nhớ ({correctCount})');
fs.writeFileSync('src/vibe-sandbox/VibeFlashcardActiveView.tsx', content);
