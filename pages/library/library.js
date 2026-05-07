const app = getApp()
const poetry = require('../../utils/poetry.js');

const PAGE_SIZE = 20;

Page({
  data: {
    isDarkMode: true,
    poems: [],
    filteredPoems: [],
    displayPoems: [],
    searchText: '',
    dynastyOptions: ['全部', '唐', '宋', '元', '明', '清', '南唐', '现代', '汉', '南北朝'],
    selectedDynasty: '全部',
    page: 1,
    hasMore: true,
    loading: false
  },

  onLoad() {
    this.setTheme(app.globalData.isDarkMode)
    this.setData({
      poems: poetry.poems,
      filteredPoems: poetry.poems,
      displayPoems: poetry.poems.slice(0, PAGE_SIZE),
      page: 1,
      hasMore: poetry.poems.length > PAGE_SIZE
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

    this.setData({
      filteredPoems: filtered,
      displayPoems: filtered.slice(0, PAGE_SIZE),
      page: 1,
      hasMore: filtered.length > PAGE_SIZE,
      searchText
    });
  },

  onScrollToLower() {
    this.loadMore();
  },

  loadMore() {
    const { displayPoems, filteredPoems, page, hasMore, loading } = this.data;

    if (!hasMore || loading) return;

    this.setData({ loading: true });

    const nextPage = page + 1;
    const endIndex = nextPage * PAGE_SIZE;
    const newPoems = filteredPoems.slice(0, endIndex);

    this.setData({
      displayPoems: newPoems,
      page: nextPage,
      hasMore: endIndex < filteredPoems.length,
      loading: false
    });
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