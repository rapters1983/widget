/*
  2014.10.15
  登陆
  魏露霞
  未完成：qq登陆
 */
apiready = function(){

  // 页面显示时触发
  // api.addEventListener({name:'viewappear'}, function(ret, err){
  //   api.alert({msg: 3});
  // });
  // 页面消失时触发
  api.addEventListener({name:'viewdisappear'}, function(ret, err){
    fInitInfo();
  });

  function fInitInfo() {
    $('input').val('');
  }
  var ui = {
      $txt_account: $('#txt-account')
    , $txt_pwd: $('#txt-pwd')
    , $btn_login: $('#btn-login')
    , $btn_reg: $('#btn-reg')
    , $btn_close: $('#btn-close')
    , $btn_qq: $('#btn-qq')
  };

  var oPage = {
    init : function() {
      this.view();
      this.listen();
    },
    view : function() {
    },
    listen : function()　{
      var self = this;

      // qq登陆
      ui.$btn_qq.on('click', function() {
        var iaf = api.require('qq');
        iaf.login(function(ret,err){
          if(ret.status) {
            api.alert({
                     title: 'id和token',
                     msg: ret.openId+'*'+ret.accessToken,
                     buttons: ['确定1']
                     });
          } else{
            api.alert({
                       title: 'id和token',
                       msg: err.msg,
                       buttons: ['确定2']
                       });
          }
       });
      });

      // 注册
      ui.$btn_reg.on('click', function() {
        api.openWin({
          name:'register', 
          url:'../html/register.html', 
          delay:100,
          animation: {
            type: 'none',
            subType: 'from_right',
            duration: 300
          }
        });
      });

      // 关闭
      ui.$btn_close.on('click', function() {
        api.closeWin({
          name:'register',
          animation: {
            type: 'none',
            subType: 'from_top',
            duration: 300
          }
        });
        api.closeWin({
          name:'landing',
          animation: {
            type: 'reveal',
            subType: 'from_top',
            duration: 300
          }
        });
      });

      // 账号
      ui.$txt_account.keydown(function(e) {
        var kc = e.which || e.keyCode;
        if(kc == 13) {
          $(this).blur();
          ui.$btn_login.trigger('click');
        }
      });

      // 密码
      ui.$txt_pwd.keydown(function(e) {
        var kc = e.which || e.keyCode;
        if(kc == 13) {
          $(this).blur();
          ui.$btn_login.trigger('click');
        }
      });

      // 登陆
      ui.$btn_login.on('click', function() {
        self.fLogin();
      });

    },
    // 去除空格
    fTrimStr: function(cont){
      if (cont == null) {
        return cont;
      }
      return cont = cont.replace(/^\s+|\s+$/g,"");
    },
    fLogin: function() {
      var self = this;
      var accountCont = self.fTrimStr(ui.$txt_account.val());
      var pwdCont = self.fTrimStr(ui.$txt_pwd.val());
      var unameReg = /^[A-Za-z0-9_]{5,16}$/;
      var pwdReg = /^.{6,30}$/;

      if(accountCont == '') {
        setTimeout(function() {
          ui.$txt_account.focus();
        }, 1000);
        api.toast({msg: '请输入账号！', duration: 1000, location: 'middle'});
        return;
      }
      if(pwdCont == '') {
        setTimeout(function() {
          ui.$txt_pwd.focus();
        }, 1000);
        api.toast({msg: '请输入密码！', duration: 1000, location: 'middle'});
        return;
      }

      if (!unameReg.test(accountCont)) {
        setTimeout(function() {
          ui.$txt_account.focus();
        }, 1000);
        api.toast({msg: '账号格式不对！', duration: 1000, location: 'middle'});
        return;
      }

      if (!pwdReg.test(pwdCont)) {
        setTimeout(function() {
          ui.$txt_pwd.focus();
        }, 1000);
        api.toast({msg: '密码格式不对！', duration: 1000, location: 'middle'});
        return;
      }

      api.showProgress({
        style: 'default',
        animationType: 'fade',
        title: '正在登陆中...',
        text: '先喝杯茶...',
        modal: false
      });
      api.ajax({
        url : URLConfig('login'),
        method : 'post',
        dataType : 'json',
        data: {
          values: {'account' : accountCont, 'password' : pwdCont}
        }
      }, function(ret, err) {
        api.hideProgress();
        if(ret) {
          if(ret.code == 0) {
            var key = 'user';
            var user = ret["data"];
            $api.setStorage(key, user);
            $api.setStorage('password', pwdCont);
            // if(api.pageParam) {
              // api.execScript({
              //   name: 'home',
              //   script: 'fInitInfo();'
              // });
            // }
            // if(api.pageParam) {
            //   api.execScript({
            //     name: api.pageParam.name,
            //     script: 'fInitInfo();'
            //   });
            // }
            if(yp.query('isRoom')) {
              var userParam = {
                'userName' : user['nickname'],
                'userAvatar' : user['avatar'],
                'token' : user['token']
              }
              $api.setStorage('userParam',userParam);
              api.execScript({
                name : 'rooms',
                script : 'loginBackScript();'
              });
           }
            api.closeWin({
              name: 'register',
              animation: {
                type: 'none'
              }
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


  
