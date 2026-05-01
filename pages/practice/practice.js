const poetry = require('../../utils/poetry.js');
const audio = require('../../utils/audio.js');

Page({
  data: {
    keyword: '',
    inputKeyword: '',
    suggestedKeywords: [],
    filteredPoems: [],
    currentRound: 1,
    totalRounds: 2,
    selectedRounds: 2,
    roundOptions: [2, 5, 10],
    inputText: '',
    showResult: false,
    isCorrect: false,
    matchedPoetry: '',
    hintPoetry: '',
    showHint: false,
    usedPoemIds: [],
    showSuccessAnimation: false,
    successMessage: '',
    roundStatus: {},
    showCompleteModal: false,
    isSubmitting: false
  },

  onLoad() {
    const poems = poetry.poems;
    const keywordCount = {};
    poems.forEach(p => {
      p.keywords.forEach(k => {
        keywordCount[k] = (keywordCount[k] || 0) + 1;
      });
    });
    const suggested = Object.entries(keywordCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 18)
      .map(([kw]) => kw);
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

  selectRound(e) {
    const round = e.currentTarget.dataset.round;
    this.setData({ selectedRounds: round });
  },

  startPractice() {
    const { inputKeyword, selectedRounds } = this.data;
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
      totalRounds: selectedRounds,
      inputText: '',
      showResult: false,
      isCorrect: false,
      matchedPoetry: '',
      hintPoetry: '',
      showHint: false,
      usedPoemIds: [],
      roundStatus: {},
      showCompleteModal: false
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
    if (this.submitting) return;
    this.submitting = true;

    const { inputText, keyword, currentRound, totalRounds, usedPoemIds } = this.data;

    if (!inputText || inputText.trim().length === 0) {
      wx.showToast({
        title: '请输入诗句',
        icon: 'none'
      });
      this.submitting = false;
      return;
    }

    const normalized = inputText.replace(/[，。！？、；：""''（）【】]/g, '').trim();
    if (normalized.length < 8) {
      wx.showToast({
        title: '请输入连续的两句诗',
        icon: 'none'
      });
      this.submitting = false;
      return;
    }

    const result = poetry.checkAnswer(inputText, keyword);

    if (result.correct) {
      if (usedPoemIds.includes(result.poem.id)) {
        audio.playWrong();
        this.setData({
          showResult: true,
          isCorrect: false,
          matchedPoetry: '这句诗已经答过了，换一句试试'
        });
        this.submitting = false;
        return;
      }

      audio.playCorrect();

      const newUsedPoemIds = [...usedPoemIds, result.poem.id];

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

      const newRoundStatus = {...this.data.roundStatus};
      newRoundStatus[currentRound - 1] = true;

      if (currentRound >= totalRounds) {
        this.setData({
          showCompleteModal: true,
          successMessage: randomMsg + '恭喜完成本轮！',
          roundStatus: newRoundStatus
        });
        this.submitting = false;
      } else {
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
            hintPoetry: '',
            showHint: false,
            usedPoemIds: newUsedPoemIds,
            showSuccessAnimation: false,
            successMessage: '',
            roundStatus: newRoundStatus
          });
          this.submitting = false;
        }, 1500);
      }
    } else {
      audio.playWrong();
      // 显示错误提示，等待用户点击提示按钮
      let hintPoetry = '';
      if (result.hint) {
        hintPoetry = result.hint.content;
      }
      this.setData({
        showResult: true,
        isCorrect: false,
        matchedPoetry: '回答错误',
        hintPoetry: hintPoetry,
        showHint: false
      });
      this.submitting = false;
    }
  },

  showHint() {
    this.setData({ showHint: true });
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
      hintPoetry: '',
      showHint: false,
      usedPoemIds: [],
      roundStatus: {},
      showCompleteModal: false,
      isSubmitting: false
    });
  },

  goBack() {
    wx.navigateBack();
  }
})
