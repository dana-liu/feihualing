const app = getApp()
const poetry = require('../../utils/poetry.js');

Page({
  data: {
    isDarkMode: true,
    poems: []
  },

  onLoad() {
    this.setTheme(app.globalData.isDarkMode)
    this.loadFavorites();
  },

  onShow() {
    this.setTheme(app.globalData.isDarkMode)
    this.loadFavorites();
  },

  setTheme(isDark) {
    this.setData({ isDarkMode: isDark })
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
