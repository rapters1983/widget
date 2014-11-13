/* =============================================
 * v20141026
 * =============================================
 * Copyright shihua
 *
 * 首页
 * ============================================= */
apiready = function() {

  var ui = {
    $lolList : $('#lolList')
  , $dota2List : $('#dota2List')
  , $sgsList : $('#sgsList')
  , $otherList : $('#otherList')
  }
    

  var oPage = {
    init : function() {
      this.view();
      this.listen();
    },
    refresh: 0,
    failCount: 0,
    view : function() {
      var self = this;
      api.setRefreshHeaderInfo({
        visible: true,
        loadingImgae: 'widget://image/refresh-white.png',
        bgColor: '#ccc',                                
        textColor: '#fff',
        textDown: '下拉可以刷新',
        textUp: '松开即可刷新',
        showTime: false
      }, function(ret, err){
        self.refresh = 1;
        self.failCount = 0,
        self.loadData();
      });

      self.loadData();

      //初始化
      var width = api.winWidth;
      if( window.devicePixelRatio == 2 && window.navigator.appVersion.match(/iphone/gi)) {
        $('.hd').height(width*9/16*window.devicePixelRatio);
        $('.hd').find('.show-pic').height(width*9/16*window.devicePixelRatio);
      }else{
        $('.hd').height(parseInt(width*9/16));       
        $('.hd').find('.show-pic').height(width*9/16);
      }

    },
    listen : function() {
      var self = this;
      api.addEventListener({
          name: 'online'
      }, function(ret, err){
          self.refresh = 1;
          self.loadData();
      });

      api.addEventListener({
          name: 'offline'
      }, function(ret, err){
          api.alert({msg: '网络似乎出现了异常!'});
      });


      //进入更多
      $('.js-toGameLive').on('click', function(e) {
        e.stopPropagation();
        var id = +$(this).attr('id');
        if(id == 0){
          $api.setStorage('gameId', id);
          api.execScript({
            name: 'root',
            script: 'openLiveList();'
          });
        }else{
          $api.setStorage('gameId', id);
          api.execScript({
            name: 'root',
            script: 'openGameLive();'
          });
        }
      });

      //进入直播间
      $('#wrap').on('click', 'li[name=enterRooms]', function() {
        var roomid = this.id
        api.openWin({
            name:'rooms'
          ,'slidBackEnabled' : false
          , url:'rooms.html?id=' + roomid
          // , pageParam: {id: roomid, which : which, fansTitle : fansTitle}
          , bgColor:'#FFF'
        });
      });
      // .on('touchstart', 'li[name=enterRooms]', function() {
      //   $(this).addClass('active');
      // }).on('touchend', 'li[name=enterRooms]', function() {
      //   $(this).removeClass('active');
      // });


    },
    overTime: function(){
      var self = this;
      if(self.failCount == 1){
        api.refreshHeaderLoadDone();
        api.hideProgress();
        api.toast({
          msg: '网络连接失败',
          duration:2000,
          location: 'top'
        });
        return;
      }
    },

    loadData : function() {
      var self = this;
      // api.connectionType wifi  none
      //slider
      self.getDataIndex(URLConfig('bannerIndex', {
        'id' : +new Date()
      }), function(data) {
        if(data['data'] instanceof Array && data['data'].length < 1 || $.isEmptyObject(data['data'])) return;
        self.renderSlider(data['data']);
      },'bannerIndex');
      //6条热门直播 加载完毕后
      self.getDataIndex(URLConfig('liveIndex'), function(data) {
        self.renderLiveData(data['lives']);
      },'liveIndex');
      //英雄联盟
      self.getDataIndex(URLConfig('gameLiveIndex', {
        'id' : 6
      , 'num' : 4
      , 'page' : 1
      }), function(data) {
        self.renderGameLiveData(data['data']['rooms'], ui.$lolList);
      },'gameLiveIndex');
      //dota2
      self.getDataIndex(URLConfig('gameLiveIndex', {
        'id' : 10
      , 'num' : 4
      , 'page' : 1
      }), function(data) {
        self.renderGameLiveData(data['data']['rooms'], ui.$dota2List);
      },'gameLiveIndex');
      //三国杀
      self.getDataIndex(URLConfig('gameLiveIndex', {
        'id' : 13
      , 'num' : 4
      , 'page' : 1
      }), function(data) {
        self.renderGameLiveData(data['data']['rooms'], ui.$sgsList);
      },'gameLiveIndex');
      //其它
      self.getDataIndex(URLConfig('otherLiveIndex'), function(data) {
        $('body').append(data['data']['rooms']);
        self.renderGameLiveData(data['data']['rooms'], ui.$otherList);
        api.hideProgress();
        api.refreshHeaderLoadDone();
        // if(self.refresh == 1){
        //   api.toast({
        //     msg: '刷新完成',
        //     duration:2000,
        //     location: 'top'
        //   });
        // }
      },'otherLiveIndex');

      //惰性加载
      $('img.lazy').lazyload({
        threshold : 100
      , placeholder : '../image/default_bpic.png'
      });

    },

    getDataIndex : function(url,callback,which) {
      var self = this;

      if(api.connectionType === 'none') {
        var data = $api.getStorage(which);
        if(data) {
          callback(data);
        }
        return;
      }
      $.ajax({
        url : url,
        type : 'get',
        dataType : 'json',
        // async : false,
        headers: {
         'User-Agent': 'Zhanqi.tv Api Client'
        },
        success : function(ret) {
          if(ret) {
            if(ret['code'] == 0) {
              $api.setStorage(which,ret);   //更新缓存
              callback(ret);
            } else {
              api.alert({msg : ret['message']});
            }
          } else{
            self.failCount++;
            self.overTime();
          }
        }
      });
    },
    //游戏的四个直播
    renderGameLiveData : function(data, $dom) {
      $dom.find('li').each(function(){
        $self = $(this);
        var i = $self.index();

        $self.attr({
           'id' : data[i]['id']
          ,'name' : 'enterRooms'
          ,'tapmode' : 'active'
        });
        var online = data[i]['online']>10000? Math.round(data[i]['online']/1000)/10+'万' : data[i]['online'];
        var gender = data[i]['gender']==2? 'icon-boy' : 'icon-girl';
        $self.find('.anchor').find('i').removeClass('icon-boy icon-girl').addClass(gender);
        $self.find('.til').empty().text(data[i]['title']);
        $self.find('.js-online').empty().text(online);
        $self.find('.js-nickname').empty().text(data[i]['nickname']);



        var bpic = data[i]['bpic'];
        
        var cachePath = bpic.substring(bpic.lastIndexOf('/') + 1);
        var cacheSpic = $api.getStorage(cachePath);
        
        if(api.connectionType === 'none' && cacheSpic) {
          bpic = cacheSpic;
        }
        $self.find('img').attr('data-original', bpic);

        //缓存&&更新图片
        cachePic(bpic, cachePath);

      })
    },
    //热门直播
    renderLiveData : function(data) {
      $('#indexLiveList>li').each(function(){
        $self = $(this);
        var i = $self.index();
        $self.attr({
           'id' : data[i]['id']
          ,'name' : 'enterRooms'
          ,'tapmode' : 'active'
        });
        var online = data[i]['online']>10000? Math.round(data[i]['online']/1000)/10+'万' : data[i]['online'];
        var gender = data[i]['gender']==2? 'icon-boy' : 'icon-girl';
        $self.find('.anchor').find('i').removeClass('icon-boy icon-girl').addClass(gender);
        $self.find('.til').empty().text(data[i]['title']);
        $self.find('.js-online').empty().text(online);
        $self.find('.js-nickname').empty().text(data[i]['nickname']);

        var bpic = data[i]['bpic'];

        var cachePath = bpic.substring(bpic.lastIndexOf('/') + 1);
        var cacheSpic = $api.getStorage(cachePath);

        if(api.connectionType === 'none' && cacheSpic) {
          bpic = cacheSpic;
        }
        $self.find('img').attr('src', bpic);

        //缓存&&更新图片
        cachePic(bpic, cachePath);

      });
    },
    //渲染首页swipe插件
    renderSlider : function(data) {
      var self = this;
      if(window.isSlided){
        window.mySwipe.kill();
      }
      var htmlStr = '';
      //初始化
      var width = api.winWidth;
      if( window.devicePixelRatio == 2 && window.navigator.appVersion.match(/iphone/gi)) {
        $('.hd').height(width*9/16*window.devicePixelRatio);
      }else{
        $('.hd').height(parseInt(width*9/16));       
      }
      for(var i=0; i<data.length; i++) {
        var id = data[i]['roomId'];
        var spic = data[i]['spic'];
        var title = data[i]['title'];
        if(data[i]['roomId'] != data[i]['room']['id']){
          id = data[i]['room']['id'];
          spic = data[i]['room']['bpic'];
          title = data[i]['room']['title'];
        }

        
        var cachePath = spic.substring(spic.lastIndexOf('/') + 1);
        var cacheSpic = $api.getStorage(cachePath);

        if(api.connectionType === 'none' && cacheSpic) {
          spic = cacheSpic;
        }

        htmlStr += '<li name="enterRooms" tapmode="active" id="'+ id +'">'
        if( window.devicePixelRatio == 2 && window.navigator.appVersion.match(/iphone/gi)) {
          
          htmlStr += '<img cachePath="'+cachePath+'" src="'+ spic +'" style="height:'+width*9/16*window.devicePixelRatio+'px" class="show-pic" />'
        }else{
          htmlStr += '<img src="'+ spic +'" style="height:'+width*9/16+'px" class="show-pic" />'
        }
          htmlStr +=  '<p class="title">'+ title +'</p>'
                  +  '</li>';

        //缓存&&更新图片
        cachePic(spic, cachePath);

      }
      var pointerStr = '<span class="dot active"></span>';
      for(var i=1; i<data.length; i++) {
        pointerStr += '<span class="dot"></span>';
      }
      $('#dotBox').empty().html(pointerStr);
      $('#banner-content').empty().html(htmlStr);



      var slide = $api.byId('slider');
      window.mySwipe = Swipe(slide, {
        // startSlide: 2,
        // speed: 400,
        auto: 3000,
        continuous: true,
        disableScroll: false,
        stopPropagation: true,
        callback: function(index, elem) {
          var num = $('#dotBox span').length -1;
          if(num < index){
            index = index - 2;
            $('#dotBox span.active').removeClass('active');
            $('#dotBox span:eq('+index+')').addClass('active');
          }else{
            $('#dotBox span.active').removeClass('active');
            $('#dotBox span:eq('+index+')').addClass('active');
          }
        },
        transitionEnd: function(index, elem) {}
      });
      window.isSlided = true;
    }

  }
  oPage.init();

}
