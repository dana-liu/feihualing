Page({
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