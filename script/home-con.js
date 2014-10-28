/*
2014.10.18
我的
魏露霞
 */
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
        $(this).addClass('active').siblings('li.active').removeClass('active');
      });

      // 我的订阅
      $('#records').on('click', function() {
        var user = $api.getStorage('user');
        if($.isEmptyObject(user)) {
          api.alert({msg: '登录后可查看您订阅的主播'});
        } else{
          api.openWin({name:'subscribe',url:'subscribe.html',delay:0,bgColor:'#FFF'});
        }
      });

      // 观看历史
      $('#history').on('click', function() {
        var user = $api.getStorage('user');
        if($.isEmptyObject(user)) {
          api.alert({msg: '登录后可查看您的观看历史'});
        } else{
          api.openWin({name:'history',url:'history.html',delay:0,bgColor:'#FFF'});
        }
      });

      // 我的钱包
      $('#wealth').on('click', function() {
        var user = $api.getStorage('user');
        if($.isEmptyObject(user)) {
          api.alert({msg: '登录后可查看我的资金信息'});
        } else{
          api.openWin({name:'wealth',url:'wealth.html',delay:0,bgColor:'#FFF'});
        }
      });

      // 每日任务
      $('#task').on('click', function() {
        var user = $api.getStorage('user');
        if($.isEmptyObject(user)) {
          api.alert({msg: '登录后可通过任务获得战旗币'});
        } else{
          api.openWin({name:'task',url:'task.html',delay:0,bgColor:'#FFF'});
        }
      });

      // 应用设置
      $('.js-setting').on('click', function() {
        api.openWin({name:'setting',url:'settings.html?user=true',delay:0,bgColor:'#FFF'});
      });

      // 问题反馈
      $('#feed-back').on('click', function() {
        api.openWin({name:'feed-back',url:'feed-back.html',delay:0,bgColor:'#FFF'});
      });
		}
	}
	oPage.init();
}

var netWorkError = false;

function fInitInfo() {
  $('#box-list').find('li.active').removeClass('active');
  var user = $api.getStorage('user');
  if(!$.isEmptyObject(user)) {
    // 我的订阅
    fGetSubscribe();
    // 观看历史
    fGetHistory();
    // 每日任务
    fGetTask();
    // 我的钱包
    $('#wealthInfo').html('查看送礼充值记录');
  } else{
    $('#recordsInfo').html('登录后可查看您订阅的主播');
    $('#taskInfo').html('登录后可通过任务获得战旗币');
    $('#historyInfo').html('登录后可查看您观看历史');
    $('#wealthInfo').html('登录后可查看我的资金信息');
  }
}
function fGetSubscribe() {
  yp.ajax({
    url: URLConfig('followList')
  , method: 'get'
  , dataType: 'json'
  , notLoad: true
  }, function(ret, err) {
    if(ret) {
      if(ret['code'] == 0) {
        var num = 0;
        for(var i = 0, l = ret['data'].length; i < l; i++) {
          var one = ret['data'][i];
          if(4 == one['status']) {
            num++;
          }
        }
        $('#recordsInfo').html(num + '位主播正在直播中');
      } else{
        api.alert({msg : ret['message']});
      }
    } else{
      if(!netWorkError) {
        api.alert({msg: '网络似乎出现了异常'});
        netWorkError = true;
      }
      // api.alert({
      //   msg:('错误码：'+err.code+'；错误信息：'+err.msg+'网络状态码：'+err.statusCode)
      // });
    }
  });
}
function fGetHistory() {
  yp.ajax({
    url: URLConfig('history')
  , method: 'get'
  , dataType: 'json'
  , notLoad: true
  }, function(data, err) {
    if(data) {
      if(data['code'] == 0) {
        var dataArr = [];
        var shtml = '';
        $.each(data['data'],  function(key, val) {
          dataArr.push(val);
        });
        var one = dataArr[0];
        if(one) {
          shtml = '最近观看“' + one.title + '”';
        } else{ 
          shtml = '暂时没有记录';
        }
        $('#historyInfo').html(shtml);
      } else{
        api.alert({msg : data['message']});
      }
    } else{
      if(!netWorkError) {
        api.alert({msg: '网络似乎出现了异常'});
        netWorkError = true;
      }
    }
  });
}

function fGetTask() {
  yp.ajax({
    url: URLConfig('sTaskCompleteStatusUrl')
  , method: 'post'
  , dataType: 'json'
  , notLoad: true
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
      if(!netWorkError) {
        api.alert({msg: '网络似乎出现了异常'});
        netWorkError = true;
      }
    }
  });
}