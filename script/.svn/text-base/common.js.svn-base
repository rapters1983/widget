/* =============================================
 * v20141018.2
 * =============================================
 * Copyright 谢武
 *
 * 框架方法和配置
 * ============================================= */

var BASE_URL = 'http://www.zhanqi.tv/';
// ajax地址配置
// var URLConfig = {
//   'gameIndex': BASE_URL + 'api/static/game.index/index.json'
// , 'liveIndex': BASE_URL + 'api/static/live.index/index.json'
// , 'gameList': BASE_URL + 'api/static/game.lives/6/1-4.json'
// }
function URLConfig(which, data) {
  switch (which) {
    case 'hotLive':
      return BASE_URL + 'api/static/game.lives/'+data['id']+'/'+data['start']+'-'+data['count']+'.json';
    case 'gameLiveIndex':
      return BASE_URL + 'api/static/game.lives/'+data['id']+'/'+data['num']+'-'+data['page']+'.json';
    case 'otherLiveIndex':
      return BASE_URL + 'api/static/live.others/4-1-10,13,6.json';
    case 'bannerIndex':
      return BASE_URL + 'api/touch/apps.banner?rand='+data['id']+'';
    case 'liveIndex':
      return BASE_URL + 'api/static/live.index/index.json';
    case 'liveList':
      return BASE_URL + 'api/static/live.hots/'+data['num']+'-'+data['page']+'.json';
    case 'gameList':
      return BASE_URL + 'api/static/game.lists/'+data['num']+'-'+data['page']+'.json';
    case 'gameLive':
      return BASE_URL + 'api/static/game.lives/'+data['id']+'/'+data['num']+'-'+data['page']+'.json';
    case 'search':
      return BASE_URL + 'api/touch/search?t='+data['t']+'&q='+data['q']+'&page='+data['page']+'&nums='+data['num'];
    case 'followList':
      return BASE_URL + 'api/user/follow.listall';
    case 'unfollow':
      return BASE_URL + 'api/user/follow.unfollow';
    case 'liveRoomInfo':  // 获取直播播放信息
      return BASE_URL + 'api/static/live.roomid/'+data['roomid']+'.json';
    case 'videoRoomInfo': // 获取视频播放信息
      return BASE_URL + 'api/static/video.videoid/'+data['roomid']+'.json';
    case 'login':
      return BASE_URL + 'api/auth/user.login';
    case 'register':
      return BASE_URL + 'api/auth/user.register';
    case 'logout':
      return BASE_URL + 'api/auth/user.logout';
    case 'bindPhone':
      return BASE_URL + 'api/user/user.bind_mobile';
    case 'nickname':
      return BASE_URL + 'api/public/validate.nickname';
    case 'editInfo':
      return BASE_URL + 'api/user/user.edit';
    case 'avatar':
      return BASE_URL + 'api/user/upload.avatar';
    case 'charge':
      return BASE_URL + 'api/user/log.charge?stime='+data['stime']+'&etime='+data['etime']+'&nums='+data['nums']+'&start='+data['start'];
    case 'giftuse':
      return BASE_URL + 'api/user/log.giftuse?stime='+data['stime']+'&etime='+data['etime']+'&nums='+data['nums']+'&start='+data['start'];
    case 'getGiftList':
      return BASE_URL + 'api/static/live.gifts/'+data['roomid']+'.json';
    case 'sGetRichUrl':
      // 获得金币
      return BASE_URL + 'api/user/rich.get';
    case 'suggest':
      // 问题反馈
      return BASE_URL + 'api/public/suggest.save';
    case 'sTaskCompleteStatusUrl':
      // 获取任务状态
      return BASE_URL + 'api/actives/task/info.status';
    case 'sDailyAskSubmitUrl':
      // 每日一问，提交
      return BASE_URL + 'api/actives/task/ask.answer';
    case 'sDailyAskGetUrl':
      // 获取每日一问的问题
      return BASE_URL + 'api/actives/task/ask.question';
    case 'sTaskReceiveUrl':
      // 领取任务奖励
      return BASE_URL + 'api/actives/task/info.receive';
    case 'sSignInUrl': 
    // 获取签到
      return BASE_URL + 'api/actives/signin/seven.sign';
    case 'history':
      return BASE_URL + 'api/user/record.watch_list?nums=10';
    case 'getRich':  //获取财富
      return BASE_URL + 'api/user/rich.get';
    case 'qqLoginUrl':
      // qq登陆
      return BASE_URL + 'api/auth/openid.qq_login_by_token';
    case 'recordWatch':  //进入直播记录
      return BASE_URL + 'api/user/record.watch?type=1&id='+data['roomid'];  //type 1 直播 写死
  }
};


$(function() {
  var scale = 1.0, ratio = 1, htmlStr = '', cssSrc = '';

  if(window.location.href.indexOf('index.html') > -1) { //启动页
    cssSrc = './css/'
  }else{ //普通页  在html文件夹里
    cssSrc = '../css/'
  }

  if( window.devicePixelRatio == 2 && window.navigator.appVersion.match(/iphone/gi)) {
    scale = 0.5;
    htmlStr += '<meta name="viewport" content="initial-scale=' + scale + ', maximum-scale=' + scale +', minimum-scale=' + scale + ', user-scalable=no" />'
    +'<link type="text/css" rel="styleSheet" href="'+cssSrc+'common.css" />'
  }else{
    htmlStr += '<meta name="viewport" content="initial-scale=' + scale + ', maximum-scale=' + scale +', minimum-scale=' + scale + ', user-scalable=no" />'
    +'<link type="text/css" rel="styleSheet" href="'+cssSrc+'common-s.css" />'
  }
  $('head').append(htmlStr)
});

/* 静默登录 */
function silenceLoginFn(pageName, fnName, isRoom, fn2Name) {
  var user = $api.getStorage('user');
  var password = $api.getStorage('password');
  if(!user || !api || !password) {
    if(isRoom) {
      api.execScript({
        name: pageName,
        script: fn2Name + '()'
      });
    }
    return;
  };
  api.ajax({
    url : URLConfig('login'),
    method : 'post',
    dataType : 'json',
    headers: {
     'User-Agent': 'Zhanqi.tv Api Client'
    },
    data: {
      values: {'account' : user['account'], 'password' : password}
    }
  }, function(ret, err) {
      if(!ret) {
        if(isRoom) {
          api.execScript({
            name: pageName,
            script: fn2Name + '()'
          });
        }
        return;
      };
      if(ret.code == 0) {
        $api.setStorage('user', ret['data']);
        api.execScript({
          name: pageName,
          script: fnName + '()'
        });
      } else{
        if(isRoom) {
          api.execScript({
            name: pageName,
            script: fn2Name + '()'
          });
        }
      }
  });
  
}

/* 框架初始化 */
+function(win, $) {
  var yp = {};
  /* 语法糖扩展 */
  // 对象扩展
  yp.mix = $.extend;
  // 对象循环
  yp.each = function(arr, callback) {
    return $.each(arr, function(a, b) {
      return callback(b, a);
    });
  };
  // 格式化
  yp.format = function(str, data) {
    if (!str) {
      throw new Error('yp.format字符串参数不能为空');
      return '';
    }
    var re = this.re || /\${([\s\S]+?)}/g
    if (typeof data !== 'object') data = [].slice.call(arguments, 1);
    return str.replace(re, function($0, $1) {
      return data[$1] != null ? data[$1] : '';
    });
  };
  // 获取随机数
  yp.getRandom = function(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  };
  // 获取url参数
  yp.query = function(key, context) {
    var result
    var regParam = new RegExp('([\?\&])' + key + '=([^\&]*)(\&?)', 'i')
    context = context || location.search;
    return (result = regParam.exec(context)) ? decodeURI(result[2]) : null;
  };
  // 空函数
  yp.noop = $.noop;

  yp.mix(yp, {
    global: {}  /*全局变量*/
  , config: {}  /*全局配置*/
  , loader: {}  /*资源加载*/
  , loger: {}   /*日志输出*/
  , mods: {}    /*全局模块*/
  , cache: {}   /*全局缓存*/
  , event: {}   /*全局事件*/
  , ui: {}      /*全局UI*/
  , system: {}  /*系统函数*/
  });

  win.yp = yp;
}(window, $);

/* 全局事件管理event */
+function($, yp) {
var 
  exports = yp
, yp_event = exports.event
, o = $({});
  
  yp_event.sub = function() {
    var eventName = arguments[0]
    var data = o.data(eventName.replace(/\..*/, ''))
    if (data) {
      var callback = arguments[1]
      callback(data);
      return;
    }
    o.on.apply(o, arguments);
  };
  yp_event.unsub = function() {
    o.off.apply(o, arguments);
  };
  yp_event.pub = function() {
    o.trigger.apply(o, arguments);
    var eventName = arguments[0]
    return {
      cache: function(val) {
        eventName = typeof eventName === 'string' ? eventName : eventName.type + '.' + eventName.namespace;
        o.data(eventName, val || true);
      }
    };
  };

  // 系统观察者
  exports.sub = $.sub = yp_event.sub;
  exports.unsub = $.unsub = yp_event.unsub;
  exports.pub = $.pub = yp_event.pub;
}($, yp);

/* 全局数据加载模块 */
+function($, yp) {
 var
  win = this
, exports = yp
, loader = exports.loader
, system = exports.system;

  var ajax = function(options, callback) {
    options = yp.mix({
      method: 'post'
    , dataType: 'json'
    , headers: {
       'User-Agent': 'Zhanqi.tv Api Client'
      }
    }, options);
    if(!options['notLoad']) {
      $.pub('loader/ajax/start', options);
    }
    system.ajax(options, function(ret, err) {
      $.pub('loader/ajax/always', [ret, err]);
      if (ret) {
        var e = $.Event('loader/ajax/done');
        $.pub(e, ret);
        if (e.isDefaultPrevented()) return;
      } else {
        var e = $.Event('loader/ajax/fail');
        $.pub(e, err);
        if (e.isDefaultPrevented()) return;
      }
      callback(ret, err);
    });
  };
  exports.ajax = loader.ajax = ajax;

  // 监听全局ajax消息
  +function(loader) {
    var oAjaxCode = {
      init: function() {
        oAjaxCode.oMap = yp.mix({
          // 登陆超时跳转
          50001: function(msg) {
            var sUrl = msg.data
            if (typeof sUrl === 'string') {
              var sMsg = msg.message || msg.msg;
              var jumpTo = function() {
                location.href = sUrl;
              };
              if (sMsg) alert(sMsg, jumpTo);
              else jumpTo();
            }
          }
        }, window.oPageConfig && window.oPageConfig.oAjaxCodeMap);

        ///$.sub('loader/ajax/done.loader', oAjaxCode.ajaxMsgCheck);
      }
    , ajaxMsgCheck: function(e, msg) {
        if ($.isEmptyObject(msg)) {
          alert('数据接口返回为空对象，请检查');
          return false;
        }
        var fError = oAjaxCode.oMap[msg.code]
        if (fError) {
          fError(msg);
          return false;
        }
      }
    };
    oAjaxCode.init();
    loader.oAjaxCode = oAjaxCode;
  }(loader);

  var ready = function(callback) {
    if (callback) {
      apiready = function() {
        $.pub('loader/ready/before');
        callback();
        $.pub('loader/ready/after');
      };
    }
  };
  exports.ready = loader.ready = ready;
}($, yp);

/* 全局UI模块 */
+function($, yp) {
var
  win = this
, exports = yp
, ui = exports.ui
, system = exports.system;

  // loading模块
  +function(ui, system) {
    var nDelay = 300
    var nCount = 0
    var timer = null
    var oLoading = {
      toggle: function(flag) {
        if (flag) {
          system.showProgress({
            style: 'default'
          , animationType: 'fade'
          , title: '努力加载中...'
          , text: '先喝杯茶...'
          , modal: false
          });
        } else {
          system.hideProgress();
        };
      }
    , loadBegin: function() {
        ++nCount;
        // var isLoad = arguments[0];
        if (!timer) {
          timer = setTimeout(function() {
            // if(isLoad) {
            //   oLoading.toggle(false);
            // }else{
              oLoading.toggle(true);
            // }
          }, nDelay);
        }
      }
    , loadEnd: function() {
        if (--nCount <= 0) {
          clearTimeout(timer);
          timer = null;
          oLoading.toggle(false);
        }
      }
    };
    $.sub('loader/ajax/start.ui', oLoading.loadBegin);
    $.sub('loader/ajax/always.ui', oLoading.loadEnd);

    ui.oLoading = oLoading;
  }(ui, system);

  // 下拉刷新
  var setRefreshHeaderInfo = function(options, callback) {
    options = yp.mix({
      visible: true
    , loadingImgae: 'widget://image/refresh-white.png'
    , bgColor: '#ccc'
    , textColor: '#fff'
    , textDown: '下拉试试...'
    , textUp: '松开试试...'
    , showTime: true
    }, options);
    system.setRefreshHeaderInfo(options, callback);
  };
  exports.setRefreshHeaderInfo = ui.setRefreshHeaderInfo = setRefreshHeaderInfo;

  // 监听错误消息
  $.sub('error/ui.ui', function(e, msg) {
    var e = $.Event('yp/ui/error/' + msg.code)
    yp.pub(e, msg.data);
    if (e.isDefaultPrevented()) return;
    alert(msg.message);
  });
  $.sub('error/sys.ui', function(e, msg) {
    throw new Error('yp提示：' + msg.message);
  });

  // 系统异常错误提示
  yp.sub('page/error/sys.ui.event', function(e, data) {
    $.pub('error/sys', data);
  });
}($, yp);

/* 系统函数模块 */
+function($, yp, noapi) {
var
  win = this
, exports = yp
, system = exports.system
, isPC = (/Windows NT/gi).test(navigator.appVersion);

  yp.each([
    'ajax'
  , 'showProgress'
  , 'hideProgress'
  , 'alert'
  , 'confirm'
  , 'setRefreshHeaderInfo'
  , 'refreshHeaderLoadDone'
  ], function(name) {
    system[name] = function() {
      api[name].apply(api, arguments);
    };
  });

  // 浏览器模拟
  if (isPC) {
    +function() {
      var oApi = {}
      yp.each([
        'showProgress'// loading条
      , 'hideProgress'
      , 'alert'// 对话框
      , 'confirm'
      , 'setRefreshHeaderInfo'// 下拉加载
      , 'refreshHeaderLoadDone'
      , 'getPicture'
      , 'addEventListener'
      , 'execScript'
      , 'closeWin'
      , 'require'
      ], function(name) {
        oApi[name] = yp.noop;
      });
      oApi.ajax = function(options, callback) {
        options.data = options.data && options.data.values;///
        $.ajax(options)
        .done(function(msg) {
          callback(msg);
        });
      };
      oApi.alert = oApi.toast = function(options) {
        alert(options.msg);
      };
      oApi.openWin = function(options) {
        location.href = options.url;
      };
      oApi.require = function(options) {
        return {
          playVideo: yp.noop
        , showInputView: yp.noop
        , sendGiftToAnchor: yp.noop
        };
      };
      oApi.systemVersion = '';

      setTimeout(function() {
        apiready();
      }, 500);

      win.api = oApi;
    }();
  }

  /*$.sub('loader/ready/before.system', function() {
    exports.system = api;
  });*/
}($, yp);