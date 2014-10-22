/* =============================================
 * v20141019.2
 * =============================================
 * Copyright Napster
 *
 * 直播间代码
 * ============================================= */

var selfGid = '';

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

  var fansTitle = yp.query('fansTitle');

  var giftConfig = {}, giftCount = 1, giftId = '';  //礼物配置

  var selfUid = $api.getStorage('user') || 0;

  var zhanqi = api.require('zhanqiMD');

  var curWhich = '';
  var oPage = {
    init : function() {
      this.view();
      this.listen();
    },

    view : function() {
      //初始化
      $('body').height(api.frameHeight*2).css('padding-top',api.frameWidth*9/16*2 + 20*2);
      $('#liveRoom').height(api.frameHeight*2 - api.frameWidth*9/16*2 - 50*2 -20*2);
      
      var gameId = yp.query('id');

      if(yp.query('which') === 'LIVE') {
        curWhich = 'live';
        this.getInitData(URLConfig('liveRoomInfo',{'roomid' : gameId}));
      }else{
        curWhich = 'video';
        this.getInitData(URLConfig('videoRoomInfo',{'roomid' : gameId}));
      }

      this.initSettins();
      this.getGiftList(gameId);
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

      // $('#liveRoom').on('click',  function() {
      //   alert(67676)
        
      //   $('#giftPop').removeClass('hidden');
      //   return false;
      // });

      // $('html, body').on('click', function() {
      //   $('#giftPop').addClass('hidden')
      // })

      //选择礼物
      $('#giftList').on('click',  'li', function() {
          if(giftConfig[this.id]) {
            $('#giftName').text(giftConfig[this.id]['name'])
            $('#giftCount').text(giftConfig[this.id]['exp'])
          }
          return false;
      });

      //数量选择
      $('#inputCount').on('click',  function() {
        $('#countPop').removeClass('hidden');
        return false;
      });

      //数量值监听
      $('#countList').on('click', 'li', function() {
        var count = $(this).text();
        if(count == '其他') {
          $('#inputCount').html('<input id="otherCount" type="number" />');
          $('#inputCount').find('input').focus();
        }else{
          giftCount = $(this).text();
          $('#inputCount').text(giftCount);
        }
        $('#countPop').addClass('hidden');
      });


      //其他
      $(document).on('blur', '#otherCount', function() {
        var count = $(this).val();
        if(count == '') {
          $('#inputCount').text(1);
          giftCount = 1;
          return false;
        }
        if(+count > 9999) {
          alert('最多送9999个');
          $(this).val('').focus();
          return false;
        }else{
          giftCount = count;
        }
      })

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
    // oPageConfig.oRoom.fansTitle
    getInitData : function(url) {
      api.ajax({
          url: url,
          method: 'get',
          dataType: 'json'
      },function(ret,err){
          var param = {
             'channelTitle' : ret['data']['title']
            ,'roomId' : ret['data']['id']
            ,'gameId' : ret['data']['gameId']
            ,'avatar' : ret['data']['avatar']
            ,'uid' : ret['data']['uid']
            ,'nickname' : ret['data']['nickname']
            ,'gameName' : ret['data']['gameName']
            ,'online' : ret['data']['realOnline']
            ,'liveStatus' : ret['data']['status']
            ,'token' : $api.getStorage('user')?$api.getStorage('user')['token'] : ''

            ,'x' : 0
            ,'y' : 0
            ,'w' : api.frameWidth
            ,'h' : api.frameWidth*9/16
          }
          ui.$anchorName.text(ret['data']['nickname']);
          if(api.systemVersion.indexOf('7.') > -1 || api.systemVersion.indexOf('8.') > -1) {
            param['y'] = 20;
          }
          
          zhanqi.playVideo(param);
          var param2 = {
             'x' : 0
            ,'y' : api.frameHeight - 50
            ,'w' : api.frameWidth
            ,'h' : 50
          }
          zhanqi.showInputView(param2);

      });
    },

    getGiftList : function(id) {
      var self = this;
      api.ajax({
          url: URLConfig('getGiftList',{'roomid':id}),
          method: 'get',
          dataType: 'json'
      },function(ret,err){
        self.renderGiftList(ret['data']);
      });
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
      var countArr = ['其他',520,233,10], htmlStr = '';
      for(var i=0; i<countArr.length; i++) {
        htmlStr += '<li>'+countArr[i]+'</li>'
      }

      $('#countList').html(htmlStr);

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
          htmlStr += '<li class="myself">'
          +'<span class="name"><i class="name-bg grade-'+ message['level'] +'">'+fansTitle+'</i>'+ message['fromname'] +'：</span>'
          + content +'</li>'
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
                      +'<span class="name"><i class="name-bg grade-'+ message['level'] +'"">'+fansTitle+'</i>'+ message['fromname'] +'：</span>'
                      + content +'</li>'
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
          +'<span class="name"><i class="name-bg grade-'+ message['level'] +'">'+fansTitle+'</i>'+ message['fromname'] +'：</span>' + content + '</li>'
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
                      +'<span class="name"><i class="name-bg grade-'+ message['rank'] +'"">'+fansTitle+'</i>'+ message['fromname'] +'：</span>'
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
  }

  window.onGiftBtnPressed = function() {
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
    api.closeFrame({
     name: 'gift'
     });
}

function changeGfitStatus() {
    var zhanqi = api.require('zhanqiMD');
    zhanqi.closeGiftFrame({});
}


function reqNewTokenFromJS() {
  silenceLoginFn('rooms', 'onTokenUpdated');  
}

function onTokenUpdated() {
  $api.setStorage('user', ret['data']);
  var newToken = $api.getStorage('user')['token'];
  var zhanqi = api.require('zhanqiMD');
  zhanqi.onTokenUpdated({'token' : newToken});
}
// rapters1983@hotmail.com

// poacher1983