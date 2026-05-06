const app = getApp()
const poetry = require('../../utils/poetry.js');

Page({
  data: {
    isDarkMode: true,
    poems: [],
    filteredPoems: [],
    searchText: '',
    dynastyOptions: ['全部', '唐', '宋', '元', '明', '清'],
    selectedDynasty: '全部'
  },

  onLoad() {
    this.setTheme(app.globalData.isDarkMode)
    this.setData({
      poems: poetry.poems,
      filteredPoems: poetry.poems
    });
  },

  onShow() {
    this.setTheme(app.globalData.isDarkMode)
  },

  setTheme(isDark) {
    this.setData({ isDarkMode: isDark })
  },

  onSearch(e) {
    const searchText = e.detail.value.toLowerCase();
    const { poems, selectedDynasty } = this.data;

    this.filterPoems(poems, searchText, selectedDynasty);
  },

  selectDynasty(e) {
    const dynasty = e.currentTarget.dataset.dynasty;
    const { poems, searchText } = this.data;

    this.setData({ selectedDynasty: dynasty });
    this.filterPoems(poems, searchText, dynasty);
  },

  filterPoems(allPoems, searchText, dynasty) {
    let filtered = allPoems;

    // 按朝代筛选
    if (dynasty !== '全部') {
      filtered = filtered.filter(poem => poem.dynasty === dynasty);
    }

    // 按搜索文本筛选
    if (searchText) {
      filtered = filtered.filter(poem =>
        poem.title.toLowerCase().includes(searchText) ||
        poem.author.toLowerCase().includes(searchText) ||
        poem.content.toLowerCase().includes(searchText)
      );
    }

    this.setData({ filteredPoems: filtered, searchText });
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