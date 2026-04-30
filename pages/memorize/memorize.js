const poetry = require('../../utils/poetry.js');

Page({
  data: {
    keyword: '',
    keywords: ['月', '花', '春', '酒', '诗', '风', '雨', '雪', '秋', '江', '山', '水', '日', '云', '鸟', '鱼', '心', '思', '故', '乡'],
    filteredPoems: [],
    currentIndex: 0,
    totalCount: 0,
    currentPoem: {},
    nextTitle: '',
    progress: 0
  },

  onLoad() {
    // 初始状态下不加载诗词，等待用户选择关键字
    this.setData({
      filteredPoems: [],
      totalCount: 0
    });
  },

  selectKeyword(e) {
    const keyword = e.currentTarget.dataset.keyword;
    const poemsWithKeyword = poetry.findPoemsWithKeyword(keyword);

    poemsWithKeyword.forEach(p => {
      p.sentences = p.content.split(/[，。！？]/).filter(s => s.trim());
    });

    this.setData({
      keyword,
      filteredPoems: poemsWithKeyword,
      currentIndex: 0,
      totalCount: poemsWithKeyword.length,
      currentPoem: poemsWithKeyword.length > 0 ? poemsWithKeyword[0] : {}
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
