_url=function(){
	/**
	 * 得到url中的参数集合
	 */
	this._urlParams=function(){
		var u=location.search;//获取url中"?"符后的字串
		var rp=new Object();
		if(u.indexOf("?") != -1){
			var s=u.substr(1);
			var ss=s.split("&");
			for(var i=0;i<ss.length;i++){
				rp[ss[i].split("=")[0]]=unescape(ss[i].split("=")[1]);
			}
		}
		return rp;
	};
	this.param=this._urlParams();
	/**
	 * 进行参数组合
	 */
	this.assemblyParam=function(pm){
		var rs="";
		var bif=true;
		for(var p in pm){
			if(bif){
				bif=false;
			}else{
				rs+="&";
			}
			rs+=p+"="+encodeURIComponent(pm[p]);
		}
		return rs;
	};
	/**
	 * 获取路径参数
	 * @描述	针对于解析本项目中的vue 路由路径
	 * @param         {[string]} url []
	 * @return        {[type]}     [description]
	 */
	this.getParamFromUrl=function(url){
		var urls=url.split('?');
		var param={};
		if(urls[1]){
			var ps=urls[1].split('&');
			for(var i=0;i<ps.length;i++){
				var p=ps[i].split('=');
				param[p[0]]=p[1];
			}
		}
		return param;
	}
	/**
	 * 获取路径 不包含参数
	 * @描述	针对于解析本项目中的vue 路由路径
	 * @param         {[string]} url []
	 * @return        {[type]}     [description]
	 */
	this.getPathFromUrl=function(url){
		var urlsBf=url.split('#');
		var urls=urlsBf[0].split('?');
		return urls[0].substring(1,urls[0].length);
	}
};
_ajax=function(){
	/**
	 * 得到请求用对象
	 */
	this._ajax=axios;
	/**
	 * 进行get请求
	 */
	this.get=function(url,pm,cb,ecf){
		pm.hl_cid=catdv.datas.cid;
		pm.hl_ctoken=catdv.datas.ctoken;
		pm.hl_cscope=catdv.datas.cscope;
		this._ajax({
			method:"get",
			url:url,
			params:pm
		}).then(function(res){
			cb(res);
		}).catch(function(error){
			if(ecf){
				ecf(error);
			}
		});
	};
	/**
	 * 进行post请求
	 */
	this.post=function(url,pm,cb,ecf){
		pm.hl_cid=catdv.datas.cid;
		pm.hl_ctoken=catdv.datas.ctoken;
		pm.hl_cscope=catdv.datas.cscope;
		this._ajax({
			method:"post",
			url:url,
			params:pm
		}).then(function(res){
			if(res.data.ret){
				if(hl_error[res.data.ret]){
					if(res.data.ret===990000020){
						//需要进行token相关清除操作
						catdv.clearUserData();
					}
					catdv.model(hl_error[res.data.ret],'Toast');
				}else{
					catdv.model(res.data.ret);
				}
			}
			cb(res);
		}).catch(function(error){
			if(ecf){
				ecf(error);
			}
		});
	};
	/**
	 * 进行带有文件的post请求
	 */
	this.postFile=function(url,pm,cb,ecf){
		var pt=typeof(pm);
		if(!(pm instanceof FormData)){
			var fd=new FormData();
			for(k in pm){
				var v=pm[k];
				if(!v){
					//不存在，直接跳过
					continue;
				}else if(v instanceof HTMLInputElement){
					//认为是文件元素对象，只获取一个
					if(v.files[0]){
						//存在文件放入
						var f=v.files[0];
						fd.append(k,f);
					}else{
						//不存在文件，继续下一个
						continue;
					}
				}else if(v instanceof File){
					//认为是文件对象
					fd.append(k,v);
				}else{
					//一般数据对象
					fd.append(k,v);
				}
			}
		}else{
			var fd=pm;
		}
		fd.append("hl_cid",catdv.datas.cid);
		fd.append("hl_ctoken",catdv.datas.ctoken);
		this._ajax.post(url,fd,{headers:{'Content-Type':'multipart/form-data'}})
		.then(function(res){
			cb(res);
		}).catch(function(error){
			if(ecf){
				ecf(error);
			}
		});
	};



		this.postJsonForm=function(url,pm,cb,ecf){
			this._ajax.post(url,pm,{emulateJSON:true}).then(function(res){
				cb(res);
			}).catch(function(error){
				if(ecf){
					ecf(error);
				}
			});
		};

	/**
	 * 进行获得模板的请求<br />
	 * 不会自动增加新参数<br />
	 */
	this.temp=function(url,pm,cb){
		this._ajax({
			method:"get",
			url:url,
			params:pm
		}).then(function(res){
			cb(res);
		});
	};
	
	this._ajax.interceptors.request.use(function(c){//这里的config包含每次请求的内容
		if(c&&c.url){
			if(c.url.indexOf('.shtml')!==-1){
//				console.log(" -s shtml");
//				console.log(c);
//				c.headers['a']='aaa';
			}else{
				if(c.headers.a){
//					delete c.headers.a;
				}
			}
		}
		return c;
	},function(e){
		console.log("----- err ");
		console.log(e);
		return e;
	});
	
};
/**
 * cookie相关操作
 */
_cookie=function(){
	/**
	 * 是否cookie生效
	 */
	this.enable=function(){
		return navigator.cookieEnabled;
	};
	/**
	 * 得到指定cookie
	 */
	this.get=function(n){
		var arr,reg=new RegExp("(^| )"+n+"=([^;]*)(;|$)");
		if(arr=document.cookie.match(reg)){
			return unescape(arr[2]);
		}else{
			return undefined;
		}
	};
	/**
	 * 设置指定cookie为目标值，在t小时内有效，默认为24小时
	 */
	this.set=function(n,v,t){
		if(!v){
			return;
		}
		t=!t?24:t;
		var et=new Date();
		et.setTime(et.getTime()+t*3600000);
		document.cookie=n+"="+escape(v)+";expires="+et.toGMTString()+";domain=.xjtmjoy.com";
	};
	/**
	 * 删除制定名称cookie
	 */
	this.del=function(n){
		var cv=this.get(n);
		if(cv){
			var et=new Date();
			et.setTime(et.getTime()-10000);
			document.cookie=n+"=0;expires="+et.toGMTString()+";domain=.xjtmjoy.com";
		}
	};
};
/**
 * 时间对象的格式化处理
 */
Date.prototype.pattern=function(fmt) {
	var o={
		"M+":this.getMonth()+1,//月份
		"d+":this.getDate(),//日
		"D+":this.getDate(),//日
		"h+":this.getHours()%12==0?12:this.getHours()%12,//小时
		"H+":this.getHours(),//小时
		"m+":this.getMinutes(),//分
		"s+":this.getSeconds(),//秒
		"q+":Math.floor((this.getMonth()+3)/3),//季度
		"S":this.getMilliseconds()//毫秒
	};
	var week={
		"0":"/u65e5",
		"1":"/u4e00",
		"2":"/u4e8c",
		"3":"/u4e09",
		"4":"/u56db",
		"5":"/u4e94",
		"6":"/u516d"
	};
	fmt=fmt.replace(/Y/g,"y");
	if(/(y+)/.test(fmt)){
		fmt=fmt.replace(RegExp.$1,(this.getFullYear()+"").substr(4-RegExp.$1.length));
	}
	if(/(E+)/.test(fmt)){
		fmt=fmt.replace(RegExp.$1,((RegExp.$1.length>1)?(RegExp.$1.length>2?"/u661f/u671f":"/u5468"):"")+week[this.getDay()+""]);
	}
	for(var k in o){
		if(new RegExp("("+k+")").test(fmt)){
			fmt=fmt.replace(RegExp.$1,(RegExp.$1.length==1)?(o[k]):(("00"+ o[k]).substr((""+o[k]).length)));
		}
	}
	return fmt;
}
if(!window.catdv)
	window.catdv={};
/**
 * 历史列表
 */
catdv.historyList=new Array();
/**
 * url相关工具
 */
catdv.url=new _url();
/**
 * cookie相关工具
 */
catdv.cookie=new _cookie();
/**
 * ajax请求相关工具
 */
catdv.ajax=new _ajax();
/**
 * 浏览历史列表
 */
catdv.historyList=new Array();

/**
 * 将页面置顶
 */
catdv.goTop=function(){
	if(document.body.scrollTop){
		document.body.scrollTop=0;
	}else{
		document.documentElement.scrollTop=0;
	}
};
/**
 * 阻止事件冒泡和默认事件
 * @param e
 */
catdv.preventPro=function(e){
	//阻止冒泡
	if(e&&e.stopPropagation){
		//因此它支持W3C的stopPropagation()方法
		e.stopPropagation();
	}else if(e&&e.cancelBubble){
		e.cancelBubble=true;
	}else{
		//否则我们使用ie的方法来取消事件冒泡
		window.event.cancelBubble=true;
	}
	//阻止默认事件
	if (e&&e.preventDefault){
		//阻止默认浏览器动作(W3C)
		e.preventDefault();
	}else{
		//IE中阻止函数器默认动作的方式
		window.event.returnValue=false;
	}
}
/**
 * 向数据池中添加数据
 * @param         {[string]} key [可以点分割，从缓存池中开始，例如:'news.list']
 * @param         {[任意类型]} v   [值]
 */
catdv.setDa=function(key,v){
	var apd=catdv.datas.apd;
	var keys=key.split('.');
	for(var i=0;i<keys.length-1;i++){
		/**如果该字段不存*/
		if(!apd[keys[i]]){
			Vue.set(apd,keys[i],{});
		}
		apd=apd[keys[i]];
	}
	Vue.set(apd,keys[keys.length-1],v);
}
/**
 * 获取数据池中的数据
 * @param         {[string]} key [可以点分割，从缓存池中开始，例如:'news.list']
 * @return        {[任意类型]}     [key指定字段]
 */
catdv.getDa=function(key){
	var apd=catdv.datas.apd;
	if(key){
		var keys=key.split('.');
		for(var i=0;i<keys.length-1;i++){
			/**如果该字段不存*/
			if(!apd[keys[i]]){
				console.log(key+'>>>>>>>不含有其值');
				return null;
			}
			apd=apd[keys[i]];
		}
		return apd[keys[keys.length-1]];
	}else{
		return apd;
	}
}
/**
 * 判断是否array对象
 * @param obj 判定对象
 * @return true 是数组对象
 */
catdv.isArray=function(obj){
	return Object.prototype.toString.call(obj)==='[object Array]';
}
/**
 * 判断是否Node列表
 * @param obj 判定对象
 * @return true 是数组对象
 */
catdv.isNodeList=function(obj){
	return Object.prototype.toString.call(obj)==='[object NodeList]';
}
/**
 * 判定当前是否微信环境
 */
catdv.isWinx=function(){
	var ua=window.navigator.userAgent.toLowerCase();
	if(((ua.match(/MicroMessenger/i))&&(ua.match(/MicroMessenger/i)[0]==='micromessenger'))||(ua.match(/_SQ_/i)==='_sq_')){
		return true;
	}else{
		return false;
	}
}
/**
 * 判定目标对象是否数组类型
 */
catdv.isArray=function(obj){
	return Object.prototype.toString.call(obj)==='[object Array]';
}
