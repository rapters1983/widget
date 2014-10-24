/*
2014.10.19
充值页面--ios
魏露霞

未完成：
金币余额
充值接口
 */

apiready = function(){

  // 页面显示时触发
  api.addEventListener({name:'viewappear'}, function(ret, err){
    fInitInfo();
  });
  // 页面消失时触发
  // api.addEventListener({name:'viewdisappear'}, function(ret, err){
  //   fInitInfo();
  // });

  var ui = {
      $num_usermoney: $('#num-usermoney')
    , $btn_charge: $('#btn-charge')
    , $list_chargeType: $('#list-chargeType')
  };

  var oPage = {
    init : function() {
      this.view();
      this.listen();
    },
    view : function() {
      //初始化内容高度
      $('#conWrap, .recharge').height(api.winHeight*window.devicePixelRatio - $('.top-bar').height());
      fInitInfo();
    },
    listen : function()　{
      var self = this;

      // 请选择充值金额
      ui.$list_chargeType.on('click', 'li:not(".active")', function() {
        var $this = $(this);
        ui.$list_chargeType.find('.active').removeClass('active');
        $this.addClass('active');
      });
      
      // 立即充值
      ui.$btn_charge.on('click', function() {
        var $this = $(this)
          , $li = ui.$list_chargeType.find('li.active');
        if(!$li.length) {
          api.alert({msg: '请选择充值金额！'});
          return;
        }
        // ajax
        api.alert({msg: 'gold: ' + $li.data('gold')});
        api.alert({msg: 'rmb: ' + $li.data('rmb')});
        self.fSubmit();
      });
    },
    fSubmit: function() {
      var self = this;
      var data = {
        account: '1111'
      , payType: '支付宝'
      , gold: 1000
      , coin: 1000
      };
      api.openWin({
        name: 'recharge-ok'
      , url: '../html/recharge-ok.html'
      , delay: 100
      , pageParam: data
      });
      // yp.ajax({
      //     url: URLConfig('sGetRichUrl')
      //   , method: 'post'
      //   , dataType: 'json'
      //   , data: {
      //     values: {}
      //   }
      //   }, function(ret, err) {
      //     if(ret) {
      //       if(ret['code'] == 0) {
      //         // ...
      //       } else{
      //         api.alert({msg : ret['message']});
      //       }
      //     } else{
      //       api.alert({
      //         msg:('错误码：'+err.code+'；错误信息：'+err.msg+'网络状态码：'+err.statusCode)
      //       });
      //     }
      //   });
    }
  }
  oPage.init();
}

// 初始化页面数据
function fInitInfo() {
  api.ajax({
    url: URLConfig('sGetRichUrl')
  , method: 'get'
  , dataType: 'json'
  }, function(ret, err) {
    if(ret) {
      if(ret['code'] == 0) {
        $('#num-usermoney').text(ret.data.gold.count);
      } else{
        api.alert({msg : ret['message']});
      }
    } else{
      api.alert({
        msg:('错误码：'+err.code+'；错误信息：'+err.msg+'网络状态码：'+err.statusCode)
      });
    }
  });
}

  
