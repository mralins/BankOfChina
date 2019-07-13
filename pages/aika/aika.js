//aika.js
//获取应用实例
const app = getApp()
var lnglatXY
Page({
  data: {
    selected_addr: false,
    selected_merc: false,
    moment:'', //数据列表
    more_tips: '上拉加载更多', //数据列表提示
    bus_city:'', //城市列表
    curr_city: '',//当前城市
    city_id: app.globalData.city_id,//当前城市id
    cate_id: '0',//当前品类id
    cate_name:'品类',//当前品类名字
    category: '',//品类list
    active: 0,//当前城市选中状态
    cate_active: 0,//当前品类选中状态
    show: true,
  },
  selected_addr: function (e) {
    if (this.data.selected_addr){
      this.setData({
        selected_addr: false,
        selected_merc: false
      })
    }else{
      this.setData({
        selected_addr: true,
        selected_merc: false,
      })
    }
  },
  selected_merc: function (e) {
    if (this.data.selected_merc){
      this.setData({
        selected_merc: false,
        selected_addr: false,
      })
    }else{
      this.setData({
        selected_merc: true,
        selected_addr: false,
      })
    }
    
  },
  onLoad: function(){
    var that = this;
    that.nowCity();
    that.getBaseInfo();
    setTimeout(function () {
      that.setData({
        show: false,
      })
    }, 2000);
  },
  onShow: function(){
    var that = this;
  },
  onReady: function(){
    var that = this;
    
  },

  //匹配当前城市
  nowCity: function(){
    var that = this;
    for (var index in app.globalData.city_ids) {
      var cities = app.globalData.city_ids[index];
      if (app.globalData.city.indexOf(cities) != -1) {
        app.globalData.city_id = index;
        app.globalData.flag = false;
      }
    }
    lnglatXY = (app.globalData.latitude).replace(/\'/g, '');
    if (app.globalData.flag) {
      that.setData({
        curr_city: '南昌',
      })
      app.globalData.city = '南昌';
      app.globalData.city_id = 1;
    } else {
      that.setData({
        curr_city: app.globalData.city
      })
    }
  },

  // 获取基础信息总方法
  getBaseInfo: function () {
    var that = this;
    app.HttpService.getAiKaInfo({
      card_type: 1,
      city_id: app.globalData.city_id,
      lnglatXY: lnglatXY,
      page: 1,
    }).then(data => {
        const parData = data.slice(1,-1)
        const staData = JSON.parse(parData);
        if (staData.status == 1){
          that.setData({
            moment: staData.list.list,
          })
          that.setBase(staData.base);
          that.setList(staData.list);
        }
      })
  },

  //获取店铺列表总方法
  getShopInfo: function (city_id,page){
    var that = this;
    app.HttpService.getAiKaShopList({
      card_type: 1,
      city_id: app.globalData.city_id,
      lnglatXY: lnglatXY,
      cate_id: that.data.cate_id,
      page: page,
    }).then(data => {
        const parData = data.slice(1, -1)
        const staData = JSON.parse(parData);
        if (staData.status == 1) {
          that.setList(staData.list);
        }else{
          console.log('状态错误');
        }
      })
  },

  //获取基本信息
  setBase: function(data){
    var that = this;
    that.setData({
      bus_city: data
    })
    for (var i = 0; i < data.length;i++){
      if (that.data.curr_city === data[i].city_name){
        var __id = i;
        that.setData({
          category: data[__id].city_cate
        })
      }
    }
  },

  //获取店铺列表
  setList: function(data){
    var that = this;
    app.globalData.pages = data.pages;
    if (app.globalData.curr>1){
      var moment_list = that.data.moment;
      for (var i = 0; i < data.list.length; i++) {
        moment_list.push(data.list[i]);
      }
      that.setData({
        moment: that.data.moment
      })
    }else{
      that.data.moment = '';
      that.setData({
        moment: data.list,
      })
    }
  },

  //城市点击事件
  cityTab: function(event){
    app.globalData.city_id = event.currentTarget.dataset.value;
    app.globalData.city = event.currentTarget.dataset.text;
    this.data.moment = '';
    this.setData({
      curr_city: event.currentTarget.dataset.text,
      active: event.currentTarget.dataset.num,
      cate_active: 0,
      cate_id: 0,
      cate_name: '品类'
    })
    this.getBaseInfo();

  },
  //品类点击事件
  cateTab: function(event){
    this.setData({
      cate_active: event.currentTarget.dataset.num,
      cate_id: event.currentTarget.dataset.value,
      cate_name: event.currentTarget.dataset.text,
    })
    this.getShopInfo(this.data.city_id, 1);
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    if (app.globalData.pages > 1){
      app.globalData.curr = app.globalData.curr + 1;
      if (app.globalData.curr > app.globalData.pages){
        app.globalData.curr = app.globalData.pages;
        that.setData({
          more_tips: '没有更多数据了'
        })
        return false;
      }else{
        that.getShopInfo(that.data.city_id,app.globalData.curr);
        that.setData({
          more_tips: '上拉加载更多'
        })
        if (app.globalData.curr == app.globalData.pages){
          that.setData({
            more_tips: '没有更多数据了'
          })
        }
      }
    }else{
      that.setData({
        more_tips: '没有更多数据了'
      })
    }
    
  }
})
