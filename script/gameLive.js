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
        self.loadData();
      });
      self.loadData();

    },
    listen : function() {
   		var self = this;
      $(window).scroll(function(){
        // 当滚动到最底部以上200像素时， 加载新内容
        if ($(document).height() - $(this).scrollTop() - $(this).height()<200){
          if(self.ajaxing == 1){
            return;
          }
          self.loadData();
        }
      });

      //进入直播间
      $('#wrap').on('click', 'li[name=enterRooms]', function() {
        var roomid = this.id
        , which = $(this).attr('which')
        , fansTitle = $(this).attr('fansTitle')
        api.openWin({
            name:'rooms'
          , url:'rooms.html?id=' + roomid + '&which=' + which + '&fansTitle=' + fansTitle
          // , pageParam: {id: roomid, which : which, fansTitle : fansTitle}
          , delay:300
          , bgColor:'#FFF'
        });
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
			  	ui.$liveList.empty();  //第一页加载时先清空
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
      $.ajax({
        url : url,
        method : 'get',
        dataType : 'json',
        success: function(ret) {
          clearTimeout(timer);
          timer = null;
          api.hideProgress();
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
        }
      });
      api.refreshHeaderLoadDone();

    },

    renderLiveData : function(data) {
      var width = api.winWidth;
      var htmlStr = '';
      for(var i=0; i<data.length; i++) {
        var which = data[i]['flashvars']? data[i]['flashvars']['VideoType'] : 'VIDEO';
        var fansTitle = data[i]['fansTitle'];
        var online = data[i]['online']>10000? Math.round(data[i]['online']/1000)/10+'万' : data[i]['online'];
        htmlStr += '<li id="'+data[i]['id']+'" name="enterRooms" which="'+which+'" fansTitle="'+fansTitle+'">'
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
