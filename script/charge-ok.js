/*
2014.10.19
充值页面--成功
魏露霞
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
  };

  var oPage = {
    init : function() {
      this.view();
      this.listen();
    },
    view : function() {
      fInitInfo();
    },
    listen : function()　{
      var self = this;
    }
  }
  oPage.init();
}

// 初始化页面数据
function fInitInfo() {
  var data = api.pageParam;
  $('#txt-account').text(data.account);
  $('#txt-payType').text(data.payType);
  $('#txt-gold').text(data.gold);
  $('#txt-coin').text(data.coin);

}

  
