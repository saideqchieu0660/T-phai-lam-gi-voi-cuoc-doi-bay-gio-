import fs from 'fs';
const file = 'src/lib/store.ts';
let content = fs.readFileSync(file, 'utf8');

const target = `      filteredDecks = decks.filter(d => {
        if (d.id.startsWith("remind-later-")) return false;
        const isSystem = systemDecks.includes(d.id);
        if (isSystem) return true;`;

const replacement = `      filteredDecks = decks.filter(d => {
        if (d.id.startsWith("remind-later-")) return false;
        const isSystem = systemDecks.includes(d.id);
        if (isSystem) return false;`;

content = content.replace(target, replacement);
fs.writeFileSync(file, content);
