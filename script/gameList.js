

apiready = function(){
    api.setRefreshHeaderInfo({
        visible: true,
        loadingImgae: 'widget://image/refresh-white.png',
        bgColor: '#ccc',
        textColor: '#fff',
        textDown: '下拉试试...',
        textUp: '松开试试...',
        showTime: true
    }, function(ret, err){
        // alert(ret);

        setTimeout(function(){
            api.refreshHeaderLoadDone();
            var content = $api.byId('content');
            var str = '<h4>数据加载完毕！！</h4><p>在此可刷新页面。</p>';
            content.innerHTML = str;
            api.parseTapmode();
        }, 2000);
    });

  var ui = {
     $hdLogo : $('#hdLogo')
    ,$topLogo : $('#topLogo')
    ,$gameList : $('#gameList')
    ,$liveList : $('#liveList')
  }

  var oPage = {
    init : function() {
      this.view();
      this.listen();
    },

    view : function() {
      var gameId = yp.query('id') || 6;
      this.getGameList(gameId);
    },

    listen : function()　{
      ui.$gameList.on('click',  'li[name=game]', function() {
        var gameName = $(this).attr('gameName')
        , which = $(this).attr('which');

        api.openWin({name:'BFDemo','slidBackEnabled' : false,url:'rooms.html?id='+this.id + '&gameName=' + gameName+'&which='+which});
      });

      //进入直播间
      $('#wrap').on('click', 'li[name=enterRooms]', function() {
        var roomid = this.id
        , which = $(this).attr('which')
        , fansTitle = $(this).attr('fansTitle')
        
        api.openWin({
            name:'rooms'
          ,'slidBackEnabled' : false
          , url:'rooms.html?id=' + roomid + '&which=' + which + '&fansTitle=' + fansTitle
          // , pageParam: {id: roomid, which : which, fansTitle : fansTitle}
          , delay:300
          , bgColor:'#FFF'
        });

      });

      // function hengshuping(){
      //   if(window.orientation==180||window.orientation==0){
      //     alert("竖屏状态！")
      //   }
      //   if(window.orientation==90||window.orientation==-90){
      //     alert("横屏状态！")
      //   }
      // }

      // window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", hengshuping, false);
    },

    getGameList : function(id) {
      var self = this;
      $.ajax({
        url : URLConfig('gameList',{'id' : id, 'start' : 1,'count' : 100}),
        type : 'get',
        dataType : 'JSON',
        headers: {
          'User-Agent': 'Zhanqi.tv Api Client'
        },
        success : function(data) {
          if(data['code'] == 0) {
            self.renderGameData(data['data']);
          }else{

          }
        }
      })

    },

    renderGameData : function(data) {
      var htmlStr = '', i=0, data = data['rooms'];
      for(; i<data.length; i++) {
        var pic = data[i]['bpic'] || data[i]['spic'];
        var videoType = data[i]['flashvars']['VideoType'];
        htmlStr += '<li name="game" which="'+videoType+'" gameName="'+data[i]['gameName']+'" id="'+data[i]['id']+'">'
        +'<div class="detail">'
        +'<p>'+data[i]['nickname']+'</p>'
        +'<p>'+data[i]['title']+'</p>'
        +'<p class="live_detail">正在为'+data[i]['online']+'名观众直播'+data[i]['gameName']+'</p>'
        +'</div>'
        +'<img src="'+pic+'" alt="">'
        +'</li>'

      }
      ui.$gameList.html(htmlStr);
    }


  }



  oPage.init();


}
