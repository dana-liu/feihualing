const poetry = require('../../utils/poetry.js');

Page({
  data: {
    poems: [],
    currentIndex: 0,
    totalCount: 0,
    currentPoem: {},
    nextTitle: '',
    progress: 0
  },

  onLoad() {
    const poems = poetry.poems;
    poems.forEach(p => {
      p.sentences = p.content.split(/[，。！？]/).filter(s => s.trim());
    });
    this.setData({
      poems,
      totalCount: poems.length,
      currentPoem: poems[0]
    });
    this.updateNextTitle();
  },

  prevPoem() {
    const { currentIndex, poems } = this.data;
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      this.setData({
        currentIndex: newIndex,
        currentPoem: poems[newIndex]
      });
      this.updateNextTitle();
    }
  },

  nextPoem() {
    const { currentIndex, poems } = this.data;
    if (currentIndex < poems.length - 1) {
      const newIndex = currentIndex + 1;
      this.setData({
        currentIndex: newIndex,
        currentPoem: poems[newIndex]
      });
      this.updateNextTitle();
    }
  },

  updateNextTitle() {
    const { currentIndex, poems } = this.data;
    const nextTitle = currentIndex < poems.length - 1 ? poems[currentIndex + 1].title : '';
    const progress = ((currentIndex + 1) / poems.length) * 100;
    this.setData({ nextTitle, progress });
  },

  goBack() {
    wx.navigateBack();
  }
})