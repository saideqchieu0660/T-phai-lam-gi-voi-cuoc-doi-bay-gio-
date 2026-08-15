import fs from 'fs';

const file = 'src/vibe-sandbox/VibeStudyRoom.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = `    const nextStudiedCount = sessionHistory.length + 1;
    const nextAccuracy = Math.round(
      (sessionCorrectCount / nextStudiedCount) * 100,
    );

    setSessionHistory((prev) => [
      ...prev,
      {
        cardIndex: nextStudiedCount,
        front: currentCard.front,
        status: "skipped",
        cumulativeCorrect: sessionCorrectCount,
        cumulativeStudied: nextStudiedCount,
        accuracy: nextAccuracy,
        masteryChange: 0,
      },
    ]);`;

const replacement = `    setSessionHistory((prev) => {
        const existingIndex = prev.findIndex(h => h.cardId === currentCard.id);
        const next = [...prev];
        if (existingIndex !== -1) {
             const oldStatus = next[existingIndex].status;
             if (oldStatus === "correct") {
                 setSessionCorrectCount(c => Math.max(0, c - 1));
             }
             next[existingIndex] = {
                 ...next[existingIndex],
                 status: "skipped",
             };
             return next;
        } else {
             const nextStudiedCount = prev.length + 1;
             const nextAccuracy = Math.round((sessionCorrectCount / nextStudiedCount) * 100);
             next.push({
                cardId: currentCard.id,
                cardIndex: nextStudiedCount,
                front: currentCard.front,
                status: "skipped",
                cumulativeCorrect: sessionCorrectCount,
                cumulativeStudied: nextStudiedCount,
                accuracy: nextAccuracy,
                masteryChange: 0,
             });
             return next;
        }
    });`;

content = content.replace(target, replacement);
fs.writeFileSync(file, content);
