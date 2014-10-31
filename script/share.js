/* =============================================
 * v20141024.1
 * =============================================
 * Copyright Napster
 *
 * 分享
 * ============================================= */

apiready = function() {
  var sinaWeiBo = api.require('sinaWeiBo');
  var qqObj = api.require('qq');
  var weiXin = api.require('weiXin');
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
              ,title:'我正在#战旗TV#观看大神'+domain+'的现场直播：'
              ,description:'【'+title+'】，精彩炫酷，大家速速来围观！'
              ,imgUrl:imgUrl
          }, function(ret, err) {
            if(ret.status) {
              api.alert({'msg' : '分享成功'});
            }else{
              api.alert({'msg' : err.msg});
            }
          });
          break;
        case 'sina':
          sinaWeiBo.sendRequest({
              contentType: 'text',
              text: '我正在#战旗TV#观看大神'+domain+'的现场直播：【'+title+'】，精彩炫酷，大家速速来围观！（分享自@战旗TV直播平台）',
              imageUrl: imgUrl,
              media : {
                webpageUrl : url
              }
          },function(ret,err){
              if (ret.status) {
                  api.alert({
                      title: '发表微博',
                      msg: '发表成功',
                      buttons: ['确定']
                  });
              }else{
                  api.alert({
                      title: '发表微博',
                      msg: '发表失败',
                      buttons: ['确定']
                  });
              };
          });
          break;
        case 'weixin':
          weiXin.sendRequest({
              scene:'timeline',
              contentType:'web_page',
              title:'我正在#战旗TV#观看大神'+domain+'的现场直播：',
              description:'【'+title+'】，精彩炫酷，大家速速来围观！（分享自@战旗TV直播平台）',
              thumbUrl:imgUrl,
              contentUrl: url
          },function(ret,err){
              if(ret.status){
                  api.alert({title: '发表微信',msg: '发表成功', buttons: ['确定']});
              } else {
                  api.alert({title: '发表失败',msg: err.msg,buttons: ['确定']});
              };
          });
          break;

      }
		}


	}


	oPage.init();



}


// 我正在#战旗TV#观看大神CaoMei的现场直播：【早上刀架在脖子也起不来，2点起来直播 -。-】，精彩炫酷，大家速速来围观！

// 新浪文案
// 我正在#战旗TV#观看大神CaoMei的现场直播：【早上刀架在脖子也起不来，2点起来直播 -。-】，精彩炫酷，大家速速来围观！（分享自@战旗TV直播平台）


