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
    $anchorList: $('#anchorList')
  , $liveList: $('#liveList')
  , $noResult: $('#noResult')

  };
  var oPage = {
    init: function() {
      this.view();
      this.listen();
    }
  , ajaxing : 0
  , view: function() {
      var self = this;
      //初始化内容高度
      $('#conWrap, .subscribe').height(api.winHeight*window.devicePixelRatio - $('.top-bar').height());
      // self.getFollowsData();
    }
  , listen: function() {
      var self = this;
      //页面出现时刷新
      api.addEventListener({name:'viewappear'}, function(ret, err){
        self.getFollowsData();
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
      });
    }
  , getFollowsData: function(){
      var self = this;
      self.getDataAjax(URLConfig('followList'), function(data) {
        if(data.length == 0){
          $('.module').addClass('hidden');
          ui.$noResult.removeClass('hidden');
          return;
        }
        ui.$noResult.addClass('hidden');
        $('.module').removeClass('hidden');
        self.renderFollow(data);
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
            api.toast({
              msg: '出错了，请重试！',
              duration:2000,
              location: 'top'
            });
          }
        } else{
          api.toast({
            msg: '出错了，请重试！',
            duration:2000,
            location: 'top'
          });
        }
      });
    }
  , renderFollow: function(data) {
      var self = this;
      var anchorHtml = '';
      var liveHtml = '';
      for(var i = 0; i<data.length; i++){
        var title = data[i]['title'];
        var status = data[i]['status'];
        var avatar = data[i]['avatar'] + '-big';
        var nickname = data[i]['nickname'];
        var online = data[i]['online'];
        var bpic = data[i]['bpic'];
        var id = data[i]['roomId'];
        online = online>10000? Math.round(online/1000)/10+'万' : online;
        var follows = data[i]['follows'];
        follows = follows>10000? Math.round(follows/1000)/10+'万' : follows;
        if(status == 0){
          anchorHtml += '<li class="clearfix"><img src="'+avatar+'" alt="" class="user-photo">'
          + '<div class="pull-left"><p class="user-name">'+nickname+'</p>'
          + '<p class="order-count">'+follows+'</p></div></li>'
        }
        else if(status == 4){
          liveHtml += '<li name="enterRooms" id="'+id+'" ><img src="'+bpic+'"class="game-pic">'
          + '<div class="til">'+title+'</div>'
          + '<div class="detail clearfix">'
          + '<span class="audience"><i class="icon-m icon-spectator"></i>'+online+'</span>'
          + '<p class="anchor"><i class="icon-m icon-boy"></i>'+nickname+'</p></div></li>';
        }
      }
      ui.$anchorList.empty().html(anchorHtml);
      ui.$liveList.empty().html(liveHtml);
    }

  };
  oPage.init();
});