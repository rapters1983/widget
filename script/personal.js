/*
  2014.10.15
  渲染数据、修改头像
  魏露霞
  未完成：
  头像上传
 */
apiready = function(){

  // 页面显示时触发
  // api.addEventListener({name:'viewappear'}, function(ret, err){
  //   fInitInfo();
  // });
  // 页面消失时触发
  // api.addEventListener({name:'viewdisappear'}, function(ret, err){
  //   fInitInfo();
  // });
  
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
            var base64 = new Base64();
            var encodeBase64 = base64.encode(ret.base64Data);
            $.ajax({
              url: URLConfig('avatar')
            , type: 'post'
            , dataType: 'html'
            , timeout: 10000
            , data: {
                'img_160_160': encodeBase64,
                'img_160_100': encodeBase64,
                'img_60_60': encodeBase64,
                'img_30_30': encodeBase64
              }
            , beforeSend: function( xhr ) {
            }
            , success: function(e) {
                api.alert({msg: e});
                api.alert({msg: 'ok'});
            }
            , error: function(e) {
                api.alert({msg: 'error'});
              }
            });
            // api.showProgress({
            //   style: 'default',
            //   animationType: 'fade',
            //   title: '正在上传中...',
            //   text: '先喝杯茶...',
            //   modal: false
            // });
            // api.ajax({
            //   url: URLConfig('avatar'),
            //   method: 'post',
            //   dataType: 'json',
            //   data: {
            //     values: {
            //       'img_160_160': encodeBase64,
            //       'img_160_100': encodeBase64,
            //       'img_60_60': encodeBase64,
            //       'img_30_30': encodeBase64
            //     }
            //   }
            // }, function(ret, err){
            //   api.alert({msg: 'pic'});
              // api.hideProgress();
              // var urlJson = JSON.stringify(ret);
              // api.alert({msg: urlJson});
              // api.alert({msg: ret.code});
              // if(ret) {
              //   if(ret.code == 0) {
              //     api.alert({msg: ret.message});
              //   } else{
              //     api.alert({msg: ret.message});
              //   }
              // } else{
              //   api.alert({
              //     msg:('错误码：'+err.code+'；错误信息：'+err.msg+'网络状态码：'+err.statusCode)
              //   });
              // }
            // });
          } else{
            api.alert({msg:err.msg});
          };
        });
      });

      // 昵称
      $('#personal-nickname').on('click', function() {
        api.openWin({
          name:'editNickname',
          url:'editNickname.html',
          delay:100,
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
          delay:100,
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
            delay:100,
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
            // api.execScript({
            //   name: 'home',
            //   script: 'fInitInfo();'
            // });
            api.closeWin({delay:100});
          } else{
            api.alert({msg: ret.message});
          }
        } else{
          api.alert({
            msg:('错误码：'+err.code+'；错误信息：'+err.msg+'网络状态码：'+err.statusCode)
          });
        }
      });
    }
  }
  oPage.init();
}

function fInitInfo() {
  var user = $api.getStorage('user');
  if(user) {
    $('#personal-photo img').attr('src', user.avatar + '-small');
    $('#personal-nickname span').text(user.nickname);
    var gender = '';
    if(user.gender == '2') {
      gender = '女';
    } else if(user.gender == '1') {
      gender = '男';
    }
    $('#personal-gender span').text(gender);
    if(user.mobile.length) {
      $('#personal-phone').data('isClick', false).html(user.mobile);
    } else{
      $('#personal-phone').data('isClick', true).html('<span>未绑定</span><i class="icon-m icon-right"></i>');
    }
  }
}

  
