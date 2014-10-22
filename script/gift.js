/* =============================================
 * v20141019.2
 * =============================================
 * Copyright Napster
 *
 * 送礼代码
 * ============================================= */

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

  var giftConfig = {}, giftCount = 1, giftId = '';  //礼物配置
  var coin = 0, gold = 0, coinEnable = 1, goldEnable = 1;  //财富是否可用 1 keyong  0 bukeyong
  
  var oPage = {
    init : function() {
      this.view();
      this.listen();
    },

    view : function() {
        
      this.getGiftList(yp.query('id'));
      this.getRich();
    },

    listen : function()　{
      var self = this;


      //选择礼物
      $('#giftList').on('click',  'li', function() {
          if(giftConfig[this.id]) {
            $('#giftName').text(giftConfig[this.id]['name'])
            $('#giftCount').text(giftConfig[this.id]['exp'])
            $('#giftList').find('li.active').removeClass('active');
            $(this).addClass('active');
            giftId = this.id;
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
      });

      //赠送按钮
      $('#sendGift').on('click',  function() {

        if(giftConfig[giftId]['coinType'] == 1) { //战旗币
          if(giftCount*giftConfig[giftId]['price'] > coin) {
            api.alert({
              title: '提示',
              msg: '战旗币不足！',
              buttons:[ '确定']
            });
            return;
          }
        }else{ //金币
          if(giftCount*giftConfig[giftId]['price'] > gold) {
            api.alert({
              title: '提示',
              msg: '金币不足！',
              buttons:[ '确定']
            });
            return;
          }
        }

        var sendGiftParam = {
           count : giftCount
          ,gift : giftId
        }

        $api.setStorage('sendGiftParam',sendGiftParam);
        
        api.execScript({
         name : 'rooms',
         script : 'sendGiftBack();'
        })
        api.closeFrame();

        api.execScript({
         name : 'rooms',
         script : 'changeGfitStatus();'
        });


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

    getRich : function() {
      var self = this;
      api.ajax({
          url: URLConfig('getRich'),
          method: 'get',
          dataType: 'json'
      },function(ret,err){
        if(ret['code'] == 0) {
          coin = ret['data']['coin']['count'];
          coinEnable = ret['data']['coin']['enable'];
          gold = ret['data']['gold']['count'];
          goldEnable = ret['data']['gold']['enable'];
        }else{
        }
      });
    },

    renderGiftList : function(data) {
      var htmlStr = '';
      for(var i=0; i<data.length; i++) {
        htmlStr += '<li name="gift" id="'+data[i]['id']+'">'
        +'<div class="gift-border"><img src="'+data[i]['mobileimg']+'" class="gift-icon"></div>'
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
        var lastLi = $('#giftList').find('li').last();
        var lId = lastLi.attr('id');
        lastLi.addClass('active');
        if(giftConfig[lId]) {
          $('#giftName').text(giftConfig[lId]['name'])
          $('#giftCount').text(giftConfig[lId]['price'])

          switch(giftConfig[lId]['coinType']) {
            case 1:
              $('#coinType').text('战旗币');
              break;
            case 2:
              $('#coinType').text('金币');
              break;
          }
        }
        giftId = lId;

      }

    
  }



  oPage.init();
}

