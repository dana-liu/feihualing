const poems = require('../data/poems.js');

function findPoemsWithKeyword(keyword) {
  return poems.filter(poem =>
    poem.keywords.includes(keyword)
  );
}

function checkAnswer(inputText, keyword) {
  const normalizedInput = inputText.replace(/[，。！？、；：""''（）]/g, '').trim();
  const poemsWithKeyword = findPoemsWithKeyword(keyword);

  // 输入太短不算正确
  if (normalizedInput.length < 4) {
    return { correct: false, poem: null };
  }

  for (const poem of poemsWithKeyword) {
    // 检查输入是否与任一诗句完全匹配或包含该诗句
    const sentences = poem.content.split(/[，。！？]/);
    for (const sentence of sentences) {
      const s = sentence.trim().replace(/[，。！？（）]/g, '');
      // 完全匹配
      if (s === normalizedInput) {
        return { correct: true, poem };
      }
      // 输入包含完整句子
      if (normalizedInput.includes(s) && s.length >= 4) {
        return { correct: true, poem };
      }
      // 句子包含输入（输入是句子的一部分）
      if (s.includes(normalizedInput) && normalizedInput.length >= 4) {
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