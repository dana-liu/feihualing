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
    usedPoemIds: [],
    showSuccessAnimation: false,
    successMessage: '',
    roundStatus: {}
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
      usedPoemIds: [],
      roundStatus: {}
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

    if (!inputText || inputText.trim().length === 0) {
      wx.showToast({
        title: '请输入诗句',
        icon: 'none'
      });
      return;
    }

    // 检查长度是否满足连续两句诗的要求
    const normalized = inputText.replace(/[，。！？、；：""''（）【】]/g, '').trim();
    if (normalized.length < 8) {
      wx.showToast({
        title: '请输入连续的两句诗',
        icon: 'none'
      });
      return;
    }

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

      // 鼓励语列表
      const encouragements = [
        '太棒了！',
        '诗才横溢！',
        '妙语连珠！',
        '才华出众！',
        '出口成章！',
        '博学多才！',
        '诗意盎然！',
        '词采华美！'
      ];
      const randomMsg = encouragements[Math.floor(Math.random() * encouragements.length)];

      // 延迟后处理
      setTimeout(() => {
        const newRoundStatus = {...this.data.roundStatus};
        newRoundStatus[currentRound - 1] = true;

        if (currentRound >= totalRounds) {
          // 最后一轮，只显示Toast
          wx.showToast({
            title: randomMsg + '恭喜完成本轮！',
            icon: 'success'
          });
          setTimeout(() => {
            this.changeKeyword();
          }, 2000);
        } else {
          // 非最后一轮，显示动效后进入下一轮
          this.setData({
            showSuccessAnimation: true,
            successMessage: randomMsg,
            matchedPoetry: result.poem.content,
            roundStatus: newRoundStatus
          });
          setTimeout(() => {
            this.setData({
              currentRound: currentRound + 1,
              inputText: '',
              showResult: false,
              isCorrect: false,
              matchedPoetry: '',
              usedPoemIds: newUsedPoemIds,
              showSuccessAnimation: false,
              successMessage: '',
              roundStatus: newRoundStatus
            });
          }, 1500);
        }
      }, 300);
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
      usedPoemIds: [],
      roundStatus: {}
    });
  },

  goBack() {
    wx.navigateBack();
  }
})
