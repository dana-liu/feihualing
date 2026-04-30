const poems = require('../data/poems.js');

function findPoemsWithKeyword(keyword) {
  return poems.filter(poem =>
    poem.keywords.includes(keyword)
  );
}

function checkAnswer(inputText, keyword) {
  const normalizedInput = inputText.replace(/[，。！？、；：""''（）]/g, '').trim();
  const poemsWithKeyword = findPoemsWithKeyword(keyword);

  // 输入必须是4-20个字之间
  if (normalizedInput.length < 4 || normalizedInput.length > 20) {
    return { correct: false, poem: null };
  }

  // 先尝试整体匹配（用户输入可能包含多个句子）
  for (const poem of poemsWithKeyword) {
    const pureContent = poem.content.replace(/[，。！？、；：""''（）]/g, '').trim();
    if (pureContent === normalizedInput) {
      return { correct: true, poem };
    }
  }

  // 再尝试单句匹配
  for (const poem of poemsWithKeyword) {
    const originalSentences = poem.content.split(/[，。！？]/).filter(s => s.trim());
    for (const sentence of originalSentences) {
      const pureSentence = sentence.replace(/[，。！？、；：""''（）]/g, '').trim();
      if (pureSentence === normalizedInput) {
        return { correct: true, poem };
      }
    }
  }

  return { correct: false, poem: null };
}

function getRandomKeyword() {
  const commonKeywords = ['月', '花', '春', '酒', '诗', '风', '雨', '雪', '秋', '江', '山', '水', '日', '云', '鸟', '鱼', '心', '思', '故', '乡'];
  return commonKeywords[Math.floor(Math.random() * commonKeywords.length)];
}

module.exports = {
  findPoemsWithKeyword,
  checkAnswer,
  getRandomKeyword,
  poems
};