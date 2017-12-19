    var socket = io.connect();
    var from = $.cookie('user');//从 cookie 中读取用户名，存于变量 from
    var to = 'all';//设置默认接收对象为"所有人"
    //发送用户上线信号
    socket.emit('online', {user: from});
    socket.on('online', function (data) {
      //显示系统消息
      if (data.user != from) {
        var sys = '<div class="system" style="color:#f00">' + '用户 ' + data.user + ' 上线了！(' + now() + ')</div>';
      } else {
        var sys = '<div class="system" style="color:#f00"> <span class="bold">'+from+'</span>   进入了聊天室！(' + now() + ')</div>';
      }
      $("#contents").append(sys + "<br/>");
      //刷新用户在线列表
      flushUsers(data.users);
      //显示正在对谁说话
      showSayTo();
      scroll();
    });
    //  用户发送信息
    socket.on('say', function (data) {
      //对所有人说
      if (data.to == 'all') {
        $("#contents").append('<div class="left"><div class="icon">'+data.from.substring(0,1)+'</div><div class="msg">' + data.msg + '</div><div class="time">'+now()+'</div></div><br />');
      }
      //对你密语
      if (data.to == from) {
        $("#contents").append('<div class="left secret"><div class="icon">'+data.from.substring(0,1)+'</div><div class="msg">' + data.msg + '</div><div class="tag">私</div><div class="time">'+now()+'</div></div><br />');
      }
      scroll();

    });
//  有人下线
    socket.on('offline', function (data) {
        if(typeof data.user =="undefined"){return ;}
        var sys = '<div class="system" style="color:#f00">' + '用户 ' + data.user + ' 下线了！(' + now() + ')</div>';
         $("#contents").append(sys + "<br/>");
         //刷新用户在线列表
         flushUsers(data.users);
         //如果正对某人聊天，该人却下线了
         if (data.user == to) {
           to = "all";
         }
         //显示正在对谁说话
         showSayTo();
         scroll();
    });
    //服务器关闭了
    socket.on('disconnect', function() {
      var sys = '<div style="color:#f00">系统:连接服务器失败！</div>';
      $("#contents").append(sys + "<br/>");
      $("#list").empty();
      scroll();
    });
    //重新启动服务器
    socket.on('reconnect', function() {
      var sys = '<div style="color:#f00">系统:重新连接服务器！</div>';
      $("#contents").append(sys + "<br/>");
      socket.emit('online', {user: from});
      scroll();
    });
    // 滚动到最下面
    function scroll(){
        var h = $("#contents").scrollTop();
        $("#contents").scrollTop(h+100);
    }

    //刷新用户在线列表
    function flushUsers(users) {
      //清空之前用户列表，添加 "所有人" 选项并默认为灰色选中效果
      $("#list").empty().append('<li title="双击聊天" alt="all" class="sayingto" onselectstart="return false">所有人</li>');
      //遍历生成用户在线列表
      $("#list").append('<li alt="' + from + '" title="双击聊天" class="myself" onselectstart="return false">' + from + '</li>');
      for (var i in users) {
          if(users[i]!==from){
                $("#list").append('<li alt="' + users[i] + '" title="双击聊天" onselectstart="return false">' + users[i] + '</li>');
          }
      }
      //双击对某人聊天
      $("#list > li").dblclick(function() {
        //如果不是双击的自己的名字
        if ($(this).attr('alt') != from) {
          //设置被双击的用户为说话对象
          to = $(this).attr('alt');
          //清除之前的选中效果
          $("#list > li").removeClass('sayingto');
          //给被双击的用户添加选中效果
          $(this).addClass('sayingto');
          //刷新正在对谁说话
          showSayTo();
        }
      });
    }

    //显示正在对谁说话
    function showSayTo() {
      $("#from").html(from);
      $("#to").html(to == "all" ? "所有人" : to);
    }
    //获取当前时间
    function now() {
      var date = new Date();
      var time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes()) + ":" + (date.getSeconds() < 10 ? ('0' + date.getSeconds()) : date.getSeconds());
      return time;
    }
