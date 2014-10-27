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
      api.showProgress({
        style: 'default',
        animationType: 'fade',
        title: '正在登陆中...',
        text: '先喝杯茶...',
        modal: false
      });
      $.ajax({
        url : URLConfig('history'),
        type : 'get',
        dataType : 'json',
        success : function(data) {
          api.hideProgress();
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
        },
        error: function() {
          api.hideProgress();
          alert('error')
        }
      });

    },
    renderData : function(data) {
      var dataArr = [], oLen = ui.$historyList.find('li').length;
      $.each(data,  function(key, val) {
        dataArr.push(val);
      });
      if(!dataArr.length) {
        ui.$historyList.empty().html('暂时无记录');
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
          }
        }
      }
      dataArr.splice(oLen-1,oLen);
      
      var htmlStr = '', i = 0;
      while(dataArr[i]) {
        htmlStr += '<li id="'+dataArr[i]['id']+'" name="enterRooms">'
        +'<img src="'+dataArr[i]['spic']+'" alt="" class="game-pic">'
        +'<div class="til">'+dataArr[i]['title']+'</div>'
        +'<div class="detail clearfix">'
        +'<span class="audience"><i class="icon-m icon-spectator"></i>'+ (dataArr[i]['online']?dataArr[i]['online'] : 0)+'</span>'
        +'<p class="anchor"><i class="icon-m icon-boy"></i>'+dataArr[i]['nickname']+'</p>'
        +'</div>'
        +'</li>';
        ++i;
      }
      ui.$historyList.append(htmlStr);
    }
	}
	oPage.init();
}
