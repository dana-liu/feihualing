const poems = require('../data/poems.js');

function findPoemsWithKeyword(keyword) {
  return poems.filter(poem =>
    poem.keywords.includes(keyword)
  );
}

function checkAnswer(inputText, keyword, excludeIds = []) {
  // 移除所有标点符号
  const normalizedInput = inputText.replace(/[，。！？、；：""''（）【】]/g, '').trim();
  let poemsWithKeyword = findPoemsWithKeyword(keyword);

  // 必须是连续的两句诗（8-30个字）
  if (normalizedInput.length < 8 || normalizedInput.length > 30) {
    return { correct: false, poem: null, hint: null };
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
        return { correct: true, poem, hint: null };
      }
    }
  }

  // 答错时，返回一个提示诗词（排除已使用过的）
  const availablePoems = poemsWithKeyword.filter(p => !excludeIds.includes(p.id));
  const hint = availablePoems.length > 0 ? availablePoems[0] : (poemsWithKeyword.length > 0 ? poemsWithKeyword[0] : null);
  return { correct: false, poem: null, hint };
}

function getAllKeywords() {
  const keywordSet = new Set();
  poems.forEach(poem => {
    poem.keywords.forEach(k => keywordSet.add(k));
  });
  return Array.from(keywordSet);
}

function getRandomKeyword() {
  const allKeywords = getAllKeywords();
  return allKeywords[Math.floor(Math.random() * allKeywords.length)];
}

module.exports = {
  findPoemsWithKeyword,
  checkAnswer,
  getRandomKeyword,
  getAllKeywords,
  poems
};