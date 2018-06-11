// 页面观察控制，是一个相对独立的页面系统，

/**
 * 为对象模型，使用需要通过new的方式使用<br />
 * 需要针对创建的对象进行独立的配置<br />
 * 
 * 必要的配置内容：
 * 	请求消息地址(url)，这里统一为get请求方式，暂定不可变（目标为访问日志服务），需要使用function的方式进行处理，这样可针对每次请求动态处理目标；
 * 
 * 通过start()进行启动；在启动前注意进行对应配置；
 * 
 * @returns
 */
function TfzzhObserve(conf,param){
	/**
	 * 目标请求地址
	 */
	this.config={
		/**
		 * 请求消息地址，长期目标为，访问日志
		 */
		url:undefined,
		/**
		 * 请求间隔时间，默认为10s
		 */
		intervalTime:15000,
		/**
		 * 用户token，不会不存在
		 */
		cToken:undefined,
		/**
		 * 用户平台ID，未登录的不存在
		 */
		cId:undefined,
		/**
		 * 用户所属来源，未登陆的不存在
		 */
		cScope:undefined
	};
	this.unloadConfirm={};
	/**
	 * 执行时所相关的页面hash地址
	 */
	this.tarHash=undefined;
	/**
	 * 是否已经关闭
	 */
	this.isStop=false;
	/**
	 * Ajax对象
	 */
	this.ajax=undefined;
	/**
	 * 请求url
	 */
	this.requestUrl=undefined;
	/**
	 * 数据
	 */
	this.data={
		/**
		 * 起始时间
		 */
		startTime:0,
		deep:0,
		topHeight:0,
		times:11
	};
	this.pwu=undefined;
	/**
	 * 放入参数数据
	 */
	this.putParam=function(key,val){
		param[key]=val;
		//刷新数据
		this.requestUrl=undefined;
	};
	/**
	 * 启动方法
	 */
	this.start=function(){
//		console.log("\tTfzzhObserve to start ready >>> ");
		if(!conf){
			console.log("TfzzhObserve conf not exists, so init fail...");
			return;
		}else{
			if(!conf.url){
				console.log("TfzzhObserve conf must param[url]..., so init fail...");
				return;
			}
			if(!conf.cToken){
				conf.cToken=randomString(32);
			}
		}
		this.config.url=conf.url;
		this.config.cToken=conf.cToken;
		if(conf.cId){
			this.config.cId=conf.cId;
		}
		if(conf.cScope){
			this.config.cScope=conf.cScope;
		}
		if(conf.intervalTime){
			var itt=parseInt(conf.intervalTime);
			if(itt>this.config.intervalTime){//仅针对大于时，增加
				consif.intervalTime=itt;
			}
		}
//		console.log("\tTfzzhObserve to start ok >>> ");

		var th;
		if(document.documentElement&&document.documentElement.scrollHeight){
			th=document.documentElement.scrollHeight;
		}else{
			th=document.body.scrollHeight;
		}
		this.data.topHeight=th;

		this.pwu=tfzzh_observe_parseWindowURL();
		this.tarHash=this.pwu.hash;
		this.data.startTime=new Date().getTime();
		var ttpo=this;
		// 开启页面的监听
		window.onhashchange=function(event){
//			console.log(" in 1 onhashchange   ... ");
			var vs=ttpo.validate();
			if(!vs){
				console.log(" onhashchange  validate fail ... ");
				return;
			}
		}

		window.onpopstate=function(event){
//			console.log(" in 2 onpopstate   ... ");
			var vs=ttpo.validate();
			if(!vs){
				console.log(" onpopstate  validate fail ... ");
				return;
			}
		}

		// 滚动条位置监听
		window.onscroll=function(){
			var ch,th;
			if(document.documentElement&&document.documentElement.scrollTop){
				ch=document.documentElement.scrollTop;
			}else{
				ch=document.body.scrollTop;
			}
			if(ch>ttpo.data.deep){
				ttpo.data.deep=ch;
			}
			if(document.documentElement&&document.documentElement.scrollHeight){
				th=document.documentElement.scrollHeight;
			}else{
				th=document.body.scrollHeight;
			}
			ttpo.data.topHeight=th;
//			console.log(" scrollTop >> " + ch + " :: " + ttpo.data.deep);
		};

		//监听页面刷新及关闭
		//启用监听浏览器刷新、关闭的方法
		this.unloadConfirm.set=function(){
			window.onbeforeunload=function(event){
				ttpo.stop();
			}
		};
		//关闭监听浏览器刷新、关闭的方法
		this.unloadConfirm.clear=function(){
			window.onbeforeunload=function(){};
		};
		this.ajax=new TfzzhAjax();
		this.exec(1);
	};
	/**
	 * 停止时执行的方法
	 */
	this.stop=function(){
//		console.log("\tTfzzhObserve to stop ... ");
		this.isStop=true;
		this.sendData(2);
	};
	/**
	 * 具体的执行方法，内部通过settimeout调用
	 */
	this.exec=function(st){
//		console.log("\tTfzzhObserve exec  *** ");
		if(this.isStop){
			console.log("  exec is stop over ... ");
			return;
		}
		var vs=this.validate();
		if(!vs){
			console.log("  validate fail ... ");
			return;
		}
		this.sendData(st);
		var ttpo=this;
		setTimeout(function(){
//			console.log("in set Time out " + (new Date()).getTime());
			ttpo.exec(ttpo.data.times++);
		},this.config.intervalTime);
	};
	/**
	 * 进行数据发送作业
	 */
	this.sendData=function(st){
//		console.log("\t >> TfzzhObserve in sendData  >>> " + this.config.url);
		if(!this.config.url){
			// 进行ajax的get模式发送
			return false;
		}
		if(!this.requestUrl){
			var p='ct='+this.config.cToken;
			if(this.config.cId){
				p+='&ci='+this.config.cId;
			}
			if(this.config.cScope){
				p+='&cs='+this.config.cScope;
			}
			if(param){
				for(var k in param){
					p+='&'+k+'='+encodeURIComponent(param[k]);
				}
			}
			//得到当前url内容
			p+='&sr='+encodeURIComponent(this.pwu.source);
			var hi=this.config.url.indexOf('?');
			var url=this.config.url+(hi===-1?'?':'&')+p;
			this.requestUrl=url;
//			console.log("this.requestUrl>>"+this.requestUrl);
		}
		var rp='&st='+st;
		//累计时间
		rp+='&ut='+((new Date()).getTime()-this.data.startTime);
		//总高度
		rp+='&th='+this.data.topHeight;
		//深度
		rp+='&dp='+this.data.deep;
		var ch=0;
		if(document.documentElement&&document.documentElement.scrollTop){
			ch=document.documentElement.scrollTop;
		}else{
			ch=document.body.scrollTop;
		}
		rp+='&cdp='+ch;
		var rurl=this.requestUrl+rp;
//		console.log("rurl>>"+rurl);
		this.ajax.get(rurl,function(){},true);
//		console.log("\t >> TfzzhObserve sendData over  >>> " + url);
	};
	/**
	 * 每次执行需要进行的验证方法
	 */
	this.validate=function(){
		if(this.isStop){
			console.log("  validate is stop over ... ");
			return;
		}
//		console.log("\tTfzzhObserve validate  &&& ");
		// 得到页面当前的hash
//		console.log("validate >> " + pwu.hash + "<<>>"+this.tarHash);
		if(this.pwu.hash!==this.tarHash){
			//不是同一个连接，进行业务关闭
			this.stop();
			return false;
		}
		return true;
	};
}
/**
 * 得到连接相关信息
 * @returns 
 */
function tfzzh_observe_parseWindowURL(){
	var url=window.location.href;
	var a=document.createElement('a');
	a.href=url;
	return {
		source:url,
		protocol:a.protocol.replace(':',''),
		host:a.hostname,
		port:a.port,
		query:a.search,
		params:(function(){
			var ret={},seg=a.search.replace(/^\?/,'').split('&'),len=seg.length,i=0,s;
			for(;i<len;i++){
				if(!seg[i]){
					continue;
				}
				s=seg[i].split('=');
				ret[s[0]]=s[1];
			}
			return ret;
		})(),
		hashParams:(function(){
			var s=a.hash.replace('#','');
			var sp=s.split('?');
			if(sp.length>1){
				var ret={},i=0,s;
				var spe=sp[1].split('&');
				var len=spe.length;
				for(;i<len;i++){
					if(!spe[i]){
						continue;
					}
					s=spe[i].split('=');
					ret[s[0]]=s[1];
				}
				return ret;
			}
		})(),
		file:(a.pathname.match(/\/([^\/?#]+)$/i)||[,''])[1],
		hash:a.hash.replace('#',''),
		path:a.pathname.replace(/^([^\/])/,'/$1'),
		relative:(a.href.match(/tps?:\/\/[^\/]+(.+)/)||[,''])[1],
		segments:a.pathname.replace(/^\//,'').split('/')
	};
}
/**
 * Ajax用对象
 * @returns
 */
function TfzzhAjax(){
	this._ajax=function(){
		var hr=undefined;
		if(window.XMLHttpRequest){//Mozilla,Safari,...
			hr=new XMLHttpRequest();
			if(hr.overrideMimeType){
				hr.overrideMimeType('text/html');
			}
		}else if(window.ActiveXObject){//IE
			try{
				hr=new ActiveXObject("Msxml2.XMLHTTP");
			}catch(e){
				try{
					hr=new ActiveXObject("Microsoft.XMLHTTP");
				}catch(e){}
			}
		}
		return hr;
	};
	/**
	 * 进行get请求
	 */
	this.get=function(url,callback,jsonp){
		var xmlHttp=this._ajax();
		if(!xmlHttp){
			alert('There was a problem with the Get request.');
		}
		this.requset(xmlHttp,callback);
		xmlHttp.open("GET",url,true);
//		if(jsonp){
//		xmlHttp.withCredentials=true;
//		}
		xmlHttp.send(null);
	};
	this.requset=function(xmlHttp,callback){
		this.xmlHttp=xmlHttp;
		this.xmlHttp.return_data_callback = callback;
		this.xmlHttp.onreadystatechange=function(){
			if (this.readyState == 4) {
				if (this.status == 200){
					result = this.responseText;
					if(this.return_data_callback){
						this.return_data_callback(result,false);
					}
				}else{
					if(this.return_data_callback){
						this.return_data_callback(this,true);
					}
				}
			}
		};
		this.xmlHttp.onerror=function(){
		}
	}
}
/**
 * 生成随机码
 */
function randomString(s){
  var seed=new Array('A','B','C','D','E','F','G','H','I','J','K','L','M','N','P','Q','R','S','T','U','V','W','X','Y','Z',
  'a','b','c','d','e','f','g','h','i','j','k','m','n','p','Q','r','s','t','u','v','w','x','y','z',
  '0','1','2','3','4','5','6','7','8','9'
  );//数组
  var sl=seed.length;//数组长度
  var rs='';
  for(i=0;i<s;i++) {
    var j=Math.floor(Math.random()*sl);
    rs+=seed[j];
  }
  return rs;
}