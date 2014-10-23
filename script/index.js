function isEmptyObject(o){
  for(var n in o){
    return false;
  }
  return true;
}
function openFollows(){
  var user = $api.getStorage('user');
  if(isEmptyObject(user)) {
    api.confirm({
      msg: '您尚未登录，是否现在登录？',
      buttons:[ '取消', '登录']
    },function(ret,err){
      if(ret.buttonIndex == 2){
        api.openWin({
          name:'landing',
          url:'./html/landing.html',
          delay:100,
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
      name:'subscribe',
      url:'./html/subscribe.html',
      delay:100,
      bgColor:'#FFF'
    });
  }
}
function openSearch(){
  api.openWin({name:'search',url:'./html/search.html',delay:300,bgColor:'#FFF'});
}

//打开历史记录
function openHistory(){
  api.openWin({name:'history',url:'./html/history.html',delay:300,bgColor:'#FFF'});
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
  // var navPos = $('#footer').offset().top;
  var headBottom = $('#head').offset().top + $('#head').height();
  var headPos = 64;
  var height = (api.winHeight*2 - headBottom - $('#footer').height())/2 - 1;
  if(api.systemType === 'android') {
    height = height - 25;
  }
  var bounces = true;
  var vScrollBarEnabled = false;
  type = type || 'main';

  //默认把live关掉
  api.closeFrame({
    name: 'gameLive'
  });

  //默认把home-con放到后面
  api.setFrameAttr({
    name: 'home-con',
    hidden: true
  });

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
function changeTabBar(idx){
  var navClass = ['icon-home','icon-directseeding','icon-more','icon-my'];
  var activeClass = ['icon-home-line','icon-directseeding-line','icon-more-line','icon-my-line'];
  $('#footer-nav>li').removeClass('active');
  $('#footer-nav>li').eq(idx).addClass('active');
  for(var i=0; i<navClass.length; i++){
    $('#footer-nav').find('i').eq(i).addClass(activeClass[i]).removeClass(navClass[i]);
  }
  $('#footer-nav>li').eq(idx).find('i').addClass(navClass[idx]).removeClass(activeClass[idx]);
}
function openMain(){
  openTab('main');
  changeTabBar(0);
}
function openGameList(){
  openTab('game');
  var navClass = ['icon-home','icon-directseeding','icon-more','icon-my'];
  changeTabBar(2);
}
function openGameLive(){
  var width = api.winWidth;
  var navPos = $('#footer').offset().top;
  var headPos = 64;
  var headBottom = $('#head').offset().top + $('#head').height();
  var height = (navPos - headBottom)*0.5;
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
  $('#footer-nav>li').removeClass('active');
  $('#footer-nav>li').eq(2).addClass('active');
  for(var i=0; i<navClass.length; i++){
    $('#footer-nav').find('i').eq(i).addClass(navClass[i]+'-line').removeClass(navClass[i]);
  }
  $('#footer-nav>li').eq(2).find('i').removeClass('icon-more-line').addClass('icon-more');
}


apiready = function() {

  var ui = {
  }

  //版本更新  IOS  统计
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
      var navClass = ['icon-home','icon-directseeding','icon-more','icon-my'];
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