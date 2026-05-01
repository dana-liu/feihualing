const poetry = require('../../utils/poetry.js');

Page({
  data: {
    poem: null,
    sentences: []
  },

  onLoad(options) {
    const { id } = options;
    const poem = poetry.poems.find(p => p.id == id);

    if (!poem) {
      wx.showToast({
        title: '诗词不存在',
        icon: 'none'
      });
      wx.navigateBack();
      return;
    }

    // 处理诗句，生成sentences结构
    const sentences = [];
    let currentSentence = [];
    const punctuation = /[，。！？]/;

    for (let i = 0; i < poem.content.length; i++) {
      const char = poem.content[i];
      if (punctuation.test(char)) {
        currentSentence.push({ char: char, isKeyword: false, isPunctuation: true });
        sentences.push(currentSentence);
        currentSentence = [];
      } else {
        currentSentence.push({ char: char, isKeyword: false });
      }
    }
    if (currentSentence.length > 0) {
      sentences.push(currentSentence);
    }

    this.setData({
      poem: poem,
      sentences: sentences
    });
  },

  goBack() {
    wx.navigateBack();
  }
})
