
apiready = function() {

  api.addEventListener({name:'viewappear'}, function(ret, err){
    fInitInfo();
  });
  
  var ui = {
  }

	var oPage = {
		init: function() {
      this.view();
      this.listen();
		},
		view: function() {
      var self = this;
      fInitInfo();
		},
		listen: function()　{

      $('#box-list').on('click', 'li', function() {
        $(this).addClass('active').siblings().removeClass('active');
      });

      // 个人资料
      $('#personal').on('click', function() {
        api.openWin({name:'personal',url:'personal.html',delay:100,bgColor:'#FFF'});
      });

      // 我的订阅
      $('#records').on('click', function() {
        // api.execScript({
        //   name: 'personal',
        //   script: 'fInitInfo();'
        // });
        api.openWin({name:'subscribe',url:'subscribe.html',delay:100,bgColor:'#FFF'});
      });

      // 观看历史
      $('#history').on('click', function() {
        api.openWin({name:'history',url:'history.html',delay:100,bgColor:'#FFF'});
      });

      // 我的钱包
      $('#wealth').on('click', function() {
        api.openWin({name:'wealth',url:'wealth.html',delay:100,bgColor:'#FFF'});
      });

      // 充值
      $('#recharge').on('click', function() {
        var name = '';
        var url = '';
        if((api.systemType.toLowerCase()).indexOf('ios') > -1) {
          // 打开ios充值页面
          name = "recharge-ios";
          url = 'recharge-ios.html';
        } else{
          // 打开安卓充值页面
          name = "recharge-android";
          url = 'recharge-android.html';
        }
        api.openWin({name: name,url: url,delay:100,bgColor:'#FFF'});
      });

      // 每日任务
      $('#task').on('click', function() {
        api.openWin({name:'task',url:'task.html',delay:100,bgColor:'#FFF'});
      });

      // 应用设置
      $('.js-setting').on('click', function() {
        api.openWin({name:'setting',url:'settings.html?user=true',delay:100,bgColor:'#FFF'});
      });

      // 问题反馈
      $('#feed-back').on('click', function() {
        api.openWin({name:'feed-back',url:'feed-back.html',delay:100,bgColor:'#FFF'});
      });

      // 登陆
      $('#btn-login').on('click', function() {
        api.openWin({
          name:'landing',
          url:'landing.html',
          delay:100,
          bgColor:'#FFF',
          animation: {
            type: 'movein',
            subType: 'from_bottom',
            duration: 300
          },
          pageParam: {name: 'home'}
        });
      });
		}
	}
	oPage.init();
}

function fInitInfo() {
  function isEmptyObject(o){
    for(var n in o){
      return false;
    }
    return true;
  }
  var user = $api.getStorage('user');
  if(!isEmptyObject(user)) {
    // 获取金币和战旗币
    api.ajax({
      url: URLConfig('sGetRichUrl')
    , method: 'get'
    , dataType: 'json'
    }, function(ret, err) {
      if(ret) {
        if(ret['code'] == 0) {
          $('#gold').text(ret.data.gold.count);
          $('#coin').text(ret.data.coin.count);
        } else{
          api.alert({msg : ret['message']});
        }
      } else{
        api.alert({
          msg:('错误码：'+err.code+'；错误信息：'+err.msg+'网络状态码：'+err.statusCode)
        });
      }
    });
    // 我的订阅
    // 观看历史
    // 每日任务
    fGetTask();
    $('#photo').attr('src', user.avatar);
    $('#personal').text(user.account);
    $('#box-uncenter').hide();
    $('#box-center').show();
    $('#box-list li').removeClass('active');
  } else{
    $('#box-uncenter').show();
    $('#box-center').hide();
  }
}
function fGetTask() {
  yp.ajax({
    url: URLConfig('sTaskCompleteStatusUrl')
  , method: 'post'
  , dataType: 'json'
  }, function(ret, err) {
    if(ret) {
      if(ret.code == 0) {
        var isFinish = true;
        for(var i in ret.data) {
          if(ret.data.hasOwnProperty(i)) {
            if(ret.data[i].status < 2) {
              isFinish = false;
              break;
            }
          }
        }
        if(!isFinish) {
          $('#taskInfo').html('今日任务未完成');
        } else{
          $('#taskInfo').html('今日任务已完成');
        }
      } else{
        api.alert({msg: ret.message});
      }
    } else{
      api.alert({
        msg:('错误码：'+err.code+'；错误信息：'+err.msg+'网络状态码：'+err.statusCode)
      });
    }
  });
}