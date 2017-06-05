//函数式封装
/*function $(id){
	return document.getElementById(id)
}*/
//对象式封装
/*var Base={
	getId:function(id){
		return document.getElementById(id)
	},
	getName:function(name){
		return document.getElementsByName(name)
	},
	getTagName:function(tag){
		return document.getElementsByTagName(tag)
	}
}*/
//构造函数封装(连缀的使用)

var $=function (_this){
	return new Base(_this)
};

function Base(_this){
	this.elements=[];
	if (_this!=undefined) {
		this.elements[0]=_this;//$(这里可以传this了)
	}
};

Base.prototype.getId=function(id){
	this.elements.push(document.getElementById(id));
	return this;
};
Base.prototype.getTagName=function(tag){
	var tags=document.getElementsByTagName(tag)
	for (var i = 0; i < tags.length; i++) {
		this.elements.push(tags[i]);
	}
	return this;
};
Base.prototype.getName=function(name){
	var names=document.getElementsByName(name)
	for (var i = 0; i < names.length; i++) {
		this.elements.push(names[i]);
	}
	return this;
};
Base.prototype.className=function(classname){
	var classname=document.getElementsByClassName(classname)
	for (var i = 0; i < classname.length; i++) {
		this.elements.push(classname[i]);
	}
	return this;
};
//添加class
Base.prototype.addClass=function(className){
	for (var i = 0; i < this.elements.length; i++) {
		if (!this.elements[i].className.match(new RegExp('(\\s|^)'+className+'(\\s|$)'))) {
			this.elements[i].className+= ' '+className;
		}
		
	}
	return this
};
//删除class
Base.prototype.removeClass=function(className){
	for (var i = 0; i < this.elements.length; i++) {
		if (this.elements[i].className.match(new RegExp('(\\s|^)'+className+'(\\s|$)'))) {
			this.elements[i].className=this.elements[i].className.replace(new RegExp('(\\s|^)'+className+'(\\s|$)'),' ');
		}
		
	}
	return this
};

//加入css方法
Base.prototype.css=function(attr,value){
	for (var i = 0; i < this.elements.length; i++) {
		if (arguments.length==1) {
			if (typeof window.getComputedStyle!='undefined') {   //W3C获取引用css样式
				return window.getComputedStyle(this.elements[i],null)[attr]
			} else if(typeof this.elements[i].currentStyle!='undefined'){  //IE获取引用CSS样式
				return this.elements[i].currentStyle[attr];
			}	
		}
		this.elements[i].style[attr]=value;
	}
	return this
};
Base.prototype.getElement=function(num){  //获取节点
	var element=this.elements[num];
	this.elements=[];
	this.elements[0]=element;
	return this;
};
Base.prototype.html=function(str){
	for (var i = 0; i < this.elements.length; i++) {
		if (arguments.length==0) {
			return this.elements[i].innerHTML;
		}
		this.elements[i].innerHTML=str;
	}
	return this
};
Base.prototype.click=function(fn){
	for (var i = 0; i < this.elements.length; i++) {
		this.elements[i].onclick=fn;
	}
	return this
}
//鼠标摁下
Base.prototype.mousedown=function(fn){
	for (var i = 0; i < this.elements.length; i++) {
		this.elements[i].onmousedown=fn;
	}
	return this
}
//拖拽
Base.prototype.drag=function(){
	for (var i = 0; i < this.elements.length; i++) {
		this.elements[i].onmousedown=function(ev){
		var _this=this;
		var ev=ev||event;
		disx=ev.clientX-_this.offsetLeft;
		disy=ev.clientY-_this.offsetTop;
		document.onmousemove=function(ev){
			var ev=ev||event;
			var l=ev.clientX-disx;
			var t=ev.clientY-disy;
			if (l<0) {
				l=0
			}else if(l>document.documentElement.clientWidth-_this.offsetWidth){
				l=document.documentElement.clientWidth-_this.offsetWidth
			}
			if (t<0) {
				t=0
			}else if(t>document.documentElement.clientHeight-_this.offsetHeight){
				t=document.documentElement.clientHeight-_this.offsetHeight
			}
			_this.style.left=l+'px';
			_this.style.top=t+'px';
		}
		document.onmouseup=function(){
			document.onmousemove=null;
			document.onmouseup=null;
		}
		return false
	}
	}
	return this
}
//添加移入移出
Base.prototype.hover=function(over,out){
	for (var i = 0; i < this.elements.length; i++) {
		this.elements[i].onmouseover=over;
		this.elements[i].onmouseout=out;
	}
	return this
}
//显示隐藏
Base.prototype.show=function(){
	for (var i = 0; i < this.elements.length; i++) {
		this.elements[i].style.display='block';
	}
	return this
}
Base.prototype.hide=function(){
	for (var i = 0; i < this.elements.length; i++) {
		this.elements[i].style.display='none';
	}
	return this
}
//据中
Base.prototype.center=function(width,height){
	var top1=(document.documentElement.clientHeight-width)/2;
	var left1=(document.documentElement.clientWidth-height)/2;
	for (var i = 0; i < this.elements.length; i++) {
		this.elements[i].style.top=top1+'px';
		this.elements[i].style.left=left1+'px';
	}
	return this
}
//触发屏幕窗口改变
Base.prototype.resize=function(fn){
	window.onresize=fn;
	return this

}
//锁屏
Base.prototype.lock=function(){
	for (var i = 0; i < this.elements.length; i++) {
		this.elements[i].style.width=document.documentElement.clientWidth+'px';
		this.elements[i].style.height=document.documentElement.clientHeight+'px';
		this.elements[i].style.display='block';
	}
	return this
}
//解除锁屏
Base.prototype.unlock=function(){
	for (var i = 0; i < this.elements.length; i++) {
		this.elements[i].style.display='none';
	}
	return this
}
//组织默认行为
Base.prototype.preDef=function(ev){
	var ev=ev||event;
	if (typeof ev.preventDefault!='undefined') {
		ev.preventDefault();
	} else {
		ev.returnValue=false;
	}

}
//跨浏览器事件绑定
function addEvent(obj,type,fn){
	if (typeof obj.addEventListener!='undefined') {
		obj.addEventListener(type,fn,false);
	} else if(typeof obj.attachEvent!='undefined'){
		obj.attachEvent('on'+type,function(){
			fn.call(obj)
		});
	}
}
//跨浏览器事件删除
function removeEvent(obj,type,fn){
	if (typeof obj.removeEventListener!='undefined') {
		obj.removeEventListener(type,fn,false);
	} else if(typeof obj.detachEvent!='undefined'){
		obj.detachEvent('on'+type,fn);
	}
}

