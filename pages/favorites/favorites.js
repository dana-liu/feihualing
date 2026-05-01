const poetry = require('../../utils/poetry.js');

Page({
  data: {
    poems: []
  },

  onLoad() {
    this.loadFavorites();
  },

  onShow() {
    this.loadFavorites();
  },

  loadFavorites() {
    const favoriteIds = wx.getStorageSync('favorites') || [];
    const allPoems = poetry.poems;
    const favoritePoems = allPoems.filter(p => favoriteIds.includes(p.id));
    this.setData({ poems: favoritePoems });
  },

  goBack() {
    wx.navigateBack();
  },

  goToDetail(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/poetry-detail/poetry-detail?id=' + id
    });
  }
})
