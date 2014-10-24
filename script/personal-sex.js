/*
  2014.10.15
  修改性别
  魏露霞
 */
apiready = function(){
  var ui = {
      $box_editSex: $('#box-editSex')
    , $btn_editSex_save: $('#btn-editSex-save')
    , $btn_close: $('#btn-close')
  };

  var oPage = {
    init : function() {
      this.view();
      this.listen();
    },
    view : function() {
      //初始化内容高度
      $('#conWrap, .personal-center').height(api.winHeight*window.devicePixelRatio - $('.top-bar').height());
      fInitInfo();
    },
    listen : function()　{
      var self = this;

      // 关闭
      ui.$btn_close.on('click', function() {
        api.closeWin({
          animation: {
            type: 'reveal',
            subType: 'from_top',
            duration: 300
          }
        });
      });

      // 选择性别
      ui.$box_editSex.on('click', 'li:not(".active")', function() {
        $(this).addClass('active').siblings('li').removeClass('active');
      });

      // 保存编辑--性别
      ui.$btn_editSex_save.on('click', function() {
        self.fFormSubmit(ui.$box_editSex, URLConfig('editInfo'));
      });
    }
    // 显示错误
  , fDealCheckResult: function($target, msg, isok){
      var self = this;
      $target.data('isok', isok);
      if(!isok) {
        setTimeout(function() {
          $target.focus();
        }, 1000);
        api.toast({msg: msg, duration: 1000, location: 'middle'});
      }
    }
    // 表单提交
  , fFormSubmit: function($obj, url){
      var self = this;
      
      if(!ui.$box_editSex.find('li.active').length) {
        self.fDealCheckResult(ui.$box_editSex, '请选择性别！', false);
        return;
      }

      api.showProgress({
        style: 'default',
        animationType: 'fade',
        title: '正在保存中...',
        text: '先喝杯茶...',
        modal: false
      });
      api.ajax({
        url: url,
        method: 'post',
        dataType: 'json',
        data: {
          values: {gender: ui.$box_editSex.find('li.active').data('type')}
        }
      }, function(ret, err){
        api.hideProgress();
        if(ret) {
          if(ret.code == 0) {
            $api.setStorage('user', ret.data);
            api.execScript({
              name: 'personal',
              script: 'fInitInfo();'
            });
            api.closeWin({
              animation: {
                type: 'reveal',
                subType: 'from_top',
                duration: 300
              }
            });
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
    }
  }
  oPage.init();
}

function fInitInfo() {
  var user = $api.getStorage('user');
  if(user) {
    if(user.gender == '1') {
      $('#box-editSex').find('li').eq(0).addClass('active').siblings().removeClass('active');
    } else if(user.gender == '2') {
      $('#box-editSex').find('li').eq(1).addClass('active').siblings().removeClass('active');
    }
  }  
}


  
