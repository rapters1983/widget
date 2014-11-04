function openFollows(){
  var user = $api.getStorage('user');
  if($.isEmptyObject(user)) {
    api.confirm({
      msg: '您尚未登录，是否现在登录？',
      buttons:[ '取消', '登录']
    },function(ret,err){
      if(ret.buttonIndex == 2){
        api.openWin({
          name:'landing',
          url:'./html/landing.html',
          delay:0,
          bgColor:'#FFF',
          animation: {
            type: 'movein',
            subType: 'from_bottom',
            duration: 300
          },
          pageParam: {name: 'subscribe'}
        });
      }
    });
  } else{
    api.openWin({
      name:'subscribe',
      url:'./html/subscribe.html',
      delay:0,
      bgColor:'#FFF'
    });
  }
}

function openSearch(){
  api.openWin({name:'search',url:'./html/search.html',delay:0,bgColor:'#FFF'});
}

//打开观看历史
function openHistory(){
  var user = $api.getStorage('user');
  if($.isEmptyObject(user)) {
    api.confirm({
      msg: '您尚未登录，是否现在登录？',
      buttons:[ '取消', '登录']
    },function(ret,err){
      if(ret.buttonIndex == 2){
        api.openWin({
          name:'landing',
          url:'./html/landing.html',
          delay:0,
          bgColor:'#FFF',
          animation: {
            type: 'movein',
            subType: 'from_bottom',
            duration: 300
          },
          pageParam: {name: 'home'}
        });
      }
    });
  } else{
    api.openWin({
      name: 'history',
      url: './html/history.html',
      delay: 300,
      bgColor: '#FFF'
    });
  }
}



//frame whether open
function isOpened(frmName){
  var i = 0;
  var len = window.frameArr.length;
  var mark = false;
  for(i; i<len; i++){
    if(window.frameArr[i] === frmName){
      mark = true;
      return mark;
    }
  }
  return mark;
}

function openTab(type, pageParam){
  
  var self = this;
  var width = api.winWidth;
  var headPos = $('#head').outerHeight();
  var height = 0;
  if(api.systemType === 'ios') {
    headPos = $('#head').outerHeight()/2;
    height = api.winHeight - $('#head').outerHeight()/2 - $('#footer').outerHeight()/2;
  } else {
    height =  api.winHeight - $('#head').outerHeight() - $('#footer').outerHeight();
  }
  var bounces = true;
  var vScrollBarEnabled = false;
  type = type || 'main';
  
  //默认把live关掉
  api.closeFrame({
    name: 'gameLive'
  });

  //默认把home-con放到后面
  if(type != 'home'){
    api.setFrameAttr({
      name: 'home-con',
      hidden: true
    });
  }
  //如果打开home页则不显示头部
  if(type == 'home'){
    headPos = 0;
    height = height + 64;
    bounces = false;
  }
  //record page id
  window.prevPid = window.curPid;
  window.curPid = type;

  if(window.prevPid !== window.curPid){
    if(isOpened(type)){
      api.setFrameAttr({
        name: type,
        hidden: false
      });
      if(type == 'home'){
        api.setFrameAttr({
          name: 'home-con',
          hidden: false
        });
      }
    }else{
      api.openFrame({
        name: type,
        url: './html/'+ type +'.html',
        bounces: bounces,
        opaque: true,
        vScrollBarEnabled: true,
        pageParam: pageParam,
        rect: {
          x: 0,
          y: headPos,
          w: width,
          h: height
        }
      });
      if(type == 'home'){
        var height = api.winHeight;
        if(api.systemType === 'ios') {
          height = api.winHeight -  $('#footer').outerHeight()/window.devicePixelRatio  - 105;
        } else {
          height = api.frameHeight -  $('#footer').outerHeight() - 105;
        }
        
        var headPos = 105;   //物理像素 头部

        api.openFrame({
          name: 'home-con',
          url: './html/home-con.html',
          bounces: true,
          opaque: true,
          vScrollBarEnabled: true,
          hScrollBarEnabled: true,
          rect: {
            x: 0,
            y: headPos,   //65 广告条 130+
            w: width,
            h: height
          }
        });
      }


    }
    if(window.prevPid){
      api.setFrameAttr({
        name: prevPid,
        hidden: true
      });
    }
    if(!isOpened(type)){
      //save frame name
      window.frameArr.push(type);
    }
  }
}
var curNav = 0;
function changeTabBar(idx){
  var activeClass = ['icon-home','icon-directseeding','icon-more','icon-my'];
  var navClass = ['icon-home-line','icon-directseeding-line','icon-more-line','icon-my-line'];
  var lastNav = curNav;
  curNav = idx;
  if(curNav != lastNav){
    $('#footer-nav li').eq(curNav).find('i').addClass(activeClass[curNav]).removeClass(navClass[curNav]);
    $('#footer-nav li').eq(lastNav).find('i').addClass(navClass[lastNav]).removeClass(activeClass[lastNav]);
    $('#footer-nav li').eq(curNav).addClass('active');
    $('#footer-nav li').eq(lastNav).removeClass('active');
  }else{
    return;
  }
}
function openLiveList(){
  openTab('live');
  changeTabBar(1);
}
function openGameList(){
  openTab('game');
  changeTabBar(2);
}
function openGameLive(){
  var self = this;
  var width = api.winWidth;
  var headPos = $('#head').outerHeight();
  var height = 0;
  if(api.systemType === 'ios') {
    headPos = $('#head').outerHeight()/window.devicePixelRatio;
    height = api.winHeight - $('#head').outerHeight()/window.devicePixelRatio - $('#footer').outerHeight()/window.devicePixelRatio;
  } else {
    height =  api.winHeight - $('#head').outerHeight() - $('#footer').outerHeight();
  }
  //1 是底部线框

  api.openFrame({
    name: 'gameLive',
    url: './html/gameLive.html',
    bounces: true,
    opaque: true,
    vScrollBarEnabled: false,
    pageParam: {},
    rect: {
      x: 0,
      y: headPos,
      w: width,
      h: parseInt(height)
    }
  });
  if(window.curPid){
    api.setFrameAttr({
      name: window.curPid
    , hidden: true
    });
    window.curPid = 'gameLive';
  }
  changeTabBar(2);
}

//点击logo返回首页并刷新
function openMain(){
  var i = 0;
  var len = window.frameArr.length;
  var newarr = [];
  for(i; i<len; i++){
    if(window.frameArr[i] != 'main'){
      newarr.push(window.frameArr[i]);
    }
  }
  window.frameArr = newarr;
  //默认把live关掉
  api.closeFrame({
    name: 'main'
  });
  if(window.curPid == 'main'){
    window.curPid = '';
  }
  openTab('main');
  changeTabBar(0);
}

function fCheckLogin() {
  var user = $api.getStorage('user');
  var password = $api.getStorage('password');
  if(!user || !password) return;
  yp.ajax({
    url : URLConfig('login'),
    method : 'post',
    dataType : 'json',
    data: {
      values: {'account' : user['account'], 'password' : password}
    }
  }, function(ret, err) {
      if(!ret) return;
      if(ret.code == 0) {
        $api.setStorage('user', ret['data']);
      }
  });
}
apiready = function() {

  /* 默默登陆 */
  // 应用被重新打开时执行
  fCheckLogin();
  // 当应用从后台转到前台执行
  api.addEventListener({name:'resume'}, function(ret, err){
    fCheckLogin();
  });
  // api.addEventListener({name:'pause'}, function(ret, err){
  // });
  /* 默默登陆 end*/

  var ui = {
  }

  var zhanqi = api.require('zhanqiMD'); 
  zhanqi.onAppStarted({});
  var oPage = {
    init : function() {
      this.view();
      this.listen();
    },

    view : function() {
      var self = this;
      //已经打开的frame
      window.frameArr = [];
      //当前页面
      window.curPid = '';
      //上一张页面
      window.prevPid = '';

      //var obj = api.require('tabBar');
      // obj.open({
      //     bgImg:'widget://res/tabBar_bg.png',
      //     selectImg:'widget://res/selecte_tabBar.png',
      //     items:[
      //       {img:'widget://image/tabbar/home.png'},
      //       {img:'widget://image/tabbar/news-icon.png'},
      //       {img:'widget://image/tabbar/life-icon.png'},
      //       {img:'widget://image/tabbar/user-icon.png'}
      //     ]
      // },function(ret,err){
      //   var frame = [
      //     'main'
      //   , 'game'
      //   , 'live'
      //   , 'gamelist'
      //   ];
      //   openTab(frame[ret.index]);
      // });
      api.parseTapmode();
      //初始化打开main
      openTab('main');

    },
    listen : function()　{
      var self = this;
      $('#footer-nav').on('touchstart', 'li',function(e){
        e.preventDefault();
        $self = $(this);
        var idx = $self.index();
        var frame = [
          'main'
        , 'live'
        , 'game'
        , 'home'
        ];
        changeTabBar(idx);
        openTab(frame[idx]);
      });
    }

  }
  oPage.init();
}