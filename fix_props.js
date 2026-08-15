import fs from 'fs';

const file = 'src/vibe-sandbox/VibeFlashcardActiveView.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'incorrectCount?: number;',
  'incorrectCount?: number;\n  weakCardsCount?: number;\n  onReviewWeakCards?: () => void;'
);

content = content.replace(
  '  incorrectCount = 0,\n  deck,',
  '  incorrectCount = 0,\n  weakCardsCount = 0,\n  onReviewWeakCards,\n  deck,'
);

// We should put the button in the bottom primary controls
const target = `          {onPrevCard && (
            <button 
              type="button"`;

const replacement = `          {weakCardsCount > 0 && onReviewWeakCards && (
             <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onReviewWeakCards(); }}
                className="w-full py-3 sm:py-3.5 rounded-2xl font-extrabold text-sm sm:text-base transition flex items-center justify-center gap-2 bg-red-500/10 text-red-600 dark:bg-red-500/15 dark:text-red-400 hover:bg-red-500 hover:text-white border border-red-500/20 active:scale-[0.98]"
             >
                <X className="w-4.5 h-4.5" />
                Chỉ ôn tập thẻ X ({weakCardsCount})
             </button>
          )}
          {onPrevCard && (
            <button 
              type="button"`;

content = content.replace(target, replacement);

fs.writeFileSync(file, content);
