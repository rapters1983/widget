apiready = function() {

  var ui = {
    $liveList: $('#liveList')
  }

	var oPage = {
		init : function() {
      this.view();
      this.listen();
		},
    pageNow : 1,
    ajaxing : 0,
    refresh: 0,

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
        self.ajaxing = 0;
        self.pageNow = 1;
        self.refresh = 1;
        self.loadData();
      });
      self.loadData();

    },
    listen : function() {
   		var self = this;
      $(window).scroll(function(){
        // 当滚动到最底部以上200像素时， 加载新内容
        if ($(document).height() - $(this).scrollTop() - $(this).height()< 150){
          if(self.ajaxing == 1){
            return;
          }
          api.toast({
            msg: '加载中',
            duration: 500,
            location: 'top'
          });
          self.refresh = 0;
          self.loadData();
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
          , delay:300
          , bgColor:'#FFF'
        });
      }).on('touchstart', 'li[name=enterRooms]', function() {
        $(this).addClass('active');
      }).on('touchend', 'li[name=enterRooms]', function() {
        $(this).removeClass('active');
      });
    },
    loadData : function() {
      var self = this;
      if(self.ajaxing == 1){
        return;
      }
      self.ajaxing = 1;
      var id = $api.getStorage('gameId') || 6;

      self.getDataIndex(URLConfig('gameLive', {
      	'id': id
      , 'num': 20
      , 'page': self.pageNow
      }), function(data) {
      	if(self.pageNow == 1){
			  	self.refleshLiveList(data['rooms']);
          if(self.refresh == 1){
            api.toast({
              msg: '刷新完成',
              duration:2000,
              location: 'top'
            });
          }
			  }
        self.renderLiveData(data['rooms']);
        self.pageNow = self.pageNow +1;
        if(20 == data['rooms'].length){
        	self.ajaxing = 0;  												//返回不足20条则表示加载完毕
        }
      });
    },

    getDataIndex : function(url,callback) {
      var self = this;
      // var timer = null;
      // var nDelay = 500;
      // if (!timer) {
      //   timer = setTimeout(function(){
      //     api.showProgress({
      //       style: 'default',
      //       animationType: 'fade',
      //       title: '努力加载中...',
      //       text: '先喝杯茶...',
      //       modal: false
      //     });
      //   }, nDelay);
      // }
      // $.ajax({
      //   url : url,
      //   method : 'get',
      //   dataType : 'json',
      //   success: function(ret) {
      //     clearTimeout(timer);
      //     timer = null;
      //     api.hideProgress();
      //     if(ret) {
      //       if(ret['code'] == 0) {
      //         callback(ret['data']);
      //       } else{
      //         api.alert({msg : ret['message']});
      //       }
      //     } else{
      //       api.alert({
      //         msg:('错误码：'+err.code+'；错误信息：'+err.msg+'网络状态码：'+err.statusCode)
      //       });
      //     }
      //   }
      // });
      // api.refreshHeaderLoadDone();
      yp.ajax({
        url : url,
        method : 'get',
        dataType : 'json'
      }, function(ret, err) {
        if(ret) {
          if(ret['code'] == 0) {
            callback(ret['data']);
          } else{
            api.alert({msg : ret['message']});
          }
        } else{
          api.alert({
            msg:('错误码：'+err.code+'；错误信息：'+err.msg+'网络状态码：'+err.statusCode)
          });
        }
      });
    },

    refleshLiveList : function(data) {
      var width = api.winWidth;
      var htmlStr = '';
      var loadedNum = ui.$liveList.find('li').length
      var i = data.length;


      if(i < loadedNum){
        ui.$liveList.find('li').each(function(k){
          $self = $(this);
          var idx = $self.index()
            , which = data[k]['flashvars']? data[k]['flashvars']['VideoType'] : 'VIDEO'
            , fansTitle = data[k]['fansTitle'];
          if(idx < i){
            var id = data[idx]['id'];
            var bpic = data[idx]['bpic'];
            var nickname = data[idx]['nickname'];
            var title = data[idx]['title'];
            var online = data[idx]['online']>10000? Math.round(data[idx]['online']/1000)/10+'万' : data[idx]['online'];
            $self.attr({
               'id' : id
              ,'name' : 'enterRooms'
            });
            $self.attr('which', which);
            $self.attr('fansTitle', fansTitle);
            $self.find('img').attr('src', bpic);
            $self.find('.til').empty().text(title);
            $self.find('.js-online').empty().text(online);
            $self.find('.js-nickname').empty().text(nickname);
          }else{
            $self.remove();
          }
        })

      }else{
        ui.$liveList.find('li').each(function(){
          $self = $(this);
          var idx = $self.index();
          var id = data[idx]['id'];
          var bpic = data[idx]['bpic'];
          var nickname = data[idx]['nickname'];
          var title = data[idx]['title'];
          var which = data[idx]['flashvars']? data[idx]['flashvars']['VideoType'] : 'VIDEO';
          var fansTitle = data[idx]['fansTitle'];
          var online = data[idx]['online']>10000? Math.round(data[idx]['online']/1000)/10+'万' : data[idx]['online'];
          $self.attr('id', id);
          $self.attr('which', which);
          $self.attr('fansTitle', fansTitle);
          $self.find('img').attr('src', bpic);
          $self.find('.til').empty().text(title);
          $self.find('.js-online').empty().text(online);
          $self.find('.js-nickname').empty().text(nickname);
        })
        for(var i= loadedNum; i<data.length; i++) {
          var online = data[i]['online']>10000? Math.round(data[i]['online']/1000)/10+'万' : data[i]['online'];
          htmlStr += '<li id="'+data[i]['id']+'" name="enterRooms" >'
          + '<img src="'+data[i]['bpic']+'" alt="" class="game-pic">'
          + '<div class="til">'+data[i]['title']+'</div>'
          + '<div class="detail clearfix">'
          + '<span class="audience"><i class="icon-m icon-spectator"></i>'
          + '<span class="js-online">'+online+'</span></span>'
          + '<p class="anchor"><i class="icon-m icon-boy"></i>'
          + '<span class="js-nickname">'+ data[i]['nickname'] +'</span></p></div></li>';
        }
        ui.$liveList.append(htmlStr);
      }
    },

    renderLiveData : function(data) {
      var width = api.winWidth;
      var htmlStr = '';
      for(var i=0; i<data.length; i++) {
        var online = data[i]['online']>10000? Math.round(data[i]['online']/1000)/10+'万' : data[i]['online'];
        htmlStr += '<li id="'+data[i]['id']+'" name="enterRooms">'
        + '<img src="'+data[i]['bpic']+'" alt="" class="game-pic">'
        + '<div class="til">'+data[i]['title']+'</div>'
        + '<div class="detail clearfix">'
        + '<span class="audience"><i class="icon-m icon-spectator"></i>'+online+'</span>'
        + '<p class="anchor"><i class="icon-m icon-boy"></i>'+data[i]['nickname']+'</p>'
        + '</div></li>';
      }
      ui.$liveList.append(htmlStr);
    }


	}
	oPage.init();
}
