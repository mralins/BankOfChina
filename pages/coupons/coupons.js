// pages/loan/loan.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      '../assets/images/coup-img-1.jpg',
      '../assets/images/coup-img-2.jpg',
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    show: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var shop_sid = options.sid;
    that.getDetailInfo(shop_sid);
  },
  getDetailInfo: function (shop_sid) {
    var that = this;
    var lnglatXY = (app.globalData.latitude).replace(/\'/g, '');
    app.HttpService.getShopDetail({
      city_id: app.globalData.city_id,
      lnglatXY: lnglatXY,
      sid: shop_sid || 0,
    })
      .then(data => {
        const parData = data.slice(1, -1)
        const staData = JSON.parse(parData);
        if (staData.status == 1) {
          that.setDetailInfo(staData.base);
        }
      })
  },
  setDetailInfo: function(data){
    var that = this;
    that.setData({
      info_details: data,
    }),
      wx.setNavigationBarTitle({ title: data.shop_name })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    setTimeout(function () {
      that.setData({
        show: false,
      })
    }, 2000);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})