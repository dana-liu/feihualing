const app = getApp()
const poetry = require('../../utils/poetry.js');

Page({
  data: {
    isDarkMode: true,
    poem: null,
    sentences: [],
    isFavorited: false,
    highlightKeyword: '',
    favorites: []
  },

  onLoad(options) {
    this.setTheme(app.globalData.isDarkMode)
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

    // 加载收藏
    const favorites = wx.getStorageSync('favorites') || [];
    const isFavorited = favorites.includes(poem.id);

    // 处理诗句，生成sentences结构
    const sentences = this.processSentences(poem.content);

    this.setData({
      poem: poem,
      sentences: sentences,
      isFavorited: isFavorited,
      favorites: favorites
    });
  },

  onShow() {
    this.setTheme(app.globalData.isDarkMode)
  },

  setTheme(isDark) {
    this.setData({ isDarkMode: isDark })
  },

  processSentences(content, highlightKeyword = '') {
    const sentences = [];
    let currentSentence = [];
    const punctuation = /[，。！？]/;

    for (let i = 0; i < content.length; i++) {
      const char = content[i];
      if (punctuation.test(char)) {
        currentSentence.push({ char: char, isHighlight: false, isPunctuation: true });
        sentences.push(currentSentence);
        currentSentence = [];
      } else {
        currentSentence.push({
          char: char,
          isHighlight: highlightKeyword ? char === highlightKeyword : false
        });
      }
    }
    if (currentSentence.length > 0) {
      sentences.push(currentSentence);
    }
    return sentences;
  },

  highlightKeyword(e) {
    const keyword = e.currentTarget.dataset.keyword;
    const { poem, highlightKeyword } = this.data;

    // 切换高亮
    const newKeyword = highlightKeyword === keyword ? '' : keyword;
    const sentences = this.processSentences(poem.content, newKeyword);

    this.setData({
      highlightKeyword: newKeyword,
      sentences: sentences
    });
  },

  toggleFavorite() {
    const { poem, favorites } = this.data;

    const poemId = poem.id;
    const index = favorites.indexOf(poemId);

    if (index > -1) {
      favorites.splice(index, 1);
    } else {
      favorites.push(poemId);
    }

    wx.setStorageSync('favorites', favorites);
    this.setData({
      favorites: favorites,
      isFavorited: index === -1
    });
  },

  goBack() {
    wx.navigateBack();
  }
})
