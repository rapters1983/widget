  $(function() {
    var htmlStr = '';
    if( window.devicePixelRatio == 2 && window.navigator.appVersion.match(/iphone/gi)) {
      htmlStr = '<link rel="stylesheet" type="text/css" href="../script/lib/ratchet/ratchet.css">'
    }else{
      htmlStr = '<link rel="stylesheet" type="text/css" href="../script/lib/ratchet/ratchet-s.css">'
    }
    $('head').append(htmlStr)
  });



  apiready = function() {

    var zhanqi;

  try{
    var settings = $api.getStorage('settings') || {
        barrage : true //弹幕开关
       ,opacity : 1 //弹幕透明度
       ,size : 1 //弹幕大小
       ,pos : 1 //弹幕位置
       ,definition : 1 //清晰度选择
       ,lookBack : false //回看功能
       ,model : 0 //模式选择
    }
    zhanqi = api.require('zhanqiMD');

// onBackToLiveScene 进入直播页（参数{}）

  }catch(e) {
    
  }

    var oPage = {

      init : function() {
        this.view();
        this.listen();
      },

      view : function() {
        //初始化内容高度
        if(api.systemType === 'ios') {
          $('#conWrap, .settings').height(api.winHeight*window.devicePixelRatio - $('.top-bar').height());
        }else{
          $('#conWrap, .settings').height(api.winHeight - $('.top-bar').height());
        }

        try{
          this.setData(settings);
          if(yp.query('user')) {  //应用设置
            $('#pageName').text('应用设置');
            $('#titleName, #titleArea, #zhanqiSuport, #zhanqiSuportArea').removeClass('hidden');
            if(api.systemType == 'ios') {
              $('#evaluation').removeClass('hidden');
            } else {  //android 下禁止显示 关于我们 给我评价
              $('#aboutUs, #evaluation').addClass('hidden');
            }
          }
        }catch(e) { }
        
      },

      listen : function() {
        //关闭设置
        $('#closeSettting').on('click', function() {
           if(yp.query('isRoom')) {
            zhanqi.onBackToLiveScene({});
           }
           api.closeWin();
        });

        //弹幕开关
        $('#barrageSwitch').on('touchend', function() {
          $(this).data('barrage',!$(this).data('barrage'));
          settings['barrage'] = $(this).data('barrage');
        });

        //弹幕透明度
        $('.proportion-dot')[0].addEventListener('touchstart',  function(event) {
          event.preventDefault();
        });

        $('.proportion-dot')[0].addEventListener('touchmove',  function(event) {
          event.preventDefault();
          // alert('move' + $('.proportion-bg').width())
          // alert((event.targetTouches[0].pageX - $('.proportion-bg').offset().left)/$('.proportion-bg').width() * 100)
          // console.error('%'+(event.targetTouches[0].pageX - $('.proportion-bg').offset().left)/$('.proportion-bg').width() * 100)
          var rate = parseInt((event.targetTouches[0].pageX - $('.proportion-bg').offset().left)/$('.proportion-bg').width() * 100);
          if(rate < 1) rate = 0;
          $(this).css('left',rate + '%');
          $('.proportion-in').width(rate + '%');
          settings['opacity'] = rate/100;
        });

        $('.proportion-dot')[0].addEventListener('touchend',  function(event) {
          event.preventDefault();
          // alert('move')
        });

        // $('.proportion-dot').on('touchstart', function(event) {
        //   // alert('touchstart')
        //   // alert( event.targetTouches[0].pageX )
        //   // alert(event.targetTouches)
        //   alert(event.pageX)
        // }).on('touchmove',  function(event) {
        //   event.preventDefault();
        //   // alert(event.toString())
        //   // var touch = event.touches[0];
        //   // alert( touch.pageX )
        //   // alert('touchmove')
        // }).on('touchend', function() {
        //   // alert('touchend')
        // });
        

        //弹幕大小
        $('#size').on('click',  'a',  function() {
          if($('#size').find('a.active')[0])
            $('#size').find('a.active').removeClass('active');
          $(this).addClass('active');
          switch($(this).attr('name')) {
            case 'small':
              settings['size'] = 0;
              $('#preView').css('font-size','22px');  //字体预览
              break;
            case 'normal':
              settings['size'] = 1;
              $('#preView').css('font-size','26px');  //字体预览
              break
            case 'big':
              settings['size'] = 2;
              $('#preView').css('font-size','28px');  //字体预览
              break;
          }
        });


       //弹幕位置
        $('.location-screen').on('click', function() {
          var name = $(this).attr('name');
          if($('#pos').find('.active')[0])
            $('#pos').find('.active').removeClass('active');
          $(this).find('span').addClass('active');
          switch(name) {
            case 'full':
              settings['pos'] = 0;
              break;
            case 'up':
              settings['pos'] = 1;
              break;
            case 'down':
              settings['pos'] = 2;
              break;
          }
        });

        //清晰度选择
        $('#definition').on('click',  'li', function() {
          var name = $(this).attr('name');
          if($('#definition').find('.active')[0])
          $('#definition').find('.active').removeClass('icon-checked').addClass('icon-unchecked').removeClass('active');
          $('#definition').find('i.icon-m').removeClass('icon-checked').addClass('icon-unchecked');
          $(this).find('i').removeClass('icon-unchecked').addClass('icon-checked').addClass('active');
          switch(name) {
            case 'super':
              settings['definition'] = 0;
              break;
            case 'hd':
              settings['definition'] = 1;
              break;
            case 'sd':
              settings['definition'] = 2;
              break;
          }
        });

        //回看功能
        // $('#lookBackSwitch').on('touchend', function() {
        //   $(this).data('lookBack',!$(this).data('lookBack'));
        //   settings['lookBack'] = $(this).data('lookBack');
        // });

        //模式选择
        // $('#model').on('click',  'li', function() {
        //   var name = $(this).attr('name');
        //   if($('#model').find('i.active')[0])
        //     $('#model').find('i.active').removeClass('icon-checked').addClass('icon-unchecked').removeClass('active');
        //   $(this).find('i').removeClass('icon-unchecked').addClass('icon-checked').addClass('active');
        //   switch(name) {
        //     case 'video':
        //       settings['model'] = 0;
        //       break;
        //     case 'text':
        //       settings['model'] = 1;
        //       break;
        //   }
        // });

        //提交
        $('#subBtn').on('click',  function() {
          try{
            $api.setStorage('settings',settings);
        
            api.toast({
              msg: '设置成功',
              duration:2000,
              location: 'bottom'
            });
            
            settings['submit'] = true;
            zhanqi.onGetSettingDataFromWeb(settings);
            if(yp.query('isRoom')) {
              zhanqi.onBackToLiveScene({});
            }
            api.closeWin();
          }catch(e){
          }
        });

      },

      setData : function(settings) {
        
        //弹幕开关
        if(settings['barrage']) {   
          $('#barrageCon').html('<div class="toggle active" id="barrageSwitch"><div class="toggle-handle"></div> </div>');
        }else{
          $('#barrageCon').html('<div class="toggle" id="barrageSwitch"><div class="toggle-handle"></div> </div>');
        }
        $('#barrageSwitch').data('barrage', settings['barrage']);

        //弹幕透明度
        $('.proportion-dot').css('left',settings['opacity']*100 + '%')
        $('.proportion-in').width(settings['opacity']*100 + '%')

        //弹幕大小
        if($('#size').find('a.active')[0])
          $('#size').find('a.active').removeClass('active');
        switch(settings['size']) {
          case 0:  //小
            $('#size').find('a[name=small]').addClass('active');
            break;
          case 1: //中
            $('#size').find('a[name=normal]').addClass('active');
            break;
          case 2: //大
            $('#size').find('a[name=big]').addClass('active');
            break;
        }

        //弹幕位置
        if($('#pos').find('.active')[0])
          $('#pos').find('.active').removeClass('active');
        switch(settings['pos']) {
          case 0:  //全屏
            $('span[name=full]').addClass('active');
            break;
          case 1: //上方
            $('span[name=up]').addClass('active');
            break;
          case 2: //下方
            $('span[name=down]').addClass('active');
            break;
        }

        //清晰度选择
        if($('#definition').find('.active')[0])
          $('#definition').find('.active').removeClass('icon-checked').addClass('icon-unchecked').removeClass('active');
          $('#definition').find('i.icon-m').removeClass('icon-checked').addClass('icon-unchecked');
        switch(settings['definition']) {
          case 0:  //全屏
            $('i[name=super]').removeClass('icon-unchecked').addClass('icon-checked').addClass('active');
            break;
          case 1: //上方
            $('i[name=hd]').removeClass('icon-unchecked').addClass('icon-checked').addClass('active');
            break;
          case 2: //下方
            $('i[name=sd]').removeClass('icon-unchecked').addClass('icon-checked').addClass('active');
            break;
        }

        
        //回看功能
        if(settings['lookBack']) {
          $('#lookBackCon').html('<div class="toggle active" id="lookBackSwitch" lookBack='+settings['lookBack']+'><div class="toggle-handle"></div> </div>');
        }else{
          $('#lookBackCon').html('<div class="toggle" id="lookBackSwitch" lookBack='+settings['lookBack']+'><div class="toggle-handle"></div> </div>');
        }
        $('#lookBackSwitch').data('lookBack', settings['lookBack']);

        //模式选择
        if($('#model').find('i.active')[0])
          $('#model').find('i.active').removeClass('icon-checked').addClass('icon-unchecked').removeClass('active');
        switch(settings['model']) {
          case 0:
            $('#model').find('i[name=video]').removeClass('icon-unchecked').addClass('icon-checked').addClass('active');
            $('#model').find('i[name=text]').removeClass('icon-checked').addClass('icon-unchecked');
            break;
          case 1:
            $('#model').find('i[name=text]').removeClass('icon-unchecked').addClass('icon-checked').addClass('active');
            $('#model').find('i[name=video]').removeClass('icon-checked').addClass('icon-unchecked');
            break;
        }



      },

      getData : function() {

      }

    }

    oPage.init();


}

window.onGetSettingDataFromObj = function(data) {
  if(typeof data == 'string')
    data = eval('('+data+')');
  $api.setStorage('settings', data);
}

