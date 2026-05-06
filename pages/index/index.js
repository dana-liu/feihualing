const app = getApp()

Page({
  data: {
    isDarkMode: true
  },

  onLoad() {
    this.setTheme(app.globalData.isDarkMode)
  },

  onShow() {
    this.setTheme(app.globalData.isDarkMode)
  },

  setTheme(isDark) {
    this.setData({ isDarkMode: isDark })
  },

  onThemeChange(e) {
    const isDark = e.detail.value
    app.applyTheme(isDark)
    this.setTheme(isDark)
  },

  goToPractice() {
    wx.navigateTo({ url: '/pages/practice/practice' });
  },
  goToMemorize() {
    wx.navigateTo({ url: '/pages/memorize/memorize' });
  },
  goToLibrary() {
    wx.navigateTo({ url: '/pages/library/library' });
  },
  goToFavorites() {
    wx.navigateTo({ url: '/pages/favorites/favorites' });
  }
})