import re

with open("tmp_studyroom3.tsx", "r") as f:
    content = f.read()

sm2_logic = """
        const currentCardState = CardStateManager.getCardState(user?.id || "", currentCard.id);
        const oldMastery = currentCardState?.mastery || 0;
        let newMastery = oldMastery;
        let newIsHard = currentCardState?.isHard || false;
        
        let quality = remembered ? 4 : 1;
        let rep = currentCardState?.repetitionCount || 0;
        let ef = currentCardState?.easeFactor || 2.5;
        let inter = currentCardState?.interval || 0;
        let newLastPointAwarded = currentCardState?.lastPointAwarded || 0;

        if (remembered) {
            if (rep === 0) inter = 1;
            else if (rep === 1) inter = 6;
            else inter = Math.round(inter * ef);
            rep += 1;
            
            newMastery = Math.min(100, oldMastery + 20);
            newIsHard = false;
            
            if (user) {
                const isDoubleXP = user.doubleXPUntil && user.doubleXPUntil > Date.now();
                const isAchilles = user.achillesUntil && user.achillesUntil > Date.now();
                let multiplier = 1;
                if (isAchilles) multiplier = 4;
                else if (isDoubleXP) multiplier = 2;
                
                const twoHours = 2 * 60 * 60 * 1000;
                const canEarnPoints = !newLastPointAwarded || (Date.now() - newLastPointAwarded >= twoHours);
                
                if (canEarnPoints) {
                    user.points += multiplier;
                    newLastPointAwarded = Date.now();
                    import('../vibe-sandbox/sync/VibeSyncEngine').then(({ VibeSyncEngine }) => {
                       VibeSyncEngine.saveProfile(user.id, { points: user.points });
                    });
                }
            }
        } else {
            rep = 0;
            inter = 1;
            newMastery = Math.max(0, oldMastery - 20);
            newIsHard = true;
            
            if (user && user.achillesUntil && user.achillesUntil > Date.now()) {
                if (user.streak && user.streak > 1) {
                    user.streak = 1;
                    import('../vibe-sandbox/sync/VibeSyncEngine').then(({ VibeSyncEngine }) => {
                       VibeSyncEngine.saveProfile(user.id, { streak: 1 });
                    });
                } else if (user.level && user.level > 1) {
                    user.level -= 1;
                    import('../vibe-sandbox/sync/VibeSyncEngine').then(({ VibeSyncEngine }) => {
                       VibeSyncEngine.saveProfile(user.id, { level: user.level });
                    });
                }
            }
        }
        
        ef = ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
        if (ef < 1.3) ef = 1.3;
        
        CardStateManager.updateCardState(user?.id || "", currentCard.id, {
            mastery: newMastery,
            isHard: newIsHard,
            repetitionCount: rep,
            interval: inter,
            easeFactor: ef,
            nextReviewDate: Date.now() + (inter * 86400000),
            lastPointAwarded: newLastPointAwarded
        });
        
        const newMasteryVal = newMastery;
"""

# Replace `const oldMastery = currentCard.mastery; ... const newMasteryVal = newMastery;`
content = re.sub(
    r'const oldMastery = currentCard\.mastery;.*?const newMasteryVal = newMastery;.*?// Since updateCardMastery updates the object reference in memory',
    sm2_logic,
    content,
    flags=re.DOTALL
)

with open("tmp_studyroom4.tsx", "w") as f:
    f.write(content)

