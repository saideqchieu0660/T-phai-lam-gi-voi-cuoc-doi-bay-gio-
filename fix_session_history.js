import fs from 'fs';

const file = 'src/vibe-sandbox/VibeStudyRoom.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add cardId to sessionHistory state
content = content.replace(
  'Array<{\n      cardIndex: number;\n      front: string;',
  'Array<{\n      cardId: string;\n      cardIndex: number;\n      front: string;'
);

// 2. Modify handleMark to update instead of append blindly
const handleMarkTarget = `        setSessionMasteryGained((prev) => prev + diff);

        const nextCorrectCount = sessionCorrectCount + (remembered ? 1 : 0);
        const nextStudiedCount = sessionHistory.length + 1;
        const nextAccuracy = Math.round(
          (nextCorrectCount / nextStudiedCount) * 100,
        );

        setSessionHistory((prev) => [
          ...prev,
          {
            cardIndex: nextStudiedCount,
            front: currentCard.front,
            status: remembered ? "correct" : "incorrect",
            cumulativeCorrect: nextCorrectCount,
            cumulativeStudied: nextStudiedCount,
            accuracy: nextAccuracy,
            masteryChange: diff,
          },
        ]);`;

const handleMarkReplacement = `        setSessionMasteryGained((prev) => prev + diff);

        setSessionHistory((prev) => {
          const existingIndex = prev.findIndex(h => h.cardId === currentCard.id);
          const next = [...prev];
          
          if (existingIndex !== -1) {
             const oldStatus = next[existingIndex].status;
             const newStatus = remembered ? "correct" : "incorrect";
             
             if (oldStatus === "correct" && newStatus === "incorrect") {
                setSessionCorrectCount(c => Math.max(0, c - 1));
             } else if (oldStatus !== "correct" && newStatus === "correct") {
                setSessionCorrectCount(c => c + 1);
             }
             
             next[existingIndex] = {
                 ...next[existingIndex],
                 status: newStatus,
                 masteryChange: diff,
             };
             return next;
          } else {
             const nextStudiedCount = prev.length + 1;
             const nextCorrectCount = sessionCorrectCount + (remembered ? 1 : 0);
             const nextAccuracy = Math.round((nextCorrectCount / nextStudiedCount) * 100);
             
             next.push({
                cardId: currentCard.id,
                cardIndex: nextStudiedCount,
                front: currentCard.front,
                status: remembered ? "correct" : "incorrect",
                cumulativeCorrect: nextCorrectCount,
                cumulativeStudied: nextStudiedCount,
                accuracy: nextAccuracy,
                masteryChange: diff,
             });
             return next;
          }
        });`;

content = content.replace(handleMarkTarget, handleMarkReplacement);

// Remove the direct setSessionCorrectCount from handleMark (since we now do it conditionally or safely)
// Wait, in handleMark, it does `setSessionCorrectCount((prev) => prev + 1);` immediately if remembered.
// Let's remove that immediate increment because we handle it inside setSessionHistory or before it.
// Actually, if we remove it, the sounds and vibrations logic will remain.
