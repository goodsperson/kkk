var app = getApp();
Page({
  data: {
    avatarUrl: '',
    canpoint: 0,
    allpoint: 0,
    alrpoint: 0,
    list: '',
    gift: '',
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    openid: ''
  },
  onShow: function () {
    console.log("刷新页面");
    this.onLoad();//刷新页面
  },
  onLoad: function () {
    wx.showShareMenu({
      withShareTicket: true
    });
    var that = this
    wx.login({
      success: function (res) {
        wx.request({
          url: 'https://www.yuebaoyuan.com.cn/wx/public/index.php/api2/getOpenId',
          data: {
            'code': res.code
          },
          success: function (obj) {
            that.setData({
              openid: obj.data.openid
            })
            wx.request({
              url: 'https://www.yuebaoyuan.com.cn/wx/public/index.php/api2/getInfo',
              method: 'POST',
              data: {
                'openId': obj.data.openid
              },
              success: function(th){
                if(th.data.status==200){
                  var po = th.data.user.cumPoints - th.data.user.remainPoints
                  that.setData({
                    avatarUrl: th.data.avatarUrl,
                    canpoint: th.data.user.remainPoints,
                    allpoint: th.data.user.cumPoints,
                    alrpoint: po,
                    list: th.data.pointrecord,
                    gift: th.data.giftrecord,
                  })
                } else if (th.data.status == 202 || th.data.status == 500){
                  wx.showToast({
                    'title': th.data.mes,
                    'icon': 'none',
                    'image': '../images/exit.png'
                  })
                }
              }
            })
          }
        })
      }
    })
  },
  exchange: function (res) {
    wx.navigateTo({
      url: '../exchange/exchange?openid=' + res.target.dataset.id
    })
  },
  onShareAppMessage: function (e) {
    return {
      title: '自定义分享标题',
      desc: '自定义分享描述',
      path: '/pages/index/index',
      success(e) {
        //判断是否群发
        if (e.hasOwnProperty('shareTickets')) {
          app.success(app);
        } else {
          app.notMass();
        }
      },
      fail(e) {
        app.fail();
      },
      complete() {
        console.log("转发动作完成");
      }
    }
  }
})
