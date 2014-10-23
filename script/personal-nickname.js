/*
  2014.10.15
  修改昵称
  魏露霞
 */
apiready = function(){
  var ui = {
      $txt_nickname: $('#txt-nickname')
    , $btn_editNickname_save: $('#btn-editNickname-save')
    , $btn_close: $('#btn-close')
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

      // 输入控件验证
      self.oCheckFun = {
        'nickname': self.fNicknameCheck
      };

      // 回车事件
      ui.$txt_nickname.keydown(function(e) {
        var kc = e.which || e.keyCode;
        if(kc == 13) {
          $(this).blur();
          ui.$btn_editNickname_save.trigger('click');
        }
      });

      // 保存编辑--昵称
      ui.$btn_editNickname_save.on('click', function() {
        self.fFormSubmit(URLConfig('editInfo'));
      });

    }
    // 去除空格
  , fTrimStr: function(cont){
      if (cont == null) {
        return cont;
      }
      return cont = cont.replace(/^\s+|\s+$/g,"");
    }
    // 获取长度
  , fGetStrLen: function(s){
      var l = 0;
      var a = s.split("");
      for (var i=0;i<a.length;i++) {
          if (a[i].charCodeAt(0)<299) {
            l++;
          } else {
            l+=3;
          }
      }
      return l;
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
  , fFormSubmit: function(url){
      var self = this;

      var oCheck = self.oCheckFun[ ui.$txt_nickname.data('type') ].call(self, ui.$txt_nickname);
      self.fDealCheckResult(ui.$txt_nickname, oCheck.message, oCheck.isok);
      if(!oCheck.isok) {
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
          values: {'nickname': ui.$txt_nickname.val()}
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
    // 昵称监测
  , fNicknameCheck: function($target){
      var self = this
        , val = self.fTrimStr($target.val())
        , len = 0
        , oResult = { isok: false, message: '' };

      len = self.fGetStrLen(val);
      if( '' == val ){  // 判断是否为空
        oResult.message = $target.data('required');
      // } else if( 4 > len || 40 < len ){
      } else if( 6 > len || 24 < len ){
        oResult.message = $target.data('invalide');
      } else {
        oResult.isok = true;
      }

      return oResult;
    }
  }
  oPage.init();
}

function fInitInfo() {
  var user = $api.getStorage('user');
  $('#txt-nickname').val(user.nickname);
}


  
