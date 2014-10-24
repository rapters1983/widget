/*
2014.10.18
每日一问
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
      //初始化内容高度
      $('#conWrap, .ask-page').height(api.winHeight*window.devicePixelRatio - $('.top-bar').height());
      fInitInfo();
    },
    listen: function()　{
      var self = this;

      $('.js-answer').on('click', function() {
        $(this).siblings('.active').removeClass('active').find('i').removeClass('icon-checked').addClass('icon-unchecked');
        $(this).addClass('active').find('i').removeClass('icon-unchecked').addClass('icon-checked');
      });

      // 提交
      $('#btn-submit').on('click', function() {
        var answer = 0;
        if($('#answerOne').hasClass('active')) {
          answer = 1;
        } else{
          answer = 2;
        }
        if(answer == 0) {
          api.alert({msg: '请选择问题答案！'});
          return;
        }
        yp.ajax({
          url: URLConfig('sDailyAskSubmitUrl')
        , method: 'post'
        , dataType: 'json'
        , data: {
            values: {
              'askKey': $('#title').data('askKey')
            , 'askId': $('#title').data('id')
            , 'answer': answer
            }
          }
        }, function(ret, err) {
          if(ret) {
            if(ret.code == 0) {
              api.closeWin();
            } else{
              api.alert({msg: ret.message});
            }
          } else{
            api.alert({msg: '网络似乎出现了异常'});
            // api.alert({
            //   msg:('错误码：'+err.code+'；错误信息：'+err.msg+'网络状态码：'+err.statusCode)
            // });
          }
        });
      });
    }
  }
  oPage.init();
}
// 初始化
function fInitInfo() {
  var data = api.pageParam;

  $('#title').html(data.question.title).data('id', data.question.id).data('askKey', data.question.askKey);
  $('#answerOne').find('span').text(data.question.answerOne);
  $('#answerTwo').find('span').text(data.question.answerTwo);
}