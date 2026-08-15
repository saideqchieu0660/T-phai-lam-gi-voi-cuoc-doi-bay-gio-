import fs from 'fs';

const file = 'src/vibe-sandbox/VibeStudyRoom.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = `  useEffect(() => {
    if (finished) {
      triggerCelebration();
      if (deck) {
        const progressKey = \`study_progress_\${user?.id || "guest"}_\${deck.id}\`;
        localStorage.setItem(progressKey, "0");
      }
    }
  }, [finished, deck, user?.id]);`;

const replacement = `  useEffect(() => {
    if (finished) {
      triggerCelebration();
      if (deck) {
        const progressKey = \`study_progress_\${user?.id || "guest"}_\${deck.id}\`;
        localStorage.setItem(progressKey, "0");
        
        const storageKey = \`weak_cards_\${deck.id}\`;
        const savedWeakIds = JSON.parse(localStorage.getItem(storageKey) || "[]");
        setWeakCardIds(savedWeakIds);
      }
    }
  }, [finished, deck, user?.id]);`;

content = content.replace(target, replacement);
fs.writeFileSync(file, content);
