/* =============================================
 * v20141019.2
 * =============================================
 * Copyright Napster
 *
 * 直播间代码
 * ============================================= */

var selfGid = '', fansTitle = '';

apiready = function(){
  var ui = {
     $gameName : $('#gameName')
    ,$anchorName : $('#anchorName')
    ,$topLogo : $('#topLogo')
    ,$gameList : $('#gameList')
    ,$liveList : $('#liveList')


    ,$chatList : $('#chatList')
    ,$giftList : $('#giftList')


  }

  var aFaceList = {
    '害羞': '1',
    '鄙视': '2',
    '发怒': '3',
    '微笑': '5',
    '阴险': '6',
    '流泪': '7',
    '大兵': '9',
    '困': '10',
    '猪头': '12',
    '奋斗': '13',
    '坏笑': '14',
    '晕': '15',
    '鼓掌': '16',
    '酷': '17',
    '色': '18',
    '发呆': '19',
    '惊讶': '20',
    '白眼': '21',
    '抓狂': '22',
    '憨笑': '23',
    '傲慢': '24',
    '敲打': '25',
    '衰': '26',
    '呲牙': '28',
    '惊恐': '29',
    '可怜': '30',
    '流汗': '31',
    '疑问': '32',
    '偷笑': '33',
    '撇嘴': '35'
  }

  // var fansTitle = yp.query('fansTitle');

  var giftConfig = {}, giftCount = 1, giftId = '';  //礼物配置

  var selfUid = $api.getStorage('user') || 0;

  var zhanqi = api.require('zhanqiMD');

  var curWhich = '';
  var oPage = {
    init : function() {
      this.view();
      this.listen();

      api.openFrame({
          name: 'gift',
          url: '../html/gift.html?id='+yp.query('id'),
          rect:{
              x:0,
              y:api.frameHeight - 330 - 50,
              w:api.frameWidth,
              h:330
          },
          pageParam: {name: 'test'},
          bounces: true,
          opaque: false,
          bgColor: 'rgba(0,0,0,0)',
          vScrollBarEnabled:true,
          hScrollBarEnabled:true
      });

      api.setFrameAttr({
        name: 'gift',
        hidden: true
      });
    },

    view : function() {
      //初始化
      if(api.systemType === 'ios') {
        $('body').height(api.frameHeight*window.devicePixelRatio).css('padding-top',api.frameWidth*9/16*window.devicePixelRatio + 20*window.devicePixelRatio);
        $('#liveRoom').height(api.frameHeight*window.devicePixelRatio - api.frameWidth*9/16*window.devicePixelRatio - 50*window.devicePixelRatio);
      }else{
        $('body').height(api.frameHeight).css('padding-top',api.frameWidth*9/16 + 20);
        $('#liveRoom').height(api.frameHeight - api.frameWidth*9/16 - 50);
      }
      
      var roomId = yp.query('id');

      this.initNativeModel(roomId);

      this.initSettins();
      this.getGiftList(roomId);
      this.setRecord(roomId);  //写入观看历史
    },

    initNativeModel : function(roomId) {
      var headPos = 0;
      if(api.systemType == 'ios') {
        headPos = 20
      }
      var param = {
         'token' : $api.getStorage('user')?$api.getStorage('user')['token'] : ''
        ,'x' : 0
        ,'y' : headPos
        ,'w' : api.frameWidth
        ,'h' : api.frameWidth*9/16
        ,'roomId' : roomId
        ,'fixedOn' : 'rooms'

        ,'_x' : 0
        ,'_y' : api.frameHeight - 50
        ,'_w' : api.frameWidth
        ,'_h' : 50
      }
      
      zhanqi.playVideo(param);

      yp.ajax({
          url: URLConfig('switch'),
          method: 'get',
          dataType: 'json',
          notLoad: true
      },function(ret,err){
        if(ret['code'] == 0) {
          var param2 = {
             'x' : 0
            ,'y' : api.frameHeight - 50
            ,'w' : api.frameWidth
            ,'h' : 50
            ,'fixedOn' : 'rooms'
          }
          if(ret['data']['switch'] == 0) {
            param2['hideGift'] = true;
          }else{
            param2['hideGift'] = false;
          }
          zhanqi.showInputView(param2);
        }
      });

        
    },

    initSettins : function() {
      var data = $api.getStorage('settings');
      if(data) {
        data['submit'] = false;
        zhanqi.onGetSettingDataFromWeb(data);
      }else{
       var settings = {
           barrage : true //弹幕开关
          ,opacity : 1 //弹幕透明度
          ,size : 1 //弹幕大小
          ,pos : 1 //弹幕位置
          ,definition : 1 //清晰度选择
          ,lookBack : false //回看功能
          ,model : 0 //模式选择
          ,submit : false 
        }
        zhanqi.onGetSettingDataFromWeb(settings);
      }
    },

    listen : function()　{
      var self = this;

      //点击聊天区域隐藏分享
      $('#liveRoom').on('click',  function() {
        api.closeFrame({
          name: 'share'
        });
        zhanqi.closeGiftFrame({});
      });

      //选择礼物
      $('#giftList').on('click',  'li', function() {
          if(giftConfig[this.id]) {
            $('#giftName').text(giftConfig[this.id]['name'])
            $('#giftCount').text(giftConfig[this.id]['exp'])
          }
          return false;
      });

      //赠送按钮
      $('#sendGift').on('click',  function() {
        var count = giftCount;
        zhanqi.sendGiftToAnchor({
           count : giftCount
          ,gift : giftId
        });
        $('#giftPop').addClass('hidden');
      });
    },

    getGiftList : function(id) {
      var self = this;
      yp.ajax({
          url: URLConfig('getGiftList',{'roomid':id}),
          method: 'get',
          dataType: 'json',
          notLoad: true
      },function(ret,err){
        self.renderGiftList(ret['data']);
      });
    },

    setRecord : function(roomId) {
      yp.ajax({
          url: URLConfig('recordWatch',{'roomid':roomId}),
          method: 'get',
          dataType: 'json',
          notLoad: true
      },$.noop);
    },

    renderGiftList : function(data) {
      var htmlStr = '';
      
      for(var i=0; i<data.length; i++) {
        htmlStr += '<li name="gift" id="'+data[i]['id']+'">'
        +'<div class="gift-border"><img src="'+data[i]['image']+'" class="gift-icon"></div>'
        +'<p>'+data[i]['name']+'</p>'
        +'</li>'
        giftConfig[data[i]['id']] = data[i];
      }
      ui.$giftList.html(htmlStr);

      //初始化数值
      // var countArr = ['其他',520,233,10], htmlStr = '';
      // for(var i=0; i<countArr.length; i++) {
      //   htmlStr += '<li>'+countArr[i]+'</li>'
      // }

      // $('#countList').html(htmlStr);

      var lId = $('#giftList').find('li').last().attr('id');
      if(giftConfig[lId]) {
        $('#giftName').text(giftConfig[lId]['name'])
        $('#giftCount').text(giftConfig[lId]['exp'])
      }
      giftId = lId;
    },

    putChatToDom: function(message) {
      var content = message['content'] || message['c'];
      if (content && typeof content.replace === 'function') {
        content = content.replace(/\[\W+?\]/g, function(v) {
          var key = v.replace(/\[|\]/g, '')
          if (aFaceList[key]) {
            return '<img class="qq-face" src="../image/qq-face/' + aFaceList[key] + '.gif">'
          } else {
            return v;
          }
        })
      }
      // alert([selfGid, message['gid']])
      var htmlStr = '';
      if(message['showmedal'] == 1) {  //显示勋章
        if(selfGid == message['gid']) {//是否自己
          htmlStr += '<li class="myself">';
          if(message['level']) {
            htmlStr += '<span class="name"><i class="name-bg grade-'+ message['level'] +'">'+fansTitle+'</i>'+ message['fromname'] +'：</span>'+content +'</li>'
          }else{
            htmlStr += '<span class="name">'+ message['fromname'] +'：</span>'+content +'</li>'
          }
        }else{
          switch(message['permission']) {
            case 40:  //超管
              if(message['level']) {
                htmlStr += '<li class="super-dmin">'
                      +'<span class="name"><i class="name-bg admin">超管</i><i class="name-bg grade-'+ message['level'] +'"">'+fansTitle+'</i>'+ message['fromname'] +'：</span>'
                      + content +'</li>'
              }else{
                htmlStr += '<li class="super-dmin">'
                      +'<span class="name"><i class="name-bg admin">超管</i>'+ message['fromname'] +'：</span>'
                      + content +'</li>'
              }
              
              break;
            case 30: //主播
              if(message['level']) {
                htmlStr += '<li class="super-dmin">'
                      +'<span class="name"><i class="name-bg anchor">主播</i><i class="name-bg grade-'+ message['level'] +'"">'+fansTitle+'</i>'+ message['fromname'] +'：</span>'
                      + content +'</li>'
              }else{
                htmlStr += '<li class="super-dmin">'
                      +'<span class="name"><i class="name-bg anchor">主播</i>'+ message['fromname'] +'：</span>'
                      + content +'</li>'
              }
              
              break;
            case 20:  //正式  房管
              if(message['level']) {
                htmlStr += '<li class="super-dmin">'
                      +'<span class="name"><i class="name-bg admin">房管</i><i class="name-bg grade-'+ message['level'] +'"">'+fansTitle+'</i>'+ message['fromname'] +'：</span>'
                      + content +'</li>'
              }else{
                htmlStr += '<li class="super-dmin">'
                      +'<span class="name"><i class="name-bg admin">房管</i>'+ message['fromname'] +'：</span>'
                      + content +'</li>'
              }
              break;
            case 10:  //临时  房管
              htmlStr += '<li class="super-dmin">'
                      +'<span class="name"><i class="name-bg admin">房管</i>'+ message['fromname'] +'：</span>'
                      + content +'</li>'
              break;
            case 1:  //用户
              if(message['level']) {
                htmlStr += '<li>'
                  +'<span class="name"><i class="name-bg grade-'+ message['level'] +'"">'+fansTitle+'</i>'+ message['fromname'] +'：</span>'
                  + content +'</li>'
              }else{
                htmlStr += '<li>'
                  +'<span class="name">'+ message['fromname'] +'：</span>'
                  + content +'</li>'
              }
              break;
            case 0:  //游客
              htmlStr += '<li>'
                      +'<span class="name">'+ message['fromname'] +'：</span>'
                      + content +'</li>'
              break;
          }
        }
      }else{
        if(selfGid == message['gid']) {   //是否自己
          htmlStr += '<li class="myself">'
          +'<span class="name">'+ message['fromname'] +'：</span>' + content + '</li>'
          
        }else{
          switch(message['permission']) {
            case 40:  //超管
              htmlStr += '<li class="super-dmin">'
                      +'<span class="name"><i class="name-bg admin">超管</i>'+ message['fromname'] +'：</span>'
                      + content +'</li>'
              break;
            case 30: //主播
              htmlStr += '<li class="super-dmin">'
                      +'<span class="name"><i class="name-bg anchor">主播</i>'+ message['fromname'] +'：</span>'
                      + content +'</li>'
              break;
            case 20:  //正式  房管
              htmlStr += '<li class="super-dmin">'
                      +'<span class="name"><i class="name-bg admin">房管</i>'+ message['fromname'] +'：</span>'
                      + content +'</li>'
              break;
            case 10:  //临时  房管
              htmlStr += '<li class="super-dmin">'
                      +'<span class="name"><i class="name-bg admin">房管</i>'+ message['fromname'] +'：</span>'
                      + content +'</li>'
              break;
            case 1:  //用户
              htmlStr += '<li>'
                      +'<span class="name">'+ message['fromname'] +'：</span>'
                      + content +'</li>'
              break;
            case 0:  //游客
              htmlStr += '<li>'
                      +'<span class="name">'+ message['fromname'] +'：</span>'
                      + content +'</li>'
              break;
          }
          
        }
      }
      
      ui.$chatList.find('ul').append(htmlStr);
      ui.$chatList.scrollTop( ui.$chatList[0].scrollHeight );
    },

    putGiftDom : function(data) {
      var htmlStr = '';
      if(typeof data == 'string') {
        data = eval('('+data+')');
      }
      data = data['data'];

      if(selfGid == data['gid']) {
        if(data['show'] == 1) {
          htmlStr += '<li class="myself">'
              +  '  <span class="name">'
              +  '    <i class="name-bg grade-'+data['level']+'">'+fansTitle+'</i>'
              +  '  </span>'+data['nickname']+'送给主播<i class="count">' + data['count'] +'</i>'+ data['classifier']
              +  '  <img src="'+data['icon']+'" alt="" class="gift-icon">'
              // +  '  <i class="count">'+data['count']+'</i>'
              +  '</li>'
        }else{
          htmlStr += '<li class="myself">'
              +  '  <span class="name">'
              +  '  </span>'+data['nickname']+'送给主播<i class="count">' + data['count'] +'</i>'+ data['classifier']
              +  '  <img src="'+data['icon']+'" alt="" class="gift-icon">'
              // +  '  <i class="count">'+data['count']+'</i>'
              +  '</li>'
        }
        
      }else{
        if(data['show'] == 1) {
          htmlStr += '<li>'
              +  '  <span class="name">'
              +  '    <i class="name-bg grade-'+data['level']+'">'+fansTitle+'</i>'
              +  '  </span>'+data['nickname']+'送给主播<i class="count">' + data['count'] +'</i>'+ data['classifier']
              +  '  <img src="'+data['icon']+'" alt="" class="gift-icon">'
              // +  '  <i class="count">'+data['count']+'</i>'
              +  '</li>'
        }else{
          htmlStr += '<li>'
              +  '  <span class="name">'
              +  '  </span>'+data['nickname']+'送给主播<i class="count">' + data['count'] +'</i>'+ data['classifier']
              +  '  <img src="'+data['icon']+'" alt="" class="gift-icon">'
              // +  '  <i class="count">'+data['count']+'</i>'
              +  '</li>'
        }
        
      }
      ui.$chatList.find('ul').append(htmlStr);
      ui.$chatList.scrollTop( ui.$chatList[0].scrollHeight );
    }


  }


  oPage.init();

  window.onRecvChatMsg = function(data) {
      if(typeof data == 'string') {
        data = eval('('+data+')');
      }
      if(data['cmdid'] == 'Gift.Use') {
        oPage.putGiftDom(data);  //礼物
      }else if(data['cmdid'] == 'chatmessage'){
        oPage.putChatToDom(data);
      }
  }

  window.onBtnBack = function() {
    api.closeWin();

    api.setFrameAttr({
      name: 'gift',
      hidden: true
    });
  }
  //打开礼物界面  
  window.onGiftBtnPressed = function() {
    api.setFrameAttr({
      name: 'gift',
      hidden: false
    });
    // api.bringFrameToFront({
    //   from:'gift'
    // });
  }

  //打开分享界面
  window.onShareBtnPressed = function(data) {
    if(typeof data == 'string')
      data = eval('('+data+')');
      api.openFrame({
        name: 'share',
        url: '../html/share.html?id='+yp.query('id'),
        rect:{
            x:0,
            y:api.frameHeight - 200 - 50,
            w:api.frameWidth,
            h:200
        },
        pageParam: {'domain' : data['domain'], 'title' : data['title'], 'imgUrl' : data['bpic']},
        bounces: true,
        opaque: false,
        bgColor: 'rgba(0,0,0,0)',
        vScrollBarEnabled:true,
        hScrollBarEnabled:true
    });
  }

  // window.onSettingsBtnPressed = function() {
  //   api.openWin({name:'settings',url:'../html/settings.html',delay:300,bgColor:'#FFF'});
  // }

  window.onSelfGidBack = function(gid) {
    selfGid = gid;
  }

  //登录 注册成功返回
  // window.onLoginSuccess = function() {

  // }


  //调用页面接口
  window.onOpenWin = function(pageName) {
    api.openWin({name:pageName,url:'../html/'+pageName+'.html?isRoom=true',delay:300,bgColor:'#FFF'});
  }

  // 页面消失时触发
  // api.addEventListener({name:'viewdisappear'}, function(ret, err){
  //   zhanqi.destroy({});
  // });

}

function loginBackScript() {
    var zhanqi = api.require('zhanqiMD');
    var data = $api.getStorage('userParam');
    $('#chatList').find('ul').html('');
    zhanqi.onLoginSuccess(data);
}

function sendGiftBack(){
    var zhanqi = api.require('zhanqiMD');
    var data = $api.getStorage('sendGiftParam');
    zhanqi.sendGiftToAnchor(data);

}

function closeGiftFrame() {
    // api.closeFrame({
    //  name: 'gift'
    //  });
    api.setFrameAttr({
      name: 'gift',
      hidden: true
    });

    api.closeFrame({
     name: 'share'
    });
}

function changeGiftStatus() {
  var zhanqi = api.require('zhanqiMD');
  zhanqi.closeGiftFrame({});
}


function reqNewTokenFromJS() {
  silenceLoginFn('rooms', 'onTokenUpdated', true, 'failBack');  
}

function onTokenUpdated() {
  var newToken = $api.getStorage('user')['token'];
  var zhanqi = api.require('zhanqiMD');
  zhanqi.onTokenUpdated({'token' : newToken});
}

function failBack() {
  var zhanqi = api.require('zhanqiMD');
  zhanqi.onTokenUpdated({'token' : ''});
}

function getRoomInfo(data) {
  if(typeof data == 'string') {
    data = eval('('+data+')');
  }
  fansTitle = data['fansTitle'];
  $('#anchorName').text(data['nickname']);
}

function setScreenOriention(data)
{
  if(typeof data == 'string') {
    data = eval('('+data+')');
  }
  direction = data['direction'];
  if(api) {
    api.setScreenOrientation({
     orientation: direction
    });  
  }
}



// rapters1983@hotmail.com

// poacher1983