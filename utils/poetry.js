const poems = require('../data/poems.js');

function findPoemsWithKeyword(keyword) {
  return poems.filter(poem =>
    poem.keywords.includes(keyword)
  );
}

function checkAnswer(inputText, keyword) {
  // 移除所有标点符号
  const normalizedInput = inputText.replace(/[，。！？、；：""''（）【】]/g, '').trim();
  const poemsWithKeyword = findPoemsWithKeyword(keyword);

  // 必须是连续的两句诗（8-30个字）
  if (normalizedInput.length < 8 || normalizedInput.length > 30) {
    return { correct: false, poem: null };
  }

  for (const poem of poemsWithKeyword) {
    const sentences = poem.content.split(/[，。！？]/).filter(s => s.trim());

    // 检查是否有连续两句匹配用户的输入
    for (let i = 0; i < sentences.length - 1; i++) {
      const sentence1 = sentences[i].replace(/[，。！？、；：""''（）【】]/g, '').trim();
      const sentence2 = sentences[i + 1].replace(/[，。！？、；：""''（）【】]/g, '').trim();
      const combinedText = sentence1 + sentence2;

      // 用户输入必须恰好等于连续两句的合并
      if (combinedText === normalizedInput) {
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