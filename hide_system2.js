import fs from 'fs';
const file = 'src/lib/store.ts';
let content = fs.readFileSync(file, 'utf8');

const target = `    const systemDecks = [
      "deck_1", "deck_phil_2", "deck_math_1", "deck_math_2", "deck_physics_1", "deck_physics_2", "deck_test_ui", "deck_formatting_test", "deck_test_50", "daily-quest", "remind-later-deck"
    ];
    if (systemDecks.includes(d.id)) return d;`;

const replacement = `    const systemDecks = [
      "deck_1", "deck_phil_2", "deck_math_1", "deck_math_2", "deck_physics_1", "deck_physics_2", "deck_test_ui", "deck_formatting_test", "deck_test_50", "daily-quest", "remind-later-deck"
    ];
    if (systemDecks.includes(d.id)) {
      if (currentUser) return undefined;
      return d;
    }`;

content = content.replace(target, replacement);
fs.writeFileSync(file, content);
