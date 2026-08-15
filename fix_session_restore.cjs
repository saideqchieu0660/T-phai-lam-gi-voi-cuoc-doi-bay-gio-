const fs = require('fs');
const file = 'src/vibe-sandbox/VibeStudyRoom.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = `      setCurrentIndex(loadedIdx);
      setIsFlipped(false);
      setSessionCorrectCount(0);
      setSessionMasteryGained(0);
      setSessionTimeSpent(0);
      setSessionHistory([]);`;

const replacement = `      setCurrentIndex(loadedIdx);
      setIsFlipped(false);
      
      const sessionKey = \`study_session_data_\${user?.id || "guest"}_\${deck.id}\`;
      const savedSessionStr = localStorage.getItem(sessionKey);
      if (savedSessionStr && loadedIdx > 0) {
        try {
          const savedSession = JSON.parse(savedSessionStr);
          setSessionCorrectCount(savedSession.correctCount || 0);
          setSessionMasteryGained(savedSession.masteryGained || 0);
          setSessionTimeSpent(savedSession.timeSpent || 0);
          setSessionHistory(savedSession.history || []);
        } catch(e) {
          setSessionCorrectCount(0);
          setSessionMasteryGained(0);
          setSessionTimeSpent(0);
          setSessionHistory([]);
        }
      } else {
        setSessionCorrectCount(0);
        setSessionMasteryGained(0);
        setSessionTimeSpent(0);
        setSessionHistory([]);
      }`;

content = content.replace(target, replacement);

const target2 = `  useEffect(() => {
    if (deck && currentIndex !== undefined && currentIndex >= 0) {
      const progressKey = \`study_progress_\${user?.id || "guest"}_\${deck.id}\`;
      try {
        localStorage.setItem(progressKey, currentIndex.toString());
      } catch (e) {
        console.warn("Storage Quota Exceeded", e);
      }
    }
  }, [currentIndex, deck, user?.id]);`;

const replacement2 = `  useEffect(() => {
    if (deck && currentIndex !== undefined && currentIndex >= 0) {
      const progressKey = \`study_progress_\${user?.id || "guest"}_\${deck.id}\`;
      const sessionKey = \`study_session_data_\${user?.id || "guest"}_\${deck.id}\`;
      try {
        localStorage.setItem(progressKey, currentIndex.toString());
        localStorage.setItem(sessionKey, JSON.stringify({
          correctCount: sessionCorrectCount,
          masteryGained: sessionMasteryGained,
          timeSpent: sessionTimeSpent,
          history: sessionHistory
        }));
      } catch (e) {
        console.warn("Storage Quota Exceeded", e);
      }
    }
  }, [currentIndex, deck, user?.id, sessionCorrectCount, sessionMasteryGained, sessionTimeSpent, sessionHistory]);`;

content = content.replace(target2, replacement2);

fs.writeFileSync(file, content);
