/*
2014.10.19
充值页面--android
魏露霞

未完成：
充值接口
 */

apiready = function(){

  // 页面显示时触发
  // api.addEventListener({name:'viewappear'}, function(ret, err){
    
  // });
  // 页面消失时触发
  // api.addEventListener({name:'viewdisappear'}, function(ret, err){
  //   fInitInfo();
  // });

  var ui = {
      $txt_money: $('#txt-money')
    , $num_gold: $('#num-gold')
    , $num_coin: $('#num-coin')
    , $btn_charge: $('#btn-charge')
  };

  var oPage = {
    init : function() {
      this.view();
      this.listen();
    },
    gRatio: 100, // 兑换比例 人民币:金币
    cRatio: 100, // 兑换比例 人民币:战旗币
    view : function() {
      fInitInfo();
    },
    listen : function()　{
      var self = this;

      // 输入充值金额
      ui.$txt_money.on('input', function() {
        var $this = $(this)
          , money = (self.fTrimStr($this.val())).replace(/(^0*)/g, "");
        ui.$num_gold.text(money * self.gRatio);
        ui.$num_coin.text(money * self.cRatio);
      })
      .on('keydown', function(e) {
        var $this = $(this);
        var k = window.event ? e.keyCode : e.which;
        if (((k >= 48) && (k <= 57)) || ((k >= 96) && (k<=105)) || k == 8 || k == 0 || k == 37 ||k == 39) {
        } else{
          if (window.event) {
            window.event.returnValue = false;
          } else {
            e.preventDefault();
          }
        }
      })
      .on('blur', function() {
        var $this = $(this)
          , money = (self.fTrimStr($this.val())).replace(/(^0*)/g, "");
        ui.$num_gold.text(money * self.gRatio);
        ui.$num_coin.text(money * self.cRatio);
      });

      // 确认充值
      ui.$btn_charge.on('click', function() {
        if(!ui.$txt_money.val().length) {
          api.alert({msg: '请输入充值金额！'});
        }
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
    },
    // 去除空格
    fTrimStr: function(cont){
      if (cont == null) {
        return cont;
      }
      return cont = cont.replace(/^\s+|\s+$/g,"");
    }
  }
  oPage.init();
}

// 初始化页面数据
function fInitInfo() {
  var money = 1;
  var gRatio = 100; // 兑换比例 人民币:金币
  var cRatio = 100; // 兑换比例 人民币:战旗币
  $("#txt-money").val('1');
  $('#num-gold').text(money * gRatio);
  $('#num-coin').text(money * cRatio);
}

  
