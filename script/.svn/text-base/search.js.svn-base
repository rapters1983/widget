function closeSearch(){
  api.closeWin({
    name: 'search',
    delay: 100,
    bounces: false,
    animation: {
      type: 'none',
      subType: 'from_top',
      duration: 200
    }
  });
}
yp.ready(function() {
  var ui = {
    $keyword: $('#keyword')
  , $history: $('#history')
  , $historyList: $('#historyList')
  , $cleanHistory: $('#cleanHistory')
  , $result: $('#result')
  , $tab: $('#tab')
  , $liveList: $('#liveList')
  , $hostList: $('#hostList')
  , $noHistory: $('#noHistory')
  , $noTabResult: $('#noTabResult')
  };
  var oPage = {
    init: function() {
      this.view();
      this.listen();
    }
  , pageNow : [1, 1]
  , tabNow : 0
  , ajaxing : [0, 0]
  , searchType: ['live','anchor']
  , texting : null
  , tabResult: [-1, -1]
  , view: function() {
      var self = this;
      //初始化内容高度
      $('#conWrap, .search-page').height(api.winHeight*window.devicePixelRatio - $('.top-bar').height());
      self.renderSearchHistory();
    }
  , listen: function() {
      var self = this;
      //搜索
      ui.$keyword.on('input', function(){
        var keyword = $(this).val();
        if(keyword == ''){
          clearTimeout(self.texting);
          self.texting = null;
          return;
        }
        var waiting = self.texting;
        if(waiting){
          clearTimeout(self.texting);
          self.texting = null;
        }
        self.texting = setTimeout(function(){
          oPage.searching(keyword);
        }, 500);
      }).on('keyup', function(){
        var keyword = $(this).val();
        if(keyword.length == ''){
          ui.$result.addClass('hidden');
          self.renderSearchHistory();
        }
      })
      //点击历史记录
      ui.$historyList.on('click', '.js-history',function(){
        var $self = $(this);
        ui.$keyword.blur();
        var key = $self.find('.search-result').text();
        ui.$keyword.val(key);
        self.searching(key);
      }).on('click', '.js-delete',function(e){
        e.stopPropagation();
        var $self = $(this);
        var id = $self.attr('id')*1;
        var searchHistory = $api.getStorage('searchHistory') || [];
        if(searchHistory[id] != undefined){
          searchHistory.splice(id, 1);
        }
        $api.setStorage('searchHistory', searchHistory);
        $self.closest('.js-history').remove();
        self.renderSearchHistory();
      });
      //搜索时收起输入框
      ui.$result.on('click',function(){
        ui.$keyword.blur();
      });
      //清空搜索记录
      ui.$cleanHistory.on('click', function(){
        $api.setStorage('searchHistory', []);
        $('.js-history').remove();
        ui.$history.addClass('hidden');
        ui.$noHistory.removeClass('hidden');
      })
      //页签切换
      ui.$tab.on('click', 'li',function(){
        var $self = $(this);
        ui.$tab.find('li').removeClass('active');
        $self.addClass('active');
        var idx = $self.index();
        self.tabNow = idx;

        if(self.tabResult[idx] == 0){
          $('.js-result').addClass('hidden');
          ui.$noTabResult.removeClass('hidden');
          return;
        }
        ui.$noTabResult.addClass('hidden');
        if(idx == 1){
          ui.$hostList.closest('.js-result').removeClass('hidden');
          ui.$liveList.closest('.js-result').addClass('hidden');
        }else{
          ui.$hostList.closest('.js-result').addClass('hidden');
          ui.$liveList.closest('.js-result').removeClass('hidden');
        }
      })
      //滚动到底部刷新
      $('#conWrap').scroll(function(){
        // 当滚动到最底部以上200像素时， 加载新内容
        var i = self.tabNow;
        if (self.pageNow[i]*200 - $(this).scrollTop() < 0){
          var keyword = ui.$keyword.val();
          self.pageNow[i] = +self.pageNow[i] + 1;
          if(self.ajaxing[i] == 1){
            return;
          }
          api.toast({
            msg: '加载中',
            duration:2000,
            location: 'bottom'
          });
          self.searchData(keyword, i);
        }
      })

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
      });

    }
  , searching: function(keyword){
      var self = this;
      var searchHistory = $api.getStorage('searchHistory') || [];
      var isHaving = false;
      for(var i=0; i<searchHistory.length; i++){
        var k = searchHistory[i];
        if(k == keyword){
          isHaving = true;
        }
      }
      if(!isHaving){
        if(10 == searchHistory.length){
          searchHistory.pop();
        }
        searchHistory.unshift(keyword);
      }
      $api.setStorage('searchHistory', searchHistory);
      self.ajaxing = [1, 1];
      self.pageNow = [1, 1];
      self.tabResult = [-1, -1];
      ui.$liveList.empty();
      ui.$hostList.empty();
      self.searchData(keyword, 0);
      self.searchData(keyword, 1);
    }
  , searchData: function(keyword, idx){
      var self = this;
      var searchType = self.searchType[idx];
      var pageNow = self.pageNow[idx];
      self.getDataAjax(URLConfig('search', {
        'num': 10
      , 'page': pageNow
      , 'q': keyword
      , 't': searchType
      }), function(data) {
        ui.$history.addClass('hidden');
        ui.$noHistory.addClass('hidden');
        ui.$result.removeClass('hidden');
        if(data.length == 0){
          if(self.tabResult[idx]>0){
            self.ajaxing[idx]  = 1;
            // api.toast({
            //   msg: '已经加载完啦',
            //   duration:2000,
            //   location: 'bottom'
            // });
            return;
          }
          self.tabResult[idx] = 0;
          if(self.tabNow == idx){
            $('.js-result').addClass('hidden');
            ui.$noTabResult.removeClass('hidden');
          }
          return;
        }
        self.tabResult[idx] = 1;
        if(self.tabNow == idx){
          $('.js-result').eq(idx).removeClass('hidden');
          ui.$noTabResult.addClass('hidden');
        }
        if(idx == 0){
          self.renderLiveResult(data);
        }else{
          self.renderHostResult(data);
        }
        if(10 == data.length){
          self.ajaxing[idx]  = 0;
        }
      });
    }

  , getDataAjax: function(url,callback) {
      var self = this;
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
          api.alert({msg: '网络似乎出现了异常'});
        }
      });
    }
    //渲染历史记录
  , renderSearchHistory: function(){
      var searchHistory = $api.getStorage('searchHistory') || [];
      if(0 ==searchHistory.length){
        ui.$history.addClass('hidden');
        ui.$noHistory.removeClass('hidden');
      }else{
        ui.$noHistory.addClass('hidden');
        var historyHtml = '';
        for(var i = 0; i<searchHistory.length; i++){
          historyHtml += '<li class="js-history"><div class="pull-right">'
                      +  '<i class="icon-m icon-close js-delete" id="'+i+'" style="padding:30px;"></i></div>'
                      +  '<i class="icon-m icon-timepiece"></i><span class="search-result">'+searchHistory[i]+'</span></li>';
        }
        ui.$history.removeClass('hidden');
        ui.$historyList.find('.js-history').remove();
        ui.$historyList.prepend(historyHtml);
      }
    }
  , renderLiveResult: function(data) {
      var self = this;
      var width = api.winWidth;
      var htmlStr = '';
      var hostHtml = '';
      for(var i=0; i<data.length; i++) {
        var spic = data[i]['spic'];
        var id = data[i]['id'].split('room-')[1];
        var avatar = data[i]['avatar'] + '-normal';
        var title = data[i]['title'];
        var nickname = data[i]['nickname'];
        var online = data[i]['docTag']['online'];
        online = online>10000? Math.round(online/1000)/10+'万' : online;
        var follows = data[i]['docTag']['follows'];
        follows = follows>10000? Math.round(follows/1000)/10+'万' : follows;
        var gender = data[i]['docTag']['gender']==2? 'icon-boy' : 'icon-girl';
        htmlStr += '<li name="enterRooms" id="'+id+'"><img src="'+spic+'" alt="" class="game-pic">'
        + '<div class="til">'+data[i]['title']+'</div>'
        + '<div class="detail clearfix">'
        + '<span class="audience"><i class="icon-m icon-spectator"></i>'+online+'</span>'
        + '<p class="anchor"><i class="icon-m '+gender+'"></i><span>'+nickname+'</span></p>'
        + '</div></li>';
      }
      ui.$liveList.append(htmlStr);
    }
  , renderHostResult: function(data) {
      var self = this;
      var width = api.winWidth;
      var htmlStr = '';
      var hostHtml = '';
      for(var i=0; i<data.length; i++) {
        var spic = data[i]['spic'];
        var id = data[i]['id'].split('room-')[1];
        var avatar = data[i]['avatar'] + '-big';
        var title = data[i]['title'];
        var nickname = data[i]['nickname'];
        var online = data[i]['docTag']['online'];
        online = online>10000? Math.round(online/1000)/10+'万' : online;
        var follows = data[i]['docTag']['follows'];
        follows = follows>10000? Math.round(follows/1000)/10+'万' : follows;

        hostHtml += '<li name="enterRooms" id="'+id+'" class="clearfix">'
        + '<img src="'+avatar+'" alt="" class="user-photo">'
        + '<div class="pull-left">'
        + '<p class="user-name">'+nickname+'</p>'
        + '<p class="order-count">'+follows+'人订阅</p>'
        + '</div></li>';
      }
      ui.$hostList.append(hostHtml);
    }

  };
  oPage.init();
});