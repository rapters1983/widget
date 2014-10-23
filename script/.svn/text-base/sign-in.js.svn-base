/*
2014.10.18
每日签到
魏露霞
 */
apiready = function() {

  api.addEventListener({name:'viewappear'}, function(ret, err){
    fInitInfo();
  });
  
  var ui = {
  }

  var oPage = {
    init: function() {
      this.view();
      this.listen();
    },
    view: function() {
      var self = this;
      fInitInfo();
    },
    listen: function()　{
      var self = this;

      // 点击获取奖励
      $('#btn-require').on('click', function() {
        yp.ajax({
          url: URLConfig('sTaskReceiveUrl')
        , method: 'post'
        , dataType: 'json'
        , data: {
            values: {type: 'sign'}
          }
        }, function(ret, err) {
          if(ret) {
            if(ret.code == 0) {
              api.closeWin();
            } else{
              api.alert({msg: ret.message});
            }
          } else{
            api.alert({msg: '网络似乎出现了异常'});
            // api.alert({
            //   msg:('错误码：'+err.code+'；错误信息：'+err.msg+'网络状态码：'+err.statusCode)
            // });
          }
        });
      });
    }
  }
  oPage.init();
}
// 初始化
function fInitInfo() {
  var data = api.pageParam;
  $('#goldlist').find('li').slice(0, data.days).each(function() {
    $(this).find('span').replaceWith('<a href="javascript:;" class="get-btn">已签到</a>');
  });
}