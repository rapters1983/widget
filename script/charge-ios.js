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

  var product = 'com.gameabc.zhanqiIPhone.420gold', price = 6, gold = 420;
  var zhanqi = api.require('zhanqiMD');

  var oPage = {
    init : function() {
      this.view();
      this.listen();
    },
    view : function() {
      //初始化内容高度
      if(api.systemType === 'ios') {
        $('#conWrap, .recharge').height(api.winHeight*window.devicePixelRatio - $('.top-bar').height());
      }else{
        $('#conWrap, .recharge').height(api.winHeight - $('.top-bar').height());
      }
      fInitInfo();
    },
    listen : function()　{
      var self = this;

      // 请选择充值金额
      ui.$list_chargeType.on('click', 'li:not(".active")', function() {
        var $this = $(this);
        ui.$list_chargeType.find('.active').removeClass('active');
        $this.addClass('active');
        product = $(this).attr('proid');
        price = $(this).attr('data-rmb');
        gold = $(this).attr('data-gold');
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
        // api.alert({msg: 'gold: ' + $li.data('gold')});
        // api.alert({msg: 'rmb: ' + $li.data('rmb')});
        self.fSubmit();
      });
    },
    fSubmit: function() {
      alert(JSON.stringify({
        'product' : product,
        'count' : 1,
        'price' : price
      }))
      zhanqi.onPayForProduct({
        'product' : product,
        'count' : 1,
        'price' : price
      });
      // api.openWin({
      //   name: 'recharge-ok'
      // , url: '../html/recharge-ok.html'
      // , delay: 100
      // , pageParam: data
      // });
    }
  }
  oPage.init();

  window.onRechargeSuccess = function() {
    api.openWin({
      name: 'recharge-ok'
    , url: '../html/recharge-ok.html'
    , delay: 100
    , pageParam: {
        'gold' : gold,
        'account' : $api.getStorage('user')['account'],
        'coin' : gold
      }
    });
  }

}

// 初始化页面数据
function fInitInfo() {
  yp.ajax({
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
      api.alert({msg: '网络似乎出现了异常'});
    }
  });
}

  
