/* =============================================
 * v20141026
 * =============================================
 * Copyright shihua
 *
 * 游戏列表
 * ============================================= */
apiready = function() {

  var ui = {
  	$gameList: $('#gameList')
  }

	var oPage = {
		init : function() {
      this.view();
      this.listen();
		},
		pageNow : 1,
		ajaxing : 0,
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
        self.ajaxing = 0;
        self.pageNow = 1;
        self.refresh = 1;
        self.failCount = 0;
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
          self.refresh = 0;
		    	self.loadData();
		    }
			});
      ui.$gameList.on('click', 'li',function() {
        var id = $(this).attr('id');
        $api.setStorage('gameId', id);
        api.execScript({
          name: 'root',
          script: 'openGameLive();'
        });
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
      if(self.ajaxing == 1){
      	return;
      }
      self.ajaxing = 1;
      self.getDataIndex(URLConfig('gameList', {
      	'num': 12
      , 'page': self.pageNow
      }), function(data) {
      	if(self.pageNow == 1){
          self.refleshGameList(data['games']);
          if(self.refresh == 1){
            api.toast({
              msg: '刷新完成',
              duration:2000,
              location: 'top'
            });
          }
			  }else{
          self.renderGameData(data['games']);
        }
        self.pageNow = self.pageNow +1;
        if(12 == data['games'].length){
        	self.ajaxing = 0;  												//返回不足12条则表示加载完毕
        }else{
          api.toast({
            msg: '已经加载完啦',
            duration:2000,
            location: 'top'
          })
        };
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
        headers: {
          'User-Agent': 'Zhanqi.tv Api Client'
        },
        timeout: 3000,
        success: function(ret) {
          clearTimeout(timer);
          timer = null;
          api.hideProgress();
          if(ret) {
            if(ret['code'] == 0) {
              callback(ret['data']);
            } else{
              api.toast({
                msg: '出错了，请重试！',
                duration:2000,
                location: 'top'
              });
            }
          } else{
            api.toast({
              msg: '数据异常，请重试！',
              duration:2000,
              location: 'top'
            });
          }
        },
        error: function() {
          clearTimeout(timer);
          timer = null;
          api.hideProgress();
          self.failCount++;
          self.overTime();
        }
      });
      api.refreshHeaderLoadDone();
      // yp.ajax({
      //   url : url,
      //   method : 'get',
      //   dataType : 'json'
      // }, function(ret, err) {
      //   if(ret) {
      //     if(ret['code'] == 0) {
      //       callback(ret['data']);
      //     } else{
      //       api.alert({msg : ret['message']});
      //     }
      //   } else{
      //     api.alert({
      //       msg:('错误码：'+err.code+'；错误信息：'+err.msg+'网络状态码：'+err.statusCode)
      //     });
      //   }
      // });
    },

    refleshGameList : function(data) {
      var width = api.winWidth;
      var htmlStr = '';
      var loadedNum = ui.$gameList.find('li').length
      var i = data.length;
      if(i < loadedNum){
        ui.$gameList.find('li').each(function(){
          $self = $(this);
          var idx = $self.index();
          if(idx < i){
            $self.find('.js-gamename').empty().text(data[idx]['name']);
            $self.find('img').attr('src', data[idx]['spic']);
          }else{
            $self.remove();
          }
        })
      }else{
        ui.$gameList.find('li').each(function(){
          $self = $(this);
          var idx = $self.index();
          $self.find('.js-gamename').empty().text(data[idx]['name']);
          $self.find('img').attr('src', data[idx]['spic']);
        })
        for(var i= loadedNum; i<data.length; i++) {
          htmlStr += '<li id="'+data[i]['id']+'">'
          + '<div class="game-a"><img src="'+ data[i]['spic'] +'" width="'+ width +'">'
          + '<span class="js-gamename">'+ data[i]['name'] + '</span><div></li>';
        }
        ui.$gameList.append(htmlStr);
      }
    },

    renderGameData : function(data) {
      var width = api.winWidth;
      var htmlStr = '';
      var loadedNum = ui.$gameList.find('li').length
      for(var i=0; i<data.length; i++) {
        htmlStr += '<li id="'+data[i]['id']+'">'
        + '<div class="game-a"><img src="'+ data[i]['spic'] +'" width="'+ width +'">'
        + '<span class="js-gamename">'+ data[i]['name'] + '</span><div></li>';
      }
      ui.$gameList.append(htmlStr);
    }

	}
	oPage.init();
}
