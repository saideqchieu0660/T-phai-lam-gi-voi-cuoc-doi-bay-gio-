import re
import sys

def main():
    with open("tmp_studyroom.tsx", "r") as f:
        content = f.read()

    # 1. Add imports
    import_statement = 'import { CardStateManager, useCardState, useCardStates } from "../lib/CardStateManager";\n'
    content = content.replace('import { useTheme } from "../components/ThemeProvider";', 'import { useTheme } from "../components/ThemeProvider";\n' + import_statement)

    # 2. Remove personalCardStates and its snapshot listener
    # Actually, we can just rip out the whole chunk from:
    # const [personalCardStates, setPersonalCardStates] = useState<any[]>([]);
    # to the end of the `useMemo` for `deck`.
    
    # We will find where `const [personalCardStates` is
    # and replace the `deck` computation with just `const deck = rawDeck;`
    
    # Let's use regex
    
    content = re.sub(
        r'const \[personalCardStates, setPersonalCardStates\] = useState<any\[\]>\(\[\]\);.*?const deck = useMemo\(\(\) => \{.*?return mergedDeck;\n  \}, \[rawDeck, personalCardStates\]\);',
        'const deck = rawDeck;',
        content,
        flags=re.DOTALL
    )

    # 3. Replace studyQueue state
    content = content.replace(
        'const [studyQueue, setStudyQueue] = useState<Flashcard[]>([]);',
        'const [studyQueue, setStudyQueue] = useState<string[]>([]);\n  const studyQueueStates = useCardStates(user?.id, studyQueue);\n  const [deckVersion, setDeckVersion] = useState(0);'
    )
    
    # 4. Replace setStudyQueue calls
    content = content.replace('setStudyQueue(due);', 'setStudyQueue(due.map((c: any) => c.id));')
    content = content.replace('setStudyQueue(weakCards);', 'setStudyQueue(weakCards.map((c: any) => c.id));')
    content = content.replace('setStudyQueue(deck.cards || []);', 'setStudyQueue(deck.cards ? deck.cards.map((c: any) => c.id) : []);')
    content = content.replace('setStudyQueue(targetQueue);', 'setStudyQueue(targetQueue.map((c: any) => c.id));')
    content = content.replace('setStudyQueue((prev) => [...prev, newCardObj]);', 'setStudyQueue((prev) => [...prev, newCardObj.id]);')
    
    # Filter by id (already uses id)
    content = content.replace('setStudyQueue((prev) => prev.filter((c) => c.id !== currentCard.id));', 'setStudyQueue((prev) => prev.filter((id) => id !== currentCard.id));')
    content = content.replace('setStudyQueue((prev) => prev.filter((c) => c.id !== targetCard.id));', 'setStudyQueue((prev) => prev.filter((id) => id !== targetCard.id));')
    
    # FindIndex by id
    content = content.replace('const indexInQueue = studyQueue.findIndex(\n        (qCard) => qCard.id === card.id,\n      );', 'const indexInQueue = studyQueue.findIndex((id) => id === card.id);')
    content = content.replace('const finalIndex = targetQueue.findIndex((qCard) => qCard.id === card.id);', 'const finalIndex = targetQueue.findIndex((c: any) => c.id === card.id);')
    content = content.replace('const indexInQueue = prevQueue.findIndex((qCard) => qCard.id === c.id);', 'const indexInQueue = prevQueue.findIndex((id) => id === c.id);')

    # Remove the .map(...) updates in handleSaveEdit and others
    content = re.sub(
        r'setStudyQueue\(\(prevQueue\) =>\s*prevQueue\.map\(\(c\) =>\s*c\.id === currentCard\.id\s*\?\s*\{.*?\}.*?:\s*c\s*\)\s*\);',
        'setDeckVersion(v => v + 1);',
        content,
        flags=re.DOTALL
    )

    # 5. currentCard resolution
    # Find: const currentCard = studyQueue[currentIndex];
    current_card_replacement = """
  const currentCardId = studyQueue[currentIndex];
  const currentCardState = useCardState(user?.id, currentCardId);
  const currentCardStatic = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    deckVersion; 
    return deck?.cards?.find((c: any) => c.id === currentCardId);
  }, [deck, currentCardId, deckVersion]);
  
  const currentCard = useMemo(() => {
    if (!currentCardStatic) return null as any;
    return {
      ...currentCardStatic,
      mastery: currentCardState?.mastery ?? currentCardStatic.mastery ?? 0,
      isHard: currentCardState?.isHard ?? currentCardStatic.isHard ?? false,
      repetitionCount: currentCardState?.repetitionCount ?? currentCardStatic.repetitionCount ?? 0,
      interval: currentCardState?.interval ?? currentCardStatic.interval ?? 0,
      efactor: currentCardState?.easeFactor ?? currentCardStatic.efactor ?? 2.5,
      nextReview: currentCardState?.nextReviewDate ?? currentCardStatic.nextReview ?? 0
    };
  }, [currentCardStatic, currentCardState]);
"""
    content = content.replace('const currentCard = studyQueue[currentIndex];', current_card_replacement)

    # Fix studyQueue usage where it treats it as array of objects
    # sessionCardsMasteryAvg
    content = content.replace(
        'studyQueue.reduce((sum, c) => sum + (Number(c.mastery) || 0), 0) /',
        'studyQueue.reduce((sum, id) => sum + (Number(studyQueueStates[id]?.mastery) || 0), 0) /'
    )
    
    # "isHard" updates
    # We need to replace store.updateCardMastery calls
    # wait, there is no updateCardMastery, it's store.updateCard? No, store has updateCardState or something.
    
    with open("tmp_studyroom2.tsx", "w") as f:
        f.write(content)

if __name__ == "__main__":
    main()
