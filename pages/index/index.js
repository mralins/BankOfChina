//index.js
//获取应用实例
var amapFile = require('../../libs/amap-wx.js');
var markersData = {
  latitude: '',
  longitude: '',
  key: '2f29003ea1594574d86f8a125b05c899'
};
const app = getApp()
Page({
  data: {
    imgUrls:[
      '../assets/images/advertising-3.jpg',
      '../assets/images/advertising-2.jpg',
      '../assets/images/advertising-1.jpg',
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
  },
  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  },
  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (options) {
    var that = this;
  },
  onShow: function () {
    //需要小程序基础库1.9.90或以上
    if (!wx.canIUse('getUpdateManager')) {
      // 如果希望用户在最新版本的客户端上体验您的小程序，提示
      var that = this;
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '当前微信版本过低，无法使用该小程序，请升级到最新微信版本后重试。',
        success: function (res) {
          if (res.confirm) {
            console.log("关闭小程序")
            wx.navigateBack({
              delta: -1
            })
          }
        }
      })
    } else {
      var updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        console.log("请求完新版本信息的回调")
      })

      updateManager.onUpdateReady(function () {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success: function (res) {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              console.log("新的版本已经下载好，调用 applyUpdate 应用新版本并重启")
              updateManager.applyUpdate()
            }
          }
        })
      })

      updateManager.onUpdateFailed(function () {
        // 新的版本下载失败
        wx.showModal({
          title: '更新提示',
          content: '新版本下载失败',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              console.log("关闭小程序")
              wx.navigateBack({
                delta: -1
              })
            }
          }
        })
        console.log("新版本下载失败")
      })
    }
    var that = this;
    that.getLocation();
  },
  getLocation: function () {
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        app.globalData.latitude = "'"+res.longitude+","+res.latitude+"'";
        app.globalData.globalLXY = [res.longitude,res.latitude];
        markersData.latitude = res.latitude,
        markersData.longitude= res.longitude,
        // that.getLatitude();
        that.loadCity(markersData.latitude, markersData.longitude);
      },
    })

  },
  // 获取当前地理位置
  loadCity: function (latitude, longitude) {
    var that = this;
    var myAmapFun = new amapFile.AMapWX({ key: markersData.key });

    myAmapFun.getWeather({
      success: function (data) {
        that.setData({
          weather: data
        })
        app.globalData.city = data.liveData.province;
        //成功回调
      },
      fail: function (info) {
        //失败回调
        console.log(info)
      }
    })
  },
})
