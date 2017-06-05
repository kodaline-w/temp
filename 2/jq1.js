$(function(){
	$('#search_button').button({
		icons:{
			primary:'ui-icon-search',
		}
	});//按钮添加样式和icon
	//向数据库请求发送提问
	$('#question_button').button({
		icons:{
			primary:'ui-icon-lightbulb',
		}
	}).click(function(){
		if ($.cookie('user')) {
			$('.question').dialog({
			title:'提问',
			buttons:{
				'发布':function(){
				$(this).ajaxSubmit({
					url:'add_content.php',
					type:'POST',
					data:{
						url:$.cookie('user'),
					},
					beforeSubmit:function(formDate,jqForm,options){
					$('.question').dialog('widget').find('button').eq(1).button('disable');
				},//提交之前按钮不能操作
				success: function(responseText,statusText){
					if(responseText){
						alert('提问成功!')
						$('.question').dialog('widget').find('button').eq(1).button('enable');
						$('.question').dialog('close');
						$('.question').resetForm();
					} ;
				}
				});
				},
			},
				width:500,
				height:360,
				show:'puff',
				hide:'scale',
				//autoOpen : false,
				resizable: false,
				modal: true,
				closeText:'',

			});
		} else {
			alert('请登录');
		}
	});
//读取提问数据
	$.ajax({
		url:'show_content.php',
		type:'POST',
		success:function(response,status,xhr){
			var json=$.parseJSON(response);
			var html='';
			var arr=[];
			$.each(json,function(index,value){
				html+='<h4>'+value.user+'发表于'+value.date+'</h4><h3>'+value.title+'</h3><div class="editor">'+value.content+'</div><div class="buttom"><span class="comment">0条评论</span><span class="down">显示全部</span><span class="up">收起</span><hr  noshade="noshade" size="1" /></div><div class="content_list"><dl class="content_content"><dt>nila</dt><dd>一幅煞乱风景的残墨；顷刻间</dd><dd class="date">2017-10-1</dd></dl><dl class="comment_add"><dt><textarea name="comment"></textarea><dd><input type="button" class="fabiao" value="发表"></input></dd></dt></dl></div>';
			});

			$('.content').append(html);
			$.each($('.editor'),function(index,value){
				arr[index]=$(value).height();
				if ($(value).height()>155) {
					$(value).next('.buttom').find('.up').hide();
				};
				$(value).height(155);
			});
			$.each($('.buttom .down'),function(index,value){
				$(this).click(function(){
					$(this).parent().prev().height(arr[index]);
					$(this).hide();
					$(this).next().show();
				});
			});
			$.each($('.buttom .up'),function(index,value){
				$(this).click(function(){
					$(this).parent().prev().height(155);
					$(this).hide();
					$(this).prev().show();
				});
			});
			$('.comment_add input').button();
			$.each($('.buttom'),function(index,value){
				$(this).on('click','.comment',function(){
					if ($(this).parent().next().is(':hidden')) {
						$(this).parent().next().show();
					} else {
						$(this).parent().next().hide();
					}
					
				});
			});

		},
	});


//会员注册
	$('.member,.logout').hide();
	if ($.cookie('user')) {
			$('.member,.logout').show();
			$('#reg_a,#login_a').hide();
			$('.member').html($.cookie('user'));
		} else {
			$('.member,.logout').hide();
			$('#reg_a,#login_a').show();
		};
		$('.logout').click(function(){
			$.removeCookie('user');
			 window.location.reload();
		});

//会员注册框样式
	$('#reg_a').click(function(){
		$('.reg').dialog({
			title:'会员注册',
			buttons:{
				'提交':function(){
					$(this).submit()
				},
			},
			width:340,
			height:360,
			show:'puff',
			hide:'scale',
			//autoOpen : false,
			resizable: false,
			modal: true,
			closeText:'',

		})
	});
//会员注册请求
	$('.reg').buttonset().validate({
		submitHandler:function(form){
			$(form).ajaxSubmit({
				url:'add.php',
				type:'POST',
				beforeSubmit:function(formDate,jqForm,options){
					$('.reg').dialog('widget').find('button').eq(1).button('disable');
				},
				success: function(responseText,statusText){
					if(responseText){
						alert('新增成功!')
						$('.reg').dialog('widget').find('button').eq(1).button('enable');
						$.cookie('user',$('#user').val());
						$('.reg').dialog('close');
						$('.reg').resetForm();
						$('.member,.logout').show();
						$('#reg_a,#login_a').hide();
						$('.member').html($.cookie('user'));
						$('.reg span.star').html('*').removeClass('succ');
					} ;
				}
			})
		},
//提示框样式
		showErrors:function(errorMap,errorList){
			var errors=this.numberOfInvalids();
			if (errors>0) {
				$('.reg').dialog('option','height',errors*20+360);
			}else{
				$('.reg').dialog('option','height',360);
			}
			this.defaultShowErrors();//先执行默认的错误提示
		},
		highlight:function(element,errorClass){
			$(element).parent().find('span').html('*').removeClass('succ')
		},
		unhighlight:function(element,errorClass){
			$(element).parent().find('span').html('&nbsp;').addClass('succ')
		},
		errorLabelContainer:'ol.reg_error',
		wrapper:'li',
		rules:{
			user:{
				required:true,
				minlength:2,
				remote:{
					url:'is_user.php',
					type:'POST',
				},//验证账号是否被注册
				},
			pass:{
				required:true,
				minlength:6,
			},
			email:{
				required:true,
				minlength:true,
			}
			},
			messages:{
				user:{
					required:'名字不能为空',
					minlength:'最少2个字符',
					remote:'账号被占用！',
				},
				pass:{
					required:'密码不能为空',
					minlength:'最少6位'
				},
				email:{
					required:'邮箱不能为空',
					
				}
			}	
		});

	$('#date').datepicker();
	//文本提示框
	$('.reg input[title]').tooltip({
		show:false,
		hide:false,
		position:{
			my:'left+5 center',
			at:'right center'
		}
		
	});
	
//登录
$('#login_a').click(function(){
	$('.login').dialog({
			title:'请登录',
			buttons:{
				'登录':function(){
					$(this).submit()
				},
			},
			width:340,
			height:240,
			show:'puff',
			hide:'scale',
			//autoOpen : false,
			resizable: false,
			modal: true,
			closeText:'',

		})
	});

	$('.login').validate({
		submitHandler:function(form){
			$(form).ajaxSubmit({
				url:'login.php',
				type:'POST',
				beforeSubmit:function(formDate,jqForm,options){
					$('.login').dialog('widget').find('button').eq(1).button('disable');
				},
				success: function(responseText,statusText){
					if(responseText){
						alert('登录成功!')
						$('.login').dialog('widget').find('button').eq(1).button('enable');
						if ($('#expires').is(':checked')) {
							$.cookie('user',$('#login_user').val(),{
								expires:7,
							});
						} else {
							$.cookie('user',$('#login_user').val());
						};//设置cookie，设置七天有效期					
						$('.login').dialog('close');
						$('.login').resetForm();
						$('.member,.logout').show();
						$('#reg_a,#login_a').hide();
						$('.member').html($.cookie('user'));
						$('.login span.star').html('*').removeClass('succ');
					} ;
				}
			})
		},

		showErrors:function(errorMap,errorList){
			var errors=this.numberOfInvalids();
			if (errors>0) {
				$('.login').dialog('option','height',errors*20+240);
			}else{
				$('.login').dialog('option','height',240);
			}
			this.defaultShowErrors();//先执行默认的错误提示
		},
		highlight:function(element,errorClass){
			$(element).parent().find('span').html('*').removeClass('succ')
		},
		unhighlight:function(element,errorClass){
			$(element).parent().find('span').html('&nbsp;').addClass('succ')
		},
		errorLabelContainer:'ol.login_error',
		wrapper:'li',
		rules:{
			login_user:{
				required:true,
				minlength:2,
				},
			login_pass:{
				required:true,
				minlength:6,
				remote:{
					url:'login.php',
					type:'POST',
					data:{
						login_user:function(){
							return $('#login_user').val();
						},
					},
				},
				},			
			},
			messages:{
				login_user:{
					required:'名字不能为空',
					minlength:'最少2个字符',
				},
				login_pass:{
					required:'密码不能为空',
					minlength:'最少6位',
					remote:'账号或密码不正确',
				}
				
				
			}	
		});



//tabs选项卡
$('#tabs').tabs();


$('#accordion').accordion();

	
})
