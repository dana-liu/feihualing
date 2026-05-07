const app = getApp()
const poetry = require('../../utils/poetry.js');
const audio = require('../../utils/audio.js');

Page({
  data: {
    isDarkMode: true,
    isRandomAnimating: false,
    keyword: '',
    inputKeyword: '',
    inputValue: '',
    inputFocused: false,
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
    usedHintIds: [],
    showSuccessAnimation: false,
    successMessage: '',
    roundStatus: {},
    showCompleteModal: false,
    isSubmitting: false,
    wrongAnswer: false
  },

  onLoad() {
    this.setTheme(app.globalData.isDarkMode)
    this.setData({
      suggestedKeywords: ['人', '山', '风', '月', '花', '春', '秋', '雨', '江', '云', '日', '夜', '水', '天', '白', '青', '黄', '红', '柳', '梅', '竹', '菊', '兰', '酒', '情'],
      filteredPoems: []
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
    this.startPractice();
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
            this.startPractice();
          }, 500);
        }, 400);
      }
    }, 70);
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
      isRandomAnimating: false,
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
      usedHintIds: [],
      roundStatus: {},
      showCompleteModal: false
    });
  },

  onInput(e) {
    this.setData({
      inputText: e.detail.value,
      showResult: false,
      wrongAnswer: false,
      hintPoetry: '',
      showHint: false
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

    const { inputText, keyword, currentRound, totalRounds, usedPoemIds, usedHintIds } = this.data;

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

    // 先检查答案是否正确（不排除任何诗词）
    const result = poetry.checkAnswer(inputText, keyword);

    if (result.correct) {
      // 检查是否已经答过
      if (usedPoemIds.includes(result.poem.id)) {
        audio.playWrong();
        // 获取一个提示诗词（排除已回答过的和已提示过的）
        const poemsWithKeyword = poetry.findPoemsWithKeyword(keyword);
        const availablePoems = poemsWithKeyword.filter(p => !usedPoemIds.includes(p.id) && !usedHintIds.includes(p.id));
        const hintPoem = availablePoems.length > 0 ? availablePoems[0] : null;

        this.setData({
          showResult: true,
          isCorrect: false,
          matchedPoetry: '这句诗已经答过了，换一句试试',
          hintPoetry: hintPoem ? hintPoem.content : '',
          wrongAnswer: true
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
          roundStatus: newRoundStatus,
          wrongAnswer: false
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
            usedHintIds: [],
            showSuccessAnimation: false,
            successMessage: '',
            roundStatus: newRoundStatus,
            wrongAnswer: false
          });
          this.submitting = false;
        }, 1500);
      }
    } else {
      audio.playWrong();
      // 获取一个提示诗词（排除已回答过的和已使用过的）
      const poemsWithKeyword = poetry.findPoemsWithKeyword(keyword);
      const availablePoems = poemsWithKeyword.filter(p => !usedPoemIds.includes(p.id) && !usedHintIds.includes(p.id));
      const hintPoem = availablePoems.length > 0 ? availablePoems[0] : null;

      this.setData({
        showResult: true,
        isCorrect: false,
        matchedPoetry: '回答错误',
        hintPoetry: hintPoem ? hintPoem.content : '',
        showHint: false,
        wrongAnswer: true
      });
      this.submitting = false;
    }
  },

  showHint() {
    const { hintPoetry, usedHintIds, keyword } = this.data;
    // 找到当前提示诗词的ID并加入已使用列表
    const poemsWithKeyword = poetry.findPoemsWithKeyword(keyword);
    const hintPoem = poemsWithKeyword.find(p => p.content === hintPoetry);
    if (hintPoem && !usedHintIds.includes(hintPoem.id)) {
      usedHintIds.push(hintPoem.id);
    }
    this.setData({ showHint: true, usedHintIds });
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
      usedHintIds: [],
      roundStatus: {},
      showCompleteModal: false,
      isSubmitting: false,
      wrongAnswer: false
    });
  },

  goBack() {
    wx.navigateBack();
  }
})
