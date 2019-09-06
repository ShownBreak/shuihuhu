// pages/main/main.js
const backgroundAudioManager = wx.getBackgroundAudioManager()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isplay: true,
    index:1,
    islike:false,
    imgalist: ["https://www.ldfangqi.cn/shuihuhu/bg/reward/reward.png"],
    id :1,
    style_img: '',
    currentTab: '0',
    show:"none"
  },
  //点击播放,(如果要一进来就播放放到onload即可)
  play: function () {
    backgroundAudioManager.play();
    this.setData({ isplay: true });
  },
  //点击 停止
  stop: function () {
    backgroundAudioManager.pause();
    this.setData({ isplay: false });
  },
  
  onShareAppMessage: function (res) {
    return {
      title: '聆听自然之音,助您获得优质睡眠',
      path: '/pages/main/main?id=' + this.data.swiperData[this.data.index - 1].Id,
      imageUrl: this.data.swiperData[this.data.index - 1].shareimg
    }
  },

  gotodream:function(){
    wx.navigateTo({
      url: '/pages/dream/dream'
    })
  },
  onSlideChangeEnd: function (e) {
    var that = this;
    that.data.index = e.detail.current+1
    backgroundAudioManager.src = that.data.swiperData[e.detail.current].music
    backgroundAudioManager.title = that.data.swiperData[e.detail.current].title
    backgroundAudioManager.onEnded(function () {
      backgroundAudioManager.src = that.data.swiperData[e.detail.current].music
    })
  },
  like:function(e){
    var that = this
    var id = e.currentTarget.dataset.id;
    var likes = wx.getStorageSync('likes') || []
    if (likes.indexOf(id) > -1) return
    
    for(var i = 0;i<that.data.swiperData.length;i++){
      if (that.data.swiperData[i].Id == id){
        that.data.swiperData[i].islike = true
      }
    }
    that.setData({
      swiperData: that.data.swiperData
    });

    likes.unshift(id)
    wx.setStorageSync('likes', likes)

    wx.request({
      url: 'https://www.ldfangqi.cn/shuihuhu/sleep.php',
      data: {//请求数据
        code: 2,
        id: id
      }
    })
  },
  previewImage: function (e) {
    let that = this
    wx.previewImage({
      urls: that.data.imgalist // 需要预览的图片http链接列表
    })
  } ,
  onLoad: function (options) {
    // if (options.id){
    //   this.setData({
    //     index: options.id
    //   })
    // }
    var login = wx.getStorageSync('login') || false
    if (!login) {
      wx.showModal({
        title: 'Tips',
        showCancel:false,
        content: '点击屏幕控制声音播放，左右滑动可以切换声音。快去试试吧~安安',
        success(res) {
          if (res.confirm) {
            
          } 
        }
      })
      wx.setStorageSync('login', 1)
    }
    wx.showToast({
      title: '拼命加载中',
      icon: 'loading',
      duration: 100000
    })
    var likes = wx.getStorageSync('likes') || []
    
    wx.showShareMenu({
      withShareTicket: true
    })
    let that = this
    wx.request({
      url: 'https://www.ldfangqi.cn/shuihuhu/sleep.php',
      data: {//请求数据
        code: 1,
      },
      success: function (res) {
        var temp = null
        for (var i = 0; i < res.data.length; i++) {
          if (likes.indexOf(res.data[i].Id) !== -1){
            res.data[i].islike = true
          }else{
            res.data[i].islike = false
          }
        }
        if (options.id){
          for (var i = 0; i < res.data.length; i++) {
            if (res.data[i].Id === options.id) {
              temp = res.data[i]
              res.data.splice(i, 1)
              break
            }
          }
          res.data.unshift(temp);
        }
        
        that.setData({
          swiperData: res.data,
          isplay: true
        });
        backgroundAudioManager.src = that.data.swiperData[0].music
        backgroundAudioManager.title = that.data.swiperData[0].title
        backgroundAudioManager.onEnded(function () {
          backgroundAudioManager.src = that.data.swiperData[0].music
        })
        wx.hideToast()
      },
      fail:function(res){
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '加载失败啦~别灰心，重启一下试试',
          success(res) {
            if (res.confirm) {
            }
          }
        })
      }
    })   
  },

  showMusicList:function(){
    var isShow = this.data.show == "" ? "none" : "";//如果显示就隐藏，隐藏就显示
    this.setData({
      show: isShow
    })
  },
  /*** 点击tab切换***/
  swichNav: function (e) {
    var that = this;
    that.setData({
      currentTab: e.target.dataset.index
    });
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

  }
})