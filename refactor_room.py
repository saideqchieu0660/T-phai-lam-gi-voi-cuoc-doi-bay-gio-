import re

with open("tmp_studyroom4.tsx", "r") as f:
    content = f.read()

# 1. Remove the entire "Đồng bộ thời gian thực Thẻ X" useEffect
content = re.sub(
    r'// Đồng bộ thời gian thực Thẻ X.*?useEffect\(\(\) => \{.*?if \(hasDiff\) \{.*?catch.*?\}\s*setWeakCardIds\(finalWeakIds\);\s*\}\s*\}, \[deck, weakCardIds\]\);',
    '',
    content,
    flags=re.DOTALL
)

# 2. Replace weakCardIds useState
content = re.sub(
    r'const \[weakCardIds, setWeakCardIds\] = useState<string\[\]>\(\[\]\);',
    '''const allDeckCardIds = useMemo(() => deck?.cards?.map((c: any) => c.id) || [], [deck]);
  const deckCardStates = useCardStates(user?.id || "", allDeckCardIds);
  const weakCardIds = useMemo(() => {
    return allDeckCardIds.filter(id => deckCardStates[id]?.isHard);
  }, [allDeckCardIds, deckCardStates]);''',
    content
)

# 3. Rename studyQueueStates to deckCardStates in the remaining code
content = content.replace('studyQueueStates', 'deckCardStates')

# 4. Replace startReviewXCards
new_start_x = '''const startReviewXCards = () => {
    if (!deck) return;
    setStudyQueue(weakCardIds);
    setStudyMode("weak");
    setCurrentIndex(0);
    setSessionCorrectCount(0);
    setSessionMasteryGained(0);
    setFinished(false);
    setIsFlipped(false);
    if (!isPinned) setDeepExplanation(null);
    else setIsMinimized(true);
  };'''

content = re.sub(
    r'const startReviewXCards = \(\) => \{.*?\};',
    new_start_x,
    content,
    flags=re.DOTALL
)

# 5. Fix queue init logic where it restores weak_cards_* from localStorage
# Look at VibeStudyRoom around line 1120:
# if (studyMode === "all") { due = ... } else { setStudyQueue(weakCards); }
# Wait, in tmp_studyroom4, it is:
#     if (loadedMode === "weak") {
#        const weakCards = deck.cards.filter((c: any) => weakCardIds.includes(c.id));
#        setStudyQueue(weakCards.map((c: any) => c.id));
#        setStudyMode("weak");
#      } else { ... }

queue_init_replace = '''
      if (loadedMode === "weak") {
        setStudyQueue(weakCardIds);
        setStudyMode("weak");
      }
'''
content = re.sub(
    r'if \(loadedMode === "weak"\) \{.*?setStudyMode\("weak"\);\s*\}',
    queue_init_replace,
    content,
    flags=re.DOTALL
)

with open("tmp_studyroom5.tsx", "w") as f:
    f.write(content)
