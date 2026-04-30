const poetry = require('../../utils/poetry.js');

Page({
  data: {
    keyword: '',
    inputKeyword: '',
    suggestedKeywords: [],
    filteredPoems: [],
    currentRound: 1,
    totalRounds: 10,
    inputText: '',
    showResult: false,
    isCorrect: false,
    matchedPoetry: '',
    usedPoemIds: []
  },

  onLoad() {
    const allKeywords = poetry.getAllKeywords();
    const suggested = allKeywords.slice(0, 18);
    this.setData({
      suggestedKeywords: suggested,
      filteredPoems: []
    });
  },

  onKeywordInput(e) {
    const value = e.detail.value;
    const chineseChar = value.charAt(value.length - 1);
    if (/[一-龥]/.test(chineseChar)) {
      this.setData({ inputKeyword: chineseChar });
    } else if (value === '') {
      this.setData({ inputKeyword: '' });
    }
  },

  selectSuggested(e) {
    const keyword = e.currentTarget.dataset.keyword;
    this.setData({ inputKeyword: keyword });
    this.startPractice();
  },

  randomKeyword() {
    const randomK = poetry.getRandomKeyword();
    this.setData({ inputKeyword: randomK });
    this.startPractice();
  },

  startPractice() {
    const { inputKeyword } = this.data;
    if (!inputKeyword) return;

    const poemsWithKeyword = poetry.findPoemsWithKeyword(inputKeyword);

    if (poemsWithKeyword.length === 0) {
      wx.showToast({
        title: '没有找到相关诗词，换一个字试试',
        icon: 'none'
      });
      return;
    }

    this.setData({
      keyword: inputKeyword,
      filteredPoems: poemsWithKeyword,
      currentRound: 1,
      inputText: '',
      showResult: false,
      isCorrect: false,
      matchedPoetry: '',
      usedPoemIds: []
    });
  },

  onInput(e) {
    this.setData({
      inputText: e.detail.value,
      showResult: false
    });
  },

  toggleVoice() {
    wx.showToast({
      title: '语音识别功能',
      icon: 'none'
    });
  },

  submitAnswer() {
    const { inputText, keyword, currentRound, totalRounds, usedPoemIds } = this.data;
    if (!inputText) return;

    const result = poetry.checkAnswer(inputText, keyword);

    if (result.correct) {
      // 检查是否已经答过这首诗
      if (usedPoemIds.includes(result.poem.id)) {
        wx.showToast({
          title: '这句诗已经答过了，换一句试试',
          icon: 'none'
        });
        return;
      }

      // 记录已使用的诗词
      const newUsedPoemIds = [...usedPoemIds, result.poem.id];

      // 答对了，进入下一轮
      if (currentRound >= totalRounds) {
        wx.showToast({
          title: '恭喜完成练习！',
          icon: 'success'
        });
        setTimeout(() => {
          this.changeKeyword();
        }, 1500);
      } else {
        this.setData({
          currentRound: currentRound + 1,
          inputText: '',
          showResult: false,
          isCorrect: false,
          matchedPoetry: '',
          usedPoemIds: newUsedPoemIds
        });
      }
    } else {
      this.setData({
        showResult: true,
        isCorrect: false,
        matchedPoetry: ''
      });
    }
  },

  changeKeyword() {
    this.setData({
      keyword: '',
      inputKeyword: '',
      filteredPoems: [],
      currentRound: 1,
      inputText: '',
      showResult: false,
      isCorrect: false,
      matchedPoetry: '',
      usedPoemIds: []
    });
  },

  goBack() {
    wx.navigateBack();
  }
})
