/*
  2014.10.15
  渲染数据、修改头像
  魏露霞
 */
apiready = function(){  
  var ui = {
    $btn_quit: $('#btn-quit')
  , $btn_close: $('#btn-close')
  };

  var oPage = {
    init : function() {
      this.view();
      this.listen();
    },
    view : function() {
      //初始化内容高度
      if(api.systemType === 'ios') {
        $('#conWrap, .personal-center').height(api.winHeight*window.devicePixelRatio - $('.top-bar').height());
      }else{
        $('#conWrap, .personal-center').height(api.winHeight - $('.top-bar').height());
      }
      
      // 渲染数据
      fInitInfo();
    },
    listen : function()　{
      var self = this;
      // 关闭
      ui.$btn_close.on('click', function() {
        api.closeWin();
      });

      // 相册
      $('#personal-photo').on('click', function() {
        api.getPicture({
          sourceType: 'library',
          encodingType: 'png',
          mediaValue: 'pic',
          destinationType: 'base64',
          allowEdit: true,
          quality: 50,
          targetWidth:100,
          targetHeight:100,
          saveToPhotoAlbum: false
        }, function(ret, err){ 
          if (ret) {
            var encodeBase64 = ret.base64Data.replace('data:image/png;base64,','');
            $.ajax({
               url: URLConfig('avatar')
            , type: 'post'
            , data: {
                'img_160_160': encodeBase64,
                'img_160_100': encodeBase64,
                'img_60_60': encodeBase64,
                'img_30_30': encodeBase64
              }
            , beforeSend: function( xhr ) {
            }
            , success: function(ret) {
                var redata = ret.substring(2,ret.length);
                var data = eval('('+redata+')')
                $('#avatar').attr('src',data[0]);
                var user = $api.getStorage('user');
                if(user) {
                  var avatar = data[0].replace('-normal', '');
                  user.avatar = avatar;
                };
                $api.setStorage('user', user);
            }
            , error: function(e) {
                api.alert({msg: e});
              }
            });
          }
        });
      });

      // 昵称
      $('#personal-nickname').on('click', function() {
        api.openWin({
          name:'editNickname',
          url:'editNickname.html',
          delay:0,
          bgColor:'#FFF',
          animation: {
            type: 'movein',
            subType: 'from_bottom',
            duration: 300
          }
        });
      });

      // 性别
      $('#personal-gender').on('click', function() {
        api.openWin({
          name:'editSex',
          url:'editSex.html',
          delay:0,
          bgColor:'#FFF',
          animation: {
            type: 'movein',
            subType: 'from_bottom',
            duration: 300
          }
        });
      });

      // 手机号码
      $('#personal-phone').on('click', function() {
        if(!!$(this).data('isClick')){
          api.openWin({
            name:'editPhone',
            url:'editPhone.html',
            delay:0,
            bgColor:'#FFF',
            animation: {
              type: 'movein',
              subType: 'from_bottom',
              duration: 300
            }
          });
        }
      });

      // 退出
      ui.$btn_quit.on('click', function() {
        self.fLogoutAjax();
      });
    }
    // 退出
  , fLogoutAjax: function() {
      api.showProgress({
        style: 'default',
        animationType: 'fade',
        title: '正在退出中...',
        text: '先喝杯茶...',
        modal: false
      });
      api.ajax({
        url: URLConfig('logout'),
        method: 'post',
        dataType: 'json'
      }, function(ret, err){
        api.hideProgress();
        if(ret) {
          if(ret.code == 0) {
            var key = 'user';
            var user = {};
            $api.setStorage(key, user);
            api.closeWin({delay:0});
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
    $('#personal-photo img').attr('src', user.avatar + '-normal');
    $('#personal-nickname .js-txt').text(user.nickname);
    var gender = '';
    if(user.gender == '2') {
      gender = '女';
    } else if(user.gender == '1') {
      gender = '男';
    }
    $('#personal-gender .js-txt').text(gender);
    if(user.mobile.length) {
      $('#personal-phone').data('isClick', false).find('.js-txt').html(user.mobile);
    } else{
      $('#personal-phone').data('isClick', true).find('.js-txt').html('<span>未绑定</span><i class="icon-m icon-right"></i>');
    }
  }
}

  
