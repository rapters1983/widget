/* =============================================
 * v20141020.1
 * =============================================
 * Copyright Napster
 *
 * 历史记录
 * ============================================= */
apiready = function() {

  var ui = {
    $historyList : $('#historyList')
  }

	var oPage = {
		init : function() {
      this.view();
      this.listen();
		},
		view : function() {
      var self = this;
      //初始化内容高度
      if(api.systemType === 'ios') {
        $('#conWrap, .subscribe').height(api.winHeight*window.devicePixelRatio - $('.top-bar').height());
      }else{
        $('#conWrap, .subscribe').height(api.winHeight - $('.top-bar').height());
      }
     
      this.getDataHistory();
		},
		listen : function()　{
       //进入直播间
      $('#conWrap').on('click', 'li[name=enterRooms]', function() {
        var roomid = this.id
        api.openWin({
            name:'rooms'
          ,'slidBackEnabled' : false
          , url:'rooms.html?id=' + roomid
          , delay:300
          , bgColor:'#FFF'
        });
      }).on('touchstart', 'li[name=enterRooms]', function() {
        $(this).addClass('active');
      }).on('touchend', 'li[name=enterRooms]', function() {
        $(this).removeClass('active');
      });
    },
    getDataHistory : function() {
      var self = this;
      yp.ajax({
          url: URLConfig('history')
        , method: 'get'
        , dataType: 'json'
      }, function(data, err) {
        if(data) {
          if(data['code'] == 0) {
            self.renderData(data['data']);
          } else{
            api.alert({msg : data['message']});
          }
        } else{
          api.alert({
            msg:'网络似乎出现了异常'
          });
        }
      });
    },
    renderData : function(data) {
      var dataArr = [], oLen = ui.$historyList.find('li').length;
      $.each(data,  function(key, val) {
        dataArr.push(val);
      });
      if(!dataArr.length) {
        ui.$historyList.empty().html('<div style="text-align:center;  color:#999; padding:20px;">暂时无记录</div>');
        return;
      }
      var lis = ui.$historyList.find('li');
      if(dataArr.length <= oLen ) {
        for(var i=0; i<oLen; i++) {
          var curLi = lis.eq(i);
          if(dataArr[i]) {
            curLi.attr('name','enterRooms').attr('id',dataArr[i]['id']);
            curLi.find('.game-pic').attr('src',dataArr[i]['spic']);
            curLi.find('.til').text(dataArr[i]['title']);
            curLi.find('.js-online').text(dataArr[i]['online']?dataArr[i]['online'] : 0);
            curLi.find('.js-nickname').text(dataArr[i]['nickname']);
            if(dataArr[i]['gender'] == 2) {
              curLi.find('i[name=gender]').removeClass('icon-girl').addClass('icon-boy');
            }else{
              curLi.find('i[name=gender]').removeClass('icon-boy').addClass('icon-girl');
            }
          }else{
            curLi.remove();
          }
        }
        return;
      }else{
        for(var i=0; i<oLen; i++) {
          var curLi = lis.eq(i);
          if(dataArr[i]) {
            curLi.attr('name','enterRooms').attr('id',dataArr[i]['id']);
            curLi.find('.game-pic').attr('src',dataArr[i]['spic']);
            curLi.find('.til').text(dataArr[i]['title']);
            curLi.find('.js-online').text(dataArr[i]['online']?dataArr[i]['online'] : 0);
            curLi.find('.js-nickname').text(dataArr[i]['nickname']);
            if(dataArr[i]['gender'] == 2) {
              curLi.find('i[name=gender]').removeClass('icon-girl').addClass('icon-boy');
            }else{
              curLi.find('i[name=gender]').removeClass('icon-boy').addClass('icon-girl');
            }
          }
        }
      }
      dataArr.splice(0,oLen);
      var htmlStr = '', i = 0;
      while(dataArr[i]) {
        htmlStr += '<li id="'+dataArr[i]['id']+'" name="enterRooms">'
        +'<img src="'+dataArr[i]['spic']+'" alt="" class="game-pic">'
        +'<div class="til">'+dataArr[i]['title']+'</div>'
        +'<div class="detail clearfix">'
        +'<span class="audience"><i class="icon-m icon-spectator"></i>'+ (dataArr[i]['online']?dataArr[i]['online'] : 0)+'</span>'
        +'<p class="anchor">'
        if(dataArr[i]['gender'] == 2) {
          htmlStr += '<i class="icon-m icon-boy"></i>'
        }else{
          htmlStr += '<i class="icon-m icon-girl"></i>'
        }

        htmlStr += dataArr[i]['nickname']+'</p>'
        +'</div>'
        +'</li>';
        ++i;
      }
      ui.$historyList.append(htmlStr);
    }
	}
	oPage.init();
}
