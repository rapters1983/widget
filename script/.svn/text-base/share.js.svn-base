/* =============================================
 * v20141024.1
 * =============================================
 * Copyright Napster
 *
 * 分享
 * ============================================= */

apiready = function() {
  	// var sinaWeiBo = api.require('sinaWeiBo');
  var qqObj = api.require('qq');
  	// var weiXin = api.require('weiXin');
	var ui = {
		$shareList : $('#shareList')
	}

	var oPage = {

		init : function() {
      this.view();
      this.listen();
		},

		view : function() {
		},

		listen : function() {
			var self = this;
			ui.$shareList.on('click', 'li', function() {
				var name = $(this).attr('name');
        self.shareIt(name);
			});
		},


		shareIt : function(name) {
      var domain =  api.pageParam['domain']
        , title =  api.pageParam['title']
        , imgUrl =  api.pageParam['imgUrl']
      var url = 'http://www.zhanqi.tv/' + domain;

      switch(name) {
        case 'qq':
          qqObj.shareNews({
               url:url
              ,title:title
              // ,description:yp.query('desc')
              ,imgUrl:imgUrl
          });
          break;
        case 'sina':

        case 'weixin':
          weiXin.sendRequest({
              scene:'timeline',
              contentType:'web_page',
              title:'测试用标题',
              description:'测试用内容',
              thumbUrl:'fs://a.png',
              contentUrl: 'http://www.baidu.com/'
          },function(ret,err){
              if(ret.status){
                  api.alert({title: '发表微信',msg: '发表成功', buttons: ['确定']});
              } else{
                  api.alert({title: '发表失败',msg: err.msg,buttons: ['确定']});
              };
          });
          break;

      }
		}



	}


	oPage.init();



}

