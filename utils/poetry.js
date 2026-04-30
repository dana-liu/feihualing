const poems = require('../data/poems.json');

function findPoemsWithKeyword(keyword) {
  return poems.filter(poem =>
    poem.keywords.includes(keyword)
  );
}

function checkAnswer(inputText, keyword) {
  const normalizedInput = inputText.replace(/[，。！？、；：""''（）]/g, '');
  const poemsWithKeyword = findPoemsWithKeyword(keyword);

  for (const poem of poemsWithKeyword) {
    const normalizedContent = poem.content.replace(/[，。！？、；：""''（）]/g, '');
    if (normalizedContent.includes(normalizedInput) ||
        normalizedInput.includes(normalizedContent)) {
      return { correct: true, poem };
    }
    // 检查输入是否与任一诗句匹配
    const sentences = poem.content.split(/[，。！？]/);
    for (const sentence of sentences) {
      const s = sentence.trim().replace(/[，。（）]/g, '');
      if (s === normalizedInput || normalizedInput.includes(s) || s.includes(normalizedInput)) {
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