const poetry = require('../../utils/poetry.js');

Page({
  data: {
    keyword: '',
    inputText: '',
    currentRound: 1,
    totalRounds: 10,
    showResult: false,
    isCorrect: false,
    matchedPoetry: '',
    usedPoems: []
  },

  onLoad() {
    const keyword = poetry.getRandomKeyword();
    this.setData({ keyword });
  },

  onInput(e) {
    this.setData({ inputText: e.detail.value });
  },

  toggleVoice() {
    wx.showToast({
      title: '语音识别功能',
      icon: 'none'
    });
  },

  submitAnswer() {
    const { inputText, keyword, usedPoems } = this.data;
    const result = poetry.checkAnswer(inputText, keyword);

    if (result.correct) {
      this.setData({
        showResult: true,
        isCorrect: true,
        matchedPoetry: result.poem.content
      });
    } else {
      this.setData({
        showResult: true,
        isCorrect: false,
        matchedPoetry: ''
      });
    }
  },

  goBack() {
    wx.navigateBack();
  }
})