App({
  globalData: {
    isDarkMode: true
  },

  onLaunch() {
    // 读取保存的主题设置，默认为暗色
    const isDarkMode = wx.getStorageSync('isDarkMode') !== '' ? wx.getStorageSync('isDarkMode') : true
    this.globalData.isDarkMode = isDarkMode
    this.applyTheme(isDarkMode)
  },

  applyTheme(isDark) {
    this.globalData.isDarkMode = isDark
    wx.setStorageSync('isDarkMode', isDark)

    // 更新页面样式
    const pages = getCurrentPages()
    pages.forEach(page => {
      if (page.setTheme) {
        page.setTheme(isDark)
      }
    })
  }
})