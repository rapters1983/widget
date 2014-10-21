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
        // alert(ret);
        self.loadData();
      });
      
      self.loadData();

		},
		listen : function() {
      //进入更多
      $('.js-toGameLive').on('click', function(e) {
        e.stopPropagation();
        var id = +$(this).attr('id');
        if(id == 0){
          $api.setStorage('gameId', id);
          api.execScript({
            name: 'root',
            script: 'openGameList();'
          });
        }else{
          $api.setStorage('gameId', id);
          api.execScript({
            name: 'root',
            script: 'openGameLive();'
          });
        }
      })

      //进入直播间
      $('#wrap').on('click', 'li[name=enterRooms]', function() {
        var roomid = this.id
        , which = $(this).attr('which')
        , fansTitle = $(this).attr('fansTitle')

        // alert(342432)
        // api.openFrame({
        //     name: 'test',
        //     url: './test.html',
        //     rect:{
        //         x:0,
        //         y:300,
        //         w:api.frameWidth,
        //         h:100
        //     },
        //     bounces: true,
        //     opaque: true,
        //     vScrollBarEnabled:true,
        //     hScrollBarEnabled:true
        // });

        // return;
        api.openWin({
            name:'rooms'
          ,'slidBackEnabled' : false            
          , url:'rooms.html?id=' + roomid + '&which=' + which + '&fansTitle=' + fansTitle
          // , pageParam: {id: roomid, which : which, fansTitle : fansTitle}
          , delay:300
          , bgColor:'#FFF'
        });

      });

      
		},
    
    loadData : function() {
      var self = this;
      //设置定时器
      var timer = null;
      var nDelay = 500;
      if (!timer) {
        timer = setTimeout(function(){
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
      self.getDataIndex(URLConfig('liveIndex'), function(data) {
      	self.renderSlider(data['lives']);
      });
      //6条热门直播 加载完毕后
      self.getDataIndex(URLConfig('liveIndex'), function(data) {
      	self.renderLiveData(data['lives']);
      	livedata = data['lives'];
      	idx = livedata.length -1;
      	var lastImg = new Image();
      	if(livedata.length>-1){
      		lastImg.src =  livedata[idx]['bpic'];
		      lastImg.onload = function ()
		      {
		        api.hideProgress();
		        api.refreshHeaderLoadDone();
		        clearTimeout(timer);
		        timer = null;
		      }
      	}else{
      		api.hideProgress();
      		api.refreshHeaderLoadDone();
      	}
	      
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
        api.toast({
          msg: '刷新完成',
          duration:2000,
          location: 'top'
        });
      });

      //惰性加载
      $('img.lazy').lazyload({
        threshold : 200
      , effect : 'fadeIn'
      , placeholder : '../image/default_pic.png'
      });


    },

    getDataIndex : function(url,callback) {
      $.ajax({
        url : url,
        type : 'get',
        dataType : 'json',
        success : function(data) {
          if(data) {
            if(data['code'] == 0) {
              callback(data);
            } else{
              api.alert({msg : data['message']});
            }
          } else{
            api.alert({
              msg:'网络似乎出现了异常'
            });
          }
        }
      });

    },
    //游戏的四个直播
    renderGameLiveData : function(data, $dom) {
      $dom.find('li').each(function(){
        $self = $(this);
        var i = $self.index()
        , which = data[i]['flashvars']? data[i]['flashvars']['VideoType'] : 'VIDEO'
        , fansTitle = data[i]['fansTitle'];

        $self.attr({
           'id' : data[i]['id']
          ,'which' : which
          ,'fansTitle' : fansTitle
          ,'name' : 'enterRooms'
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
        var i = $self.index()
        , which = data[i]['flashvars']? data[i]['flashvars']['VideoType'] : 'VIDEO'
        , fansTitle = data[i]['fansTitle'];

        $self.attr({
           'id' : data[i]['id']
          ,'which' : which
          ,'fansTitle' : fansTitle
          ,'name' : 'enterRooms'
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
      //已经启动时只修改地址
      if(window.isSlided){
        $('#banner-content>li').each(function(){
          $self = $(this);
          var i = $self.index()
          , which = data[i]['flashvars']? data[i]['flashvars']['VideoType'] : 'VIDEO'
        	, fansTitle = data[i]['fansTitle'];
        	$self.attr({
	           'id' : data[i]['id']
	          ,'which' : which
	          ,'fansTitle' : fansTitle
	          ,'name' : 'enterRooms'
	        });
          $self.find('.title').empty().text(data[i]['title']);
          $self.find('img').attr('src', data[i]['bpic']);
        })
        return;
      }
      var width = api.winWidth;
      var htmlStr = '';
      for(var i=0; i<data.length; i++) {
        htmlStr += '<li name="enterLive" id="'+data[i]['id']+'">'
                +  '<img src="'+data[i]['bpic']+'" class="show-pic" />'
                +  '<p class="title">'+data[i]['title']+'</p>'
                +  '</li>';
      }
      var pointerStr = '<span class="dot active"></span>';
      for(var i=1; i<data.length; i++) {
        pointerStr += '<span class="dot"></span>';
      }

      $('#dotBox').empty().html(pointerStr);
      $('#banner-content').empty().html(htmlStr);
      $('#banner-content>li').each(function(){
        $self = $(this);
        var i = $self.index()
        , which = data[i]['flashvars']? data[i]['flashvars']['VideoType'] : 'VIDEO'
      	, fansTitle = data[i]['fansTitle'];
      	$self.attr({
           'id' : data[i]['id']
          ,'which' : which
          ,'fansTitle' : fansTitle
          ,'name' : 'enterRooms'
        });
      })
      var slide = $api.byId('slider');
      window.mySwipe = Swipe(slide, {
        // startSlide: 2,
        // speed: 400,
        auto: 3000,
        continuous: true,
        disableScroll: false,
        stopPropagation: false,
        callback: function(index, elem) {
          $('#dotBox span.active').removeClass('active');
          $('#dotBox span:eq('+index+')').addClass('active');
        },
        transitionEnd: function(index, elem) {}
      });
      window.isSlided = true;
    }

	}
	oPage.init();

}
