const fs = require('fs');
let content = fs.readFileSync('src/vibe-sandbox/VibeStudyRoom.tsx', 'utf8');

// Add listener for vibe-card-states-updated
const listenerCode = `
  useEffect(() => {
    const handleLocalStateUpdate = (e: any) => {
      if (e.detail && e.detail.states) {
        setPersonalCardStates(prev => {
          const next = [...prev];
          e.detail.states.forEach((s: any) => {
            const idx = next.findIndex(p => p.id === s.cardId);
            if (idx >= 0) {
              next[idx] = { ...next[idx], isWeakCard: s.isWeakCard };
            } else {
              next.push({ id: s.cardId, isWeakCard: s.isWeakCard });
            }
          });
          return next;
        });
      }
    };
    window.addEventListener("vibe-card-states-updated", handleLocalStateUpdate);
    return () => window.removeEventListener("vibe-card-states-updated", handleLocalStateUpdate);
  }, []);
`;

content = content.replace('const [personalCardStates, setPersonalCardStates] = useState<any[]>([]);', 'const [personalCardStates, setPersonalCardStates] = useState<any[]>([]);\n' + listenerCode);

fs.writeFileSync('src/vibe-sandbox/VibeStudyRoom.tsx', content);
