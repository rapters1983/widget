
apiready = function(){
    var ui = {
     $search : $('.search')
    ,$searchInput : $('.search-in input')
    ,$topLogo : $('#topLogo')
    ,$gameList : $('#gameList')
    ,$liveList : $('#liveList')
  }

  var bodyWidth = api.frameWidth - 130;

  var oPage = {
    init : function() {
      this.view();
      this.listen();
    },

    view : function() {
      var self = this;

      ui.$search.width(bodyWidth + 30).css('marginLeft','10px');

      this.getDataIndex(URLConfig('gameIndex'), function(ret, err) {
        if (ret) {
          if(ret['code'] == 0) {
            self.renderGameData(ret['games']);
          }else{
            api.alert({msg : ret['message']});
          }
        } else {
            api.alert({
                msg:('错误码：'+err.code+'；错误信息：'+err.msg+'网络状态码：'+err.statusCode)
            });
        };
      });

      this.getDataIndex(URLConfig('liveIndex'), function(ret, err) {
        if (ret) {
          if(ret['code'] == 0) {
            self.renderLiveData(ret['lives']);
          }else{
            api.alert({msg : ret['message']});
          }
        } else {
            api.alert({
                msg:('错误码：'+err.code+'；错误信息：'+err.msg+'网络状态码：'+err.statusCode)
            });
        };
      });

    },

    listen : function()　{
      ui.$gameList.on('click',  'li[name=game]', function() {
        api.openWin({name:'rooms','slidBackEnabled' : false,url:'rooms.html?id='+this.id});
      });

      //点击搜索框
      ui.$search.on('click', function() {
        api.openWin({name:'search',url:'search.html',delay:300,bgColor:'#FFF'});
      });
    },

    getDataIndex : function(url,callback) {
      $.ajax({
        url : url,
        type : 'get',
        dataType : 'json',
        success : function(data) {
          callback(data)
        }
      });

    },

    renderGameData : function(data) {
      var htmlStr = '';
      $.each(data,  function(key,val) {
        htmlStr += '<li class="clearfix" id="'+val['id']+'" name="game">'
        +'<img src="'+val['spic']+'" alt="" class="icon_name">'
        +'<div class="main_name">'+val['name']+'</div>'
        +'<i class="icon_next"></i>'
        +'</li>'
      });
      ui.$gameList.html(htmlStr);
    },

    renderLiveData : function(data) {
      var htmlStr = '';
      for(var i=0; i<data.length; i++) {
        htmlStr += '<li class="clearfix" id="'+data[i]['id']+'" name="game">'
        +'<img src="'+data[i]['avatar']+'-small" alt="" class="icon_live_name" style="margin-top:2px;">'
        +'<div class="main_name" style="width:'+ bodyWidth +'px">'+data[i]['title']+'</div>'
        +'<i class="icon_next"></i>'
        +'</li>'
      }

      ui.$liveList.html(htmlStr);
    }


  }



  oPage.init();


}
