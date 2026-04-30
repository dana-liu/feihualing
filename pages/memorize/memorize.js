const poetry = require('../../utils/poetry.js');

Page({
  data: {
    keyword: '',
    inputKeyword: '',
    suggestedKeywords: ['月', '花', '春', '酒', '风', '雨', '雪', '秋', '江', '山', '水', '日', '云', '鸟', '心', '思', '故', '乡'],
    filteredPoems: [],
    currentIndex: 0,
    totalCount: 0,
    currentPoem: {},
    nextTitle: '',
    progress: 0
  },

  onLoad() {
    this.setData({
      filteredPoems: [],
      totalCount: 0
    });
  },

  onKeywordInput(e) {
    const value = e.detail.value;
    // 只允许输入一个汉字
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
    this.startMemorize();
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
      p.sentences = p.content.split(/[，。！？]/).filter(s => s.trim());
    });

    this.setData({
      keyword: inputKeyword,
      filteredPoems: poemsWithKeyword,
      currentIndex: 0,
      totalCount: poemsWithKeyword.length,
      currentPoem: poemsWithKeyword[0]
    });

    this.updateNextTitle();
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
      currentPoem: {}
    });
  },

  goBack() {
    wx.navigateBack();
  }
})
