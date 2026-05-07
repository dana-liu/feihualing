const app = getApp()
const poetry = require('../../utils/poetry.js');

Page({
  data: {
    isDarkMode: true,
    isRandomAnimating: false,
    keyword: '',
    inputKeyword: '',
    inputValue: '',
    inputFocused: false,
    suggestedKeywords: ['人', '不', '风', '山', '月', '无', '花', '春', '天', '一', '水', '日', '夜', '云', '上', '来', '江', '长'],
    filteredPoems: [],
    currentIndex: 0,
    totalCount: 0,
    currentPoem: {},
    nextTitle: '',
    progress: 0,
    isFavorited: false,
    favorites: []
  },

  onLoad() {
    this.setTheme(app.globalData.isDarkMode)
    // 加载收藏
    const favorites = wx.getStorageSync('favorites') || [];
    this.setData({
      filteredPoems: [],
      totalCount: 0,
      favorites: favorites
    });
  },

  onShow() {
    this.setTheme(app.globalData.isDarkMode)
  },

  setTheme(isDark) {
    this.setData({ isDarkMode: isDark })
  },

  onKeywordInput(e) {
    const value = e.detail.value;
    // 只允许输入一个汉字
    const chineseChar = value.charAt(value.length - 1);
    if (/[一-龥]/.test(chineseChar)) {
      this.setData({ inputKeyword: chineseChar, inputValue: '', inputFocused: false });
    } else if (value === '') {
      this.setData({ inputKeyword: '', inputValue: '' });
    }
  },

  focusInput() {
    this.setData({ inputFocused: true });
  },

  selectSuggested(e) {
    const keyword = e.currentTarget.dataset.keyword;
    this.setData({ inputKeyword: keyword });
    this.startMemorize();
  },

  randomKeyword() {
    this.setData({ isRandomAnimating: true });

    // 优先从热门关键字中选取
    const hotKeywords = this.data.suggestedKeywords;
    const allKeywords = hotKeywords.length > 0 ? hotKeywords : [];

    if (allKeywords.length === 0) {
      wx.showToast({ title: '暂无可用关键字', icon: 'none' });
      this.setData({ isRandomAnimating: false });
      return;
    }

    let spinCount = 0;
    const spinInterval = setInterval(() => {
      const randomK = allKeywords[Math.floor(Math.random() * allKeywords.length)];
      this.setData({ inputKeyword: randomK });
      spinCount++;

      // 快速滚动后确定最终关键字
      if (spinCount >= 18) {
        clearInterval(spinInterval);
        // 确定最终关键字（从热门中选）
        const finalKeyword = allKeywords[Math.floor(Math.random() * allKeywords.length)];
        this.setData({ inputKeyword: finalKeyword });

        // 等待 stamp 动画完成后进入练习
        setTimeout(() => {
          this.setData({ isRandomAnimating: false });
          setTimeout(() => {
            this.startMemorize();
          }, 500);
        }, 400);
      }
    }, 70);
  },

  startMemorize() {
    const { inputKeyword } = this.data;
    if (!inputKeyword) return;

    let poemsWithKeyword = poetry.findPoemsWithKeyword(inputKeyword);

    if (poemsWithKeyword.length === 0) {
      wx.showToast({
        title: '没有找到相关诗词',
        icon: 'none'
      });
      return;
    }

    // 随机打乱诗词顺序
    poemsWithKeyword = poemsWithKeyword.sort(() => Math.random() - 0.5);

    poemsWithKeyword.forEach(p => {
      // 保留标点符号，逐字符处理
      const sentences = [];
      let currentSentence = [];
      const punctuation = /[，。！？]/;
      for (let i = 0; i < p.content.length; i++) {
        const char = p.content[i];
        if (punctuation.test(char)) {
          // 标点符号单独作为一个元素
          currentSentence.push({ char: char, isKeyword: false, isPunctuation: true });
          sentences.push(currentSentence);
          currentSentence = [];
        } else {
          currentSentence.push({ char: char, isKeyword: char === inputKeyword });
        }
      }
      if (currentSentence.length > 0) {
        sentences.push(currentSentence);
      }
      p.sentences = sentences;
    });

    this.setData({
      keyword: inputKeyword,
      filteredPoems: poemsWithKeyword,
      currentIndex: 0,
      totalCount: poemsWithKeyword.length,
      currentPoem: poemsWithKeyword[0]
    });

    this.updateNextTitle();
    this.checkFavorite();
  },

  toggleFavorite() {
    const { currentPoem, favorites } = this.data;
    if (!currentPoem.id) return;

    const poemId = currentPoem.id;
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

  checkFavorite() {
    const { currentPoem, favorites } = this.data;
    if (!currentPoem.id) return;

    const isFavorited = favorites.includes(currentPoem.id);
    this.setData({ isFavorited });
  },

  prevPoem() {
    const { currentIndex, filteredPoems } = this.data;
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      this.setData({
        currentIndex: newIndex,
        currentPoem: filteredPoems[newIndex]
      });
      this.updateNextTitle();
      this.checkFavorite();
    }
  },

  nextPoem() {
    const { currentIndex, filteredPoems } = this.data;
    if (currentIndex < filteredPoems.length - 1) {
      const newIndex = currentIndex + 1;
      this.setData({
        currentIndex: newIndex,
        currentPoem: filteredPoems[newIndex]
      });
      this.updateNextTitle();
      this.checkFavorite();
    }
  },

  updateNextTitle() {
    const { currentIndex, filteredPoems } = this.data;
    const nextTitle = currentIndex < filteredPoems.length - 1 ? filteredPoems[currentIndex + 1].title : '';
    const progress = filteredPoems.length > 0 ? ((currentIndex + 1) / filteredPoems.length) * 100 : 0;
    this.setData({ nextTitle, progress });
  },

  changeKeyword() {
    this.setData({
      keyword: '',
      inputKeyword: '',
      filteredPoems: [],
      currentIndex: 0,
      totalCount: 0,
      currentPoem: {},
      progress: 0,
      nextTitle: ''
    });
  },

  goBack() {
    wx.navigateBack();
  }
})
