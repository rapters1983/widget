/* =============================================
 * v20141026
 * =============================================
 * Copyright shihua
 *
 * 首页
 * ============================================= */
apiready = function() {

  function napster() {
    $('body').css('background','blue')
  }

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
      }).on('touchstart', 'li[name=enterRooms]', function() {
        $(this).addClass('active');
      }).on('touchend', 'li[name=enterRooms]', function() {
        $(this).removeClass('active');
      });


    },
    overTime: function(){
      var self = this;
      if(self.failCount == 1){
        clearTimeout(window.timer);
        window.timer = null;
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
      //设置定时器
      window.timer = null;
      window.nDelay = 500;
      if (!window.timer) {
        window.timer = setTimeout(function(){
          api.showProgress({
            style: 'default',
            animationType: 'fade',
            title: '努力加载中...',
            text: '先喝杯茶...',
            modal: false
          });
        }, nDelay);
      }

      //slider
      self.getDataIndex(URLConfig('bannerIndex', {
        'id' : +new Date()
      }), function(data) {
        if(data['data'] instanceof Array && data['data'].length < 1 || $.isEmptyObject(data['data'])) return;
        self.renderSlider(data['data']);
      });
      //6条热门直播 加载完毕后
      self.getDataIndex(URLConfig('liveIndex'), function(data) {
        self.renderLiveData(data['lives']);
      });
      //英雄联盟
      self.getDataIndex(URLConfig('gameLiveIndex', {
        'id' : 6
      , 'num' : 4
      , 'page' : 1
      }), function(data) {
        self.renderGameLiveData(data['data']['rooms'], ui.$lolList);
      });
      //dota2
      self.getDataIndex(URLConfig('gameLiveIndex', {
        'id' : 10
      , 'num' : 4
      , 'page' : 1
      }), function(data) {
        self.renderGameLiveData(data['data']['rooms'], ui.$dota2List);
      });
      //三国杀
      self.getDataIndex(URLConfig('gameLiveIndex', {
        'id' : 13
      , 'num' : 4
      , 'page' : 1
      }), function(data) {
        self.renderGameLiveData(data['data']['rooms'], ui.$sgsList);
      });
      //其它
      self.getDataIndex(URLConfig('otherLiveIndex'), function(data) {
        $('body').append(data['data']['rooms']);
        self.renderGameLiveData(data['data']['rooms'], ui.$otherList);
        api.hideProgress();
        api.refreshHeaderLoadDone();
        clearTimeout(window.timer);
        window.timer = null;
        if(self.refresh == 1){
          api.toast({
            msg: '刷新完成',
            duration:2000,
            location: 'top'
          });
        }
      });

      //惰性加载
      $('img.lazy').lazyload({
        threshold : 100
      , placeholder : '../image/default_bpic.png'
      });

    },

    getDataIndex : function(url,callback) {
      var self = this;
      $.ajax({
        url : url,
        type : 'get',
        dataType : 'json',
        timeout : 2000,
        success : function(data) {
          if(data) {
            if(data['code'] == 0) {
              callback(data);
            } else{
              api.toast({
                msg: '出错了，请重试！',
                duration: 2000,
                location: 'top'
              });
            }
          } else{
            api.toast({
              msg: '数据异常，请重试！',
              duration: 2000,
              location: 'top'
            });
          }
        },
        error: function(err) {
          self.failCount++;
          self.overTime();
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
        $self.find('.til').empty().text(data[i]['title']);
        $self.find('.js-online').empty().text(online);
        $self.find('.js-nickname').empty().text(data[i]['nickname']);
        $self.find('img').attr('data-original', data[i]['bpic']);
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
        $self.find('.til').empty().text(data[i]['title']);
        $self.find('.js-online').empty().text(online);
        $self.find('.js-nickname').empty().text(data[i]['nickname']);
        $self.find('img').attr('src', data[i]['bpic']);
      })
    },
    //渲染首页swipe插件
    renderSlider : function(data) {
      var self = this;
      if(window.isSlided){
        window.mySwipe.kill();
      }
      //初始化
      var width = api.winWidth;
      var htmlStr = '';
      for(var i=0; i<data.length; i++) {
        var id = data[i]['roomId'];
        var spic = data[i]['spic'];
        var title = data[i]['title'];
        if(data[i]['roomId'] != data[i]['room']['id']){
          id = data[i]['room']['id'];
          spic = data[i]['room']['bpic'];
          title = data[i]['room']['title'];
        }
        htmlStr += '<li name="enterRooms" tapmode="active" id="'+ id +'">'
                +  '<img src="'+ spic +'" class="show-pic" />'
                +  '<p class="title">'+ title +'</p>'
                +  '</li>';
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
