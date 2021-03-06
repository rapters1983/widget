/*
  2014.10.15
  登陆
  魏露霞
  未完成：qq登陆
 */
apiready = function(){
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


  var zhanqi = api.require('zhanqiMD');

  var oPage = {
    init : function() {      
      this.view();
      this.listen();


      // api.ajax({
      //   url: URLConfig('logout'),
      //   method: 'post',
      //   headers: {
      //     'User-Agent': 'Zhanqi.tv Api Client'
      //   },
      //   dataType: 'json'
      // }, function(ret, err){
      // });

    },
    view : function() {
      //初始化内容高度
      if(api.systemType === 'ios') {
        $('#conWrap, .landing').height(api.winHeight*window.devicePixelRatio - $('.top-bar').height()) ;
      }else{
        $('#conWrap, .landing').height(api.winHeight - $('.top-bar').height());
      }

      if(yp.query('isRoom')) {
        ui.$btn_reg.addClass('hidden');
      }

      var account = $api.getStorage('account');

      if(account) {
        ui.$txt_account.val(account);
      }

    },
    listen : function()　{
      var self = this;
      // qq登陆
      ui.$btn_qq.on('click', function() {
        var iaf = api.require('qq');
        iaf.login(function(ret,err){
          if(ret.status) {
            yp.ajax({
              url: URLConfig('qqLoginUrl')
            , method: 'post'
            , dataType: 'json'
            , data: {
                values: {
                  openId: ret.openId
                , accessToken: ret.accessToken
                }
              }
            }, function(ret, error) {
              if(ret) {
                if(ret.code == 0) {
                  self.fLoginCallback(ret['data']);
                  $api.setStorage('qq','ok');
                } else{
                  api.alert({msg: ret.message});
                  $api.setStorage('qq','not');
                }
              } else {
                api.alert({msg: '网络似乎出现了异常'});
                $api.setStorage('qq','not');
              }
            });
          } else{
            api.alert({msg: 'qq登陆失败!'});
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

        if(yp.query('isRoom')) {
          zhanqi.onBackToLiveScene({});
        }

        api.closeWin({
          name:'register',
          animation: {
            type: 'none',
            subType: 'from_top',
            duration: 0
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
      yp.ajax({
        url : URLConfig('login')
      , method : 'post'
      , dataType : 'json'
      , headers: {
         'User-Agent': 'Zhanqi.tv Api Client'
        }
      , data: {
          values: {'account' : accountCont, 'password' : pwdCont}
        }
      }, function(ret, error) {
        if(ret) {
          if(ret.code == 0) {
            self.fLoginCallback(ret['data'], pwdCont);
          } else{
            api.alert({msg: ret.message});
          }
        } else {
          api.alert({msg: '网络似乎出现了异常'});
        }
      });
    },
    // 登陆回调
    fLoginCallback: function(data, pwdCont) {
      var self = this;
      var user = data;

      if(!!user) {
        $api.setStorage('user', user);
        $api.setStorage('account', user['account']);
      }
      if(!!pwdCont) {
        $api.setStorage('password', pwdCont);
      }
      // if(yp.query('isRoom')) {
        var userParam = {
          'userName' : user['account'],
          'userAvatar' : user['avatar'],
          'token' : user['token']
        }
        // $api.setStorage('userParam',userParam);
        // api.execScript({
        //   name : 'rooms',
        //   script : 'loginBackScript();'
        // });

        // var data = $api.getStorage('userParam');
        // $('#chatList').find('ul').html('');
        zhanqi.onLoginSuccess(userParam);

        zhanqi.onBackToLiveScene({});
      // }else{
      //   zhanqi.onLoginSuccessWithoutRoom({
      //     'userName' : user['account'],
      //     'token' : user['token'],
      //     'userAvatar' : user['avatar']
      //   });
      // }
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
    }
  }
  oPage.init();
}


  
