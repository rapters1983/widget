/*
2014.10.18
我的钱包：充值记录和送礼记录
魏露霞
 */

// 参数配置
var oPageConfig = {
  pageSize: 10
, stime: ''
, etime: ''
, stype: 'charge'
, isEnding: false
, isNull: false
, start: 0
};
// 初始化
function fInitInfo(type) {
  oPageConfig.stype = type;
  objTime1 = getMonthArgs('curMonth');
  objTime2 = getMonthArgs('prevMonth');
  oPageConfig.etime = objTime1['etime'];
  oPageConfig.stime = objTime2['stime'];
  oPageConfig.start = 0;
  oPageConfig.isEnding = false;
  oPageConfig.isNull = false;
  fLoadData();
}
// 加载数据
function fLoadData() {
  if(oPageConfig.isEnding){
    return;
  }
  fGetDataIndex(URLConfig(oPageConfig.stype, {
      stime: oPageConfig.stime
    , etime: oPageConfig.etime
    , nums: oPageConfig.pageSize
    , start: oPageConfig.start
  }), function(data) {
      if(data['cnt'] == 0) {
        oPageConfig.isNull = true;
      }
      fRenderGameData(data['logs']);
      oPageConfig.start += data['logs'].length;
      if(data['cnt'] <= oPageConfig.start) {
        oPageConfig.isEnding = true;
      }
    });
}
// ajax
function fGetDataIndex(url, callback) {
  var timer = null;
  var nDelay = 500;
  if (!timer) {
    timer = setTimeout(function(){
      api.showProgress({
        style: 'default',
        animationType: 'fade',
        title: '努力加载中...',
        text: '先喝杯茶...',
        modal: false
      });
    }, nDelay);     
  }
  api.ajax({
    url : url,
    method : 'get',
    dataType : 'json'
  }, function(ret, err) {
      clearTimeout(timer);
      timer = null;
      api.hideProgress();
      if(ret) {
        if(ret['code'] == 0) {
          callback(ret['data']);
        } else{
          api.alert({msg : ret['message']});
        }
      } else{
        api.alert({
          msg:('错误码：'+err.code+'；错误信息：'+err.msg+'网络状态码：'+err.statusCode)
        });
      }
    });
  api.refreshHeaderLoadDone();
}
// 渲染数据
function fRenderGameData(data) {
  var htmlStr = '';
  if(oPageConfig.isNull) {
    htmlStr = '<div class="record-no">暂无记录</div>';
  } else{
    var odata = fHashData(data);
    for(var d in odata) {
      htmlStr += '<div class="group"><div class="til">' + d + '</div><ul class="record-list">';
      for(var i = 0, l = odata[d].length; i < l; i++) {
        var order = odata[d][i];
        if(oPageConfig.stype == 'charge') {
          var status = '';
          switch(order['status']){
            case -1:
              status = '<p class="error">查询失败</p>'
              break;
            case 0:
              status = '<p class="error">充值失败</p>';
              break;
            case 1:
              status = '<p class="error">发货失败</p>'
              break;
            case 2:
              status = '<p>充值成功</p>'
              break;
          }
          htmlStr += '<li>'+
                        '<div class="state">'+
                          '<p class="error">' + status + '</p>'+
                          '<p>' + fGetTimeFormat(order['dateline']) + '</p>'+
                        '</div>'+
                        '<p class="count">充值<span class="money">' + order['totalFee'] + '</span>元--'+ order['insitDesc'] +'</p>'+
                        '<p class="mark">' + order['orderId'] + '</p>'+
                      '</li>';
        } else{
          htmlStr += '<li>'+
            '<p class="count">'+ oPageConfig.username +'*<span class="money">' + order['count'] + '</span></p>'+
            '<p class="mark"><span class="time">' + fGetTimeFormat(order['dateline']) + '</span>送给' + order['nickname'] + '</p>'+
          '</li>';
        }
      }
      htmlStr += '</ul></div>';
    }
  }
  if(oPageConfig.start == 0) {
    $('#content').empty();
  }
  $('#content').append(htmlStr);
}
// hash
function fHashData(data) {
  var odata = {};
  for(var i = 0, l = data.length; i < l; i++) {
    var s = fGetYMDFormat(data[i]['dateline']);
    if(odata[s]) {
      odata[s].push(data[i]);
    } else{
      odata[s] = [data[i]];
    }
  }
  return odata;
}
// 获取时间，格式：小时:分钟
function fGetTimeFormat(time) {
  return time.slice(11, 16);
}
// 获取时间，格式：年-月-日
function fGetYMDFormat(time) {
  return time.slice(0, 10);   
}
function getMonthArgs(whichMonth) {
  var stime = '', etime = '';
  var date = new Date();
  if(whichMonth === 'curMonth') {
    stime = date.getOtherDate(-date.getDate() + 1)
    etime = date.Format('yyyy-MM-dd');
  }else{
    stime = date.getOtherDate(-date.getDate()).substring(0,7)+'-01';
    etime = date.getOtherDate(-date.getDate())
  }
  return {stime : stime, etime : etime};
}

apiready = function() {

  if($api.getStorage('user')) {
    oPageConfig.username = $api.getStorage('user').nickname;
  }

  api.setRefreshHeaderInfo({
    visible: true,
    loadingImgae: 'widget://image/refresh-white.png',
    bgColor: '#ccc',
    textColor: '#fff',
    textDown: '下拉试试...',
    textUp: '松开试试...',
    showTime: true
  }, function(ret, err){
    objTime1 = getMonthArgs('curMonth');
    objTime2 = getMonthArgs('prevMonth');
    oPageConfig.etime = objTime1['etime'];
    oPageConfig.stime = objTime2['stime'];
    oPageConfig.start = 0;
    oPageConfig.isEnding = false;
    oPageConfig.isNull = false;
    fLoadData();
  });

  fInitInfo('charge');

  $(window).scroll(function(){  
    // 当滚动到最底部以上100像素时， 加载新内容  
    if ($(document).height() - $(this).scrollTop() - $(this).height() < 200){
      fLoadData();
    }
  });
}

Date.prototype.Format = function(fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

Date.prototype.getOtherDate = function(n) {
  var nn = new Date();  
  nn.setDate(nn.getDate()+n);  
  year1 = nn.getFullYear();  
  mon1 = nn.getMonth() + 1;  
  date1 = nn.getDate();  
  var monstr1;  
  var datestr1  
  if (mon1 < 10)  
    monstr1 = "0" + mon1;  
  else  
    monstr1 = "" + mon1;  

  if (date1 < 10)  
    datestr1 = "0" + date1;  
  else  
    datestr1 = "" + date1;  
  return year1 + "-" + monstr1 + "-" + datestr1;
}

Date.prototype.getDays = function() {
  var date = new Date();
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  if(m == 2){
    return y % 4 == 0 ? 29 : 28;
  }else if(m == 1 || m == 3 || m == 5 || m == 7 || m == 8 || m == 10 || m == 12){
   return 31;
  }else{
    return 30;
  }
}
