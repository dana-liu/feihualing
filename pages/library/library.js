const poetry = require('../../utils/poetry.js');

Page({
  data: {
    poems: [],
    filteredPoems: [],
    searchText: ''
  },

  onLoad() {
    this.setData({
      poems: poetry.poems,
      filteredPoems: poetry.poems
    });
  },

  onSearch(e) {
    const searchText = e.detail.value.toLowerCase();
    const { poems } = this.data;

    if (!searchText) {
      this.setData({ filteredPoems: poems });
      return;
    }

    const filtered = poems.filter(poem =>
      poem.title.toLowerCase().includes(searchText) ||
      poem.author.toLowerCase().includes(searchText) ||
      poem.content.toLowerCase().includes(searchText)
    );

    this.setData({ filteredPoems: filtered });
  },

  goBack() {
    wx.navigateBack();
  }
})