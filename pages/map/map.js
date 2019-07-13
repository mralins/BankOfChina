var amapFile = require('../../libs/amap-wx.js');
const app = getApp()
Page({
  data: {
    key: '2f29003ea1594574d86f8a125b05c899',
    show: false,
    currentLo: null,
    currentLa: null,
    newCurrentLo: null,
    newCurrentLa: null,
    distance: 0,
    duration: 0,
    markers: null,
    scale: 16,
    polyline: null,
    statusType: 'car',
    includePoints: [],
    title:'线路规划'
  },
  onLoad(options) {
    var _this = this;
    wx.setNavigationBarTitle({ title: _this.data.title })
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        console.log(res);
        _this.setData({
          currentLo: options.lng,
          currentLa: options.lat,
          includePoints: [{
            longitude: options.lng,
            latitude: options.lat
          }],
          markers: [{
            iconPath: "../assets/images/icon.png",
            id: 0,
            latitude: options.lat,
            longitude: options.lng,
            width: 25,
            height: 30,
            title: '店铺位置',
            callout: {
              content: options.name,
              color: "#000000",
              fontSize: 14,
              borderRadius: 10,
              bgColor: "white",
              display: "ALWAYS",
              padding: 10,
              boxShadow: "0px 0px 10px rgba(0,0,0,0.5)",
            }
          },{
              iconPath: "../assets/images/me_icon.png",
              id: 0,
              latitude: res.latitude,
              longitude: res.longitude,
              width: 25,
              height: 30,
              title: '我的位置',
          }],
        });
        var markers = _this.data.markers;
        var points = _this.data.includePoints;
        points.push({
          latitude: res.latitude,
          longitude: res.longitude,
        });
        _this.setData({
          newCurrentLo: res.longitude,
          newCurrentLa: res.latitude,
          includePoints: points,
          markers: markers,
          show: true
        });
      }
    });
    var myAmapFun = new amapFile.AMapWX({ key: '2f29003ea1594574d86f8a125b05c899' });

    var origins = ("" + app.globalData.globalLXY[0] + "," + app.globalData.globalLXY[1] + "");
    console.log(origins);
    var destinations = ("" + options.lng + "," + options.lat + "");
    _this.setData({
      shopX: options.lat,
      shopY: options.lng,
    });
    myAmapFun.getDrivingRoute({
      origin: origins,
      destination: destinations,
      zoomToAccuracy: true,
      convert: true,
      success: function (data) {
        var points = [];
        console.log(data);
        if (data.paths && data.paths[0] && data.paths[0].steps) {
          var steps = data.paths[0].steps;
          for (var i = 0; i < steps.length; i++) {
            var poLen = steps[i].polyline.split(';');
            for (var j = 0; j < poLen.length; j++) {
              points.push({
                longitude: parseFloat(poLen[j].split(',')[0]),
                latitude: parseFloat(poLen[j].split(',')[1])
              })
            }
          }
        }
        _this.setData({
          polyline: [{
            points: points,
            dottedLine: false,//虚实线
            arrowLine: true,//箭头线
            color: "#4fad31",
            width: 6
          }]
        });
      }
    })
  },
})