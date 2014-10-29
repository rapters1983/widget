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
    headPos = $('#head').outerHeight()/window.devicePixelRatio;
    height = api.winHeight - $('#head').outerHeight()/window.devicePixelRatio - $('#footer').outerHeight()/window.devicePixelRatio;
  } else {
    height =  api.winHeight - $('#head').outerHeight() - $('#footer').outerHeight();
  }
  
  if(api.systemType === 'ios') {  //IOS
    if(!(api.systemVersion.indexOf('7.') > -1) && !(api.systemVersion.indexOf('8.') > -1)) {
      height = height - window.devicePixelRatio*25
    }
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
        var headPos = 170/2 , height = api.winHeight;
        if(api.systemType === 'ios') {
          // height = (api.frameHeight*window.devicePixelRatio - headPos - $('#footer').outerHeight())/window.devicePixelRatio
          // height = api.winHeight - 220;
          height = api.winHeight -  $('#footer').outerHeight()/window.devicePixelRatio - 130/window.devicePixelRatio - 210/window.devicePixelRatio;
        } else {
          // height = api.frameHeight - headPos - $('#footer').outerHeight();
          // height = api.frameHeight - 220; 
          if(window.devicePixelRatio == 3) {
            height = api.frameHeight -  $('#footer').outerHeight()/window.devicePixelRatio - 65 - 105 - 50/window.devicePixelRatio - 20;
          }else{
            height = api.frameHeight -  $('#footer').outerHeight()/window.devicePixelRatio - 65 - 105 - 50/window.devicePixelRatio;
          }
        }

        var headPos = 105 + 65  //物理像素

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
var navClass = ['icon-home','icon-directseeding','icon-more','icon-my'];
function changeTabBar(idx){
  var activeClass = ['icon-home-line','icon-directseeding-line','icon-more-line','icon-my-line'];
  $('#footer-nav>li').removeClass('active');
  $('#footer-nav>li').eq(idx).addClass('active');
  for(var i=0; i<navClass.length; i++){
    $('#footer-nav').find('i').eq(i).addClass(activeClass[i]).removeClass(navClass[i]);
  }
  $('#footer-nav>li').eq(idx).find('i').addClass(navClass[idx]).removeClass(activeClass[idx]);
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
    height = parseInt(height - 50/window.devicePixelRatio);
  }
  //1 是底部线框

  if(api.systemType === 'ios') {  //IOS
    if(!(api.systemVersion.indexOf('7.') > -1) && !(api.systemVersion.indexOf('8.') > -1)) {
      height = height - window.devicePixelRatio*25
    }
  }else{  //Android
  }
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
      h: height
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

  // var zhanqi = api.require('zhanqiMD'); 
  // zhanqi.onAppStarted({});
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
      // var navClass = ['icon-home','icon-directseeding','icon-more','icon-my'];
      $('#footer-nav').on('click', 'li',function(){
        $self = $(this);
        var idx = $self.index();
        var frame = [
          'main'
        , 'live'
        , 'game'
        , 'home'
        ];
        openTab(frame[idx]);
        changeTabBar(idx);
      });
    }

  }
  oPage.init();
}