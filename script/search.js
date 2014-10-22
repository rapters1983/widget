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
  , $noResult: $('#noResult')
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
      var searchHistory = $api.getStorage('searchHistory') || [];
      var historyHtml = '';
      for(var i = 0; i<searchHistory.length; i++){
        historyHtml += '<li class="js-history"><div class="pull-right">'
                    +  '<i class="icon-m icon-close js-delete" id="'+i+'" style="padding:30px;"></i></div>'
                    +  '<i class="icon-m icon-timepiece"></i><span class="search-result">'+searchHistory[i]+'</span></li>';
      }
      ui.$historyList.prepend(historyHtml);
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
          ui.$noResult.addClass('hidden');
          ui.$result.addClass('hidden');
          ui.$history.removeClass('hidden');
        }
      })

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
      });

      ui.$result.on('click',function(){
        ui.$keyword.blur();
      });
      ui.$cleanHistory.on('click', function(){
        $api.setStorage('searchHistory', []);
        $('.js-history').remove();
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
        if(idx == 1){
          ui.$hostList.closest('.js-result').removeClass('hidden');
          ui.$liveList.closest('.js-result').addClass('hidden');
        }else{
          ui.$hostList.closest('.js-result').addClass('hidden');
          ui.$liveList.closest('.js-result').removeClass('hidden');
        }
      })
      //滚动到底部刷新
      api.addEventListener({name:'scrolltobottom'}, function(ret, err){
        var keyword = ui.$keyword.val();
        var i = self.tabNow;
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
        ui.$noResult.addClass('hidden');
        ui.$result.removeClass('hidden');
        if(data.length == 0){
          if(self.tabResult[idx]>0){
            self.ajaxing[idx]  = 1;
            api.toast({
              msg: '已经到底了',
              duration:2000,
              location: 'bottom'
            });
            return;
          }
          self.tabResult[idx] = 0;
          if(self.tabResult[0] == 0 && self.tabResult[1] == 0){
            ui.$result.addClass('hidden');
            ui.$noResult.removeClass('hidden');
          }
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
          api.alert({
            msg:('错误码：'+err.code+'；错误信息：'+err.msg+'网络状态码：'+err.statusCode)
          });
        }
      });
    }
  , renderLiveResult: function(data) {
      var self = this;
      var width = api.winWidth;
      var htmlStr = '';
      var hostHtml = '';
      for(var i=0; i<data.length; i++) {
        var which = data[i]['flashvars']? data[i]['flashvars']['VideoType'] : 'VIDEO';
        var fansTitle = data[i]['fansTitle'];
        var spic = data[i]['spic'];
        var avatar = data[i]['avatar'] + '-normal';
        var title = data[i]['title'];
        var nickname = data[i]['nickname'];
        var online = data[i]['docTag']['online'];
        online = online>10000? Math.round(online/1000)/10+'万' : online;
        var follows = data[i]['docTag']['follows'];
        follows = follows>10000? Math.round(follows/1000)/10+'万' : follows;

        htmlStr += '<li><img src="'+spic+'" alt="" class="game-pic">'
        + '<div class="til">'+data[i]['title']+'</div>'
        + '<div class="detail clearfix">'
        + '<span class="audience"><i class="icon-m icon-spectator"></i>'+online+'</span>'
        + '<p class="anchor"><i class="icon-m icon-boy"></i><span>'+nickname+'</span></p>'
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
        var which = data[i]['flashvars']? data[i]['flashvars']['VideoType'] : 'VIDEO';
        var fansTitle = data[i]['fansTitle'];
        var spic = data[i]['spic'];
        var avatar = data[i]['avatar'] + '-normal';
        var title = data[i]['title'];
        var nickname = data[i]['nickname'];
        var online = data[i]['docTag']['online'];
        online = online>10000? Math.round(online/1000)/10+'万' : online;
        var follows = data[i]['docTag']['follows'];
        follows = follows>10000? Math.round(follows/1000)/10+'万' : follows;

        hostHtml += '<li class="clearfix">'
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