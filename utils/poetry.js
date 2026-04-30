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

  for (const poem of poemsWithKeyword) {
    // 获取原始句子的标点版本，用于对比
    const originalSentences = poem.content.split(/[，。！？]/).filter(s => s.trim());
    for (const sentence of originalSentences) {
      // 句子的纯文字版本
      const pureSentence = sentence.replace(/[，。！？、；：""''（）]/g, '').trim();

      // 严格匹配：用户输入必须恰好等于某个完整句子
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