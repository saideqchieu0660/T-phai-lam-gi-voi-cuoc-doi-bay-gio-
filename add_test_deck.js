import fs from 'fs';

const file = 'src/lib/store.ts';
let content = fs.readFileSync(file, 'utf8');

const cards = Array.from({ length: 50 }, (_, i) => {
  return `{ id: "card_test_${i+1}", front: "Front of Card ${i+1}", back: "Back of Card ${i+1}", subject: "test", mastery: 0, nextReview: Date.now(), isHard: false }`;
}).join(',\n      ');

const newDeck = `
  {
    id: "deck_test_50",
    title: "Test 50 Cards",
    subject: "test",
    cards: [
      ${cards}
    ]
  },
`;

content = content.replace('let decks: Deck[] = [', 'let decks: Deck[] = [' + newDeck);

fs.writeFileSync(file, content);
