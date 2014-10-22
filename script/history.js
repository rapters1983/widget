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
      this.getDataHistory();
		},
		listen : function()　{
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
    },

    getDataHistory : function() {
      var self = this;
      $.ajax({
        url : URLConfig('history'),
        type : 'get',
        dataType : 'json',
        success : function(data) {
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
          alert('error')
        }
      });

    },


    renderData : function(data) {
      var dataArr = [];
      $.each(data,  function(key, val) {
        dataArr.push(val);
      });

      var htmlStr = '', i= 0;
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

      ui.$historyList.html(htmlStr);

    }


	}
	oPage.init();
}
