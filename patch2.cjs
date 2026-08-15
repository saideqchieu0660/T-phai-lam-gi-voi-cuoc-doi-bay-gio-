const fs = require('fs');
let content = fs.readFileSync('src/vibe-sandbox/VibeBackupRestoreX.tsx', 'utf8');

const replacement = `          if (currentUser) {
            // Cập nhật memory store để đồng bộ trạng thái thẻ
            const statePayload = { isWeakCard: shouldBeHard };
            
            // Push qua VibeSyncEngine để đồng bộ server
            await VibeSyncEngine.enqueueChange({
                type: "UPSERT_CARD_STATE",
                payload: {
                    uid: currentUser.id,
                    cardId: card.id,
                    isWeakCard: shouldBeHard
                }
            }).catch(err => console.warn("Queue ignored:", err));
          }`;
          
const newCode = `          if (currentUser) {
            // Cập nhật memory store để đồng bộ trạng thái thẻ
            const statePayload = { isWeakCard: shouldBeHard };
            
            // Push qua VibeSyncEngine để đồng bộ server
            await VibeSyncEngine.enqueueChange({
                type: "UPSERT_CARD_STATE",
                payload: {
                    uid: currentUser.id,
                    cardId: card.id,
                    isWeakCard: shouldBeHard
                }
            }).catch(err => console.warn("Queue ignored:", err));
            
            if (!globalThis._vibeCardStateUpdates) globalThis._vibeCardStateUpdates = [];
            globalThis._vibeCardStateUpdates.push({ cardId: card.id, isWeakCard: shouldBeHard });
          }`;

content = content.replace(replacement, newCode);

const replacement2 = `      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent("henosis-data-synced"));
      }`;
      
const newCode2 = `      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent("henosis-data-synced"));
        if (globalThis._vibeCardStateUpdates) {
          window.dispatchEvent(new CustomEvent("vibe-card-states-updated", { detail: { states: globalThis._vibeCardStateUpdates } }));
          globalThis._vibeCardStateUpdates = [];
        }
      }`;

content = content.replace(replacement2, newCode2);
fs.writeFileSync('src/vibe-sandbox/VibeBackupRestoreX.tsx', content);
