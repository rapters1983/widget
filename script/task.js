apiready = function(){
  var width = api.winWidth;
  var height = api.winHeight, headPos=0;
  if(api.systemType === 'android') {
    height = height - 25;
  }
  if(api.systemType === 'ios') {
    headPos = $('.top-bar').height()/window.devicePixelRatio;
  }else{
    headPos = $('.top-bar').height();
  }
  var conheight = height - headPos;
  api.addEventListener({name:'viewappear'}, function(ret, err){
    api.execScript({
      frameName: 'task-con',
      script: 'fInitInfo();'
    });
  });
  api.openFrame({
    name: 'task-con',
    url: '../html/task-con.html',
    bounces: true,
    opaque: true,
    vScrollBarEnabled: false,
    rect: {
      x: 0,
      y: headPos,
      w: width,
      h: conheight
    }
  });
}