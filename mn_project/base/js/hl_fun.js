if(!window.catdv)
	window.catdv={};
catdv.log=function(d,l){
	l=l?l:0;
	if((hl_config.debug===0)||(hl_config.debug&&hl_config.debug<=l)){
		var cl=catdv.log.caller;
		//所在方法
		console.log(cl);
		//输出内容
		console.log(d);
	}
};
/**
 * 将对象输出为string
 */
catdv.showJson=function(j){
	return JSON.stringify(j);
};
/**
 * 改变标题（针对微信内浏览器）
 * @param t 目标标题
 */
catdv.changeTitle=function(t){
	if(!t){
		//因为不存在
		document.title="";
	}else{
		var ot=document.title;
		t=t.replace('%tit%',ot);
		document.title=t;
	}
	var i=document.createElement('iframe');
	i.style.display='none';
	i.onload=function(){
		setTimeout(function(){i.remove();},9);
//		if(catdv.datas.apd.nav){
//            catdv.datas.apd.nav.title=t;
//		}
	}
	document.body.appendChild(i);
}
/**
 * 动态加载js
 * @param url 目标地址
 * @param fb 完成后调用方法
 * @return 被加载的js元素对象
 */
catdv.loadJs=function(url,fb){
	var oj=document.createElement("script");
	oj.type="text/javascript";
	oj.defer="defer";
	oj.charset="UTF-8";
//	oj.src=url+'?ts='+new Date().getTime();
    oj.src=url;
	catdv.loadPage(oj,fb);
	catdv.datas.pHead.appendChild(oj);
	return oj;
};
/**
 * 动态加载css
 * @param url 目标地址
 * @param fb 完成后调用方法
 * @return 被加载的css元素对象
 */
catdv.loadCss=function(url,fb){
	var oc=document.createElement("link");
	oc.type="text/css";
	oc.rel='stylesheet';
	oc.charset="UTF-8";
//	oc.href=url+'?ts='+new Date().getTime();
    oc.href=url;
	catdv.loadPage(oc,fb);
	catdv.datas.pHead.appendChild(oc);
	return oc;
};
/**
 * 判定目标页面加载是否已经完成
 * @param o 目标对象
 * @param fb 完成后调用方法
 */
catdv.loadPage=function(o,fb){
	if(document.all){
		o.onreadystatechange=function(){
			var s=this.readyState;
			if(s==='loaded'||s==='complete'){
				if(fb){
					fb();
				}
			}
		}
	}else{
		o.onload=function(){
			if(fb){
				fb();
			}
		}
	}
};
/**
 * 去到目标连接
 * @param url 目标地址
 * @param pm 参数集合，可以是对象或直接的string
 */
catdv.toLink=function(url,pm){
	catdv.log("in toLink ...["+url+"] <"+catdv.showJson(pm)+">");
	if(!catdv.ahide){
		var $a=document.createElement("a");
		$a.style.display="none !important";
		$a.innerHTML="&nbsp;";
		document.body.appendChild($a);
		catdv.ahide=$a;
	}
	if(typeof(pm)==='string'){
		pm=eval("("+pm+")");
	}
	var sUrl="#/"+url+"?"+catdv.url.assemblyParam(pm);
	catdv.ahide.href=sUrl;
	catdv.ahide.click();
	catdv.historyList.push(sUrl.replace(/#\//,''));
};
/**
 * 刷新当前页面
 */
catdv.refreshPage=function(){
	if(catdv.historyList.length>0){
		//得到最后一个请求的页面的连接
		var url=catdv.historyList.pop();
		catdv.toUrl(url);
	}else{
		//正常情况下，应该并不存在该情况，未知的容错
		catdv.msg("没有可被刷新的页面");
	}
};
/**
 * 后退一个页面
 */
catdv.backPage=function(){
	if(catdv.historyList.length>1){
		//去掉一个当前页面，然后才是上一个页面
		catdv.historyList.pop();
		var url=catdv.historyList.pop();
		catdv.toLink(url);
		return true;
	}else{
		//正常情况下，应该并不存在该情况，未知的容错
        return false;
        //catdv.msg("没有可退回的页面");
	}
};
/**
 * 计算时间差
 * @param ot: 管理员操作团队的时间
 * @param hm: 1代表显示：天-时-分，2代表显示：天-时，默认显示：天
 */
catdv.lead_time=function(ot,ds,hm){
	ds=ds||7;
	var ct=new Date(ot).getTime();
	var nt=new Date().getTime();//系统当前时间
	var dsm=1000*60*60*24*ds;//算出*天的值
	var leti=nt-ct;//系统当前时间与操作时间的差值
	if(leti < dsm) {
		var lead=(ct+dsm)-nt;
		var mt=1000*60;
		var ht=60*mt;
		var dt=24*ht;
		var ds=lead/dt;
		lead%=dt;//除去多余的天数毫秒数
		var dr=Math.floor(ds);//天数
		switch(hm){
		case 1://到分
			var ms=lead%ht/mt;//除去多余的分钟毫秒数
			var mr=Math.floor(ms);
		case 2://到小时
			var hs=lead/ht;//除去多余的小时毫秒数
			var hr=Math.floor(hs);
		}
		return dr+"天"+(hr?hr+"时"+(mr?mr+"分":""):"");
	}
};
/**
 * 获取模版内容，指具体html文件
 * @param n 功能名
 * @param c 子功能页面
 * @param qy 参数集合
 */
catdv.loadTempCont=function(n,c,m,qy){
	var mn=hl_config.model[n];
	if(!mn){
		//不存在则创建
		mn=hl_config.model[n]={};
		mn.sum=c.length;
		mn.jSum=0;
		mn.cSum=0;
		mn.pSum=0;//子模板相关
		mn.cou=0;
		mn.jCou=0;
		mn.cCou=0;
		mn.pCou=0;//子模板相关
	}
	//子功能块
	for(i in c){
		var s=c[i];
		if(!hl_config.temp[s]){
			//因不存在自模板而进行获取
			hl_config.temp[s]={};
			var pr=hl_config.pModule[s];
			if(pr.js){
				if(catdv.isArray(pr.js)){
					mn.jSum+=pr.js.length;
				}else{
					mn.jSum++;
				}
			}
			if(pr.css){
				if(catdv.isArray(pr.css)){
					mn.cSum+=pr.css.length;
				}else{
					mn.cSum++;
				}
			}
			if(pr.comp){//子模块
				if(catdv.isArray(pr.comp)){
					mn.pSum+=pr.comp.length;
				}else{
					mn.pSum++;
				}
			}
			//加载模板
			catdv.ajax.temp(hl_config.url.temp+pr.url+hl_config.suf.temp,{n:s,v:pr.ver},function(res){
				//模版数据
				var s=res.config.params.n;
				//处理为路由时用模板及数据源
				var vec={template:res.data,data:function(){return catdv.datas.apd;}};
				if(hl_config.pModule[s].isList){
					//针对有要上下拉的数据列表
					vec.methods={};
					vec.methods[s+"_top_load"]=function(){
						if(catdv[s+"_top_load"]){//存在则进行目标方法调用
							catdv[s+"_top_load"](this);
						}
					};
					vec.methods[s+"_bottom_load"]=function(){
						if(catdv[s+"_bottom_load"]){//存在则进行目标方法调用
							catdv[s+"_bottom_load"](this);
						}
					};
				}
				hl_config.temp[s].temp=Vue.extend(vec);
				Vue.component('temp_'+s,hl_config.temp[s].temp);
				mn.cou++;
				if(catdv.validateLoadTempOk(n)){
					catdv.replaceTemp(n,c,m,qy);
				}
			});
			//加载css
			if(pr.css){
				catdv.loadTempCss(n,pr.css,c,m,qy);
			}
			//加载js
			if(pr.js){
				catdv.loadTempJs(n,pr.js,c,m,qy);
			}
			//加载自模块
			if(pr.comp){
				catdv.loadTempComp(n,pr.comp,c,m.qy);
			}
		}else{
			mn.cou++;
			if(catdv.validateLoadTempOk(n)){
				catdv.replaceTemp(n,c,m,qy);
			}
		}
	}
	//菜单部分
	if(m){
		if(!hl_config.temp[m]){
			//因不存在自模板而进行获取
			hl_config.temp[m]={};
			var mr=hl_config.pMenu[m];
			mn.sum+=1;
			//mn.jSum+=1;
			//mn.cSum+=1;
			if(mr.js){
				if(catdv.isArray(pr.js)){
					mn.jSum+=mr.js.length;
				}else{
					mn.jSum++;
				}
			}
			if(mr.css){
				if(catdv.isArray(pr.css)){
					mn.cSum+=mr.css.length;
				}else{
					mn.cSum++;
				}
			}
			//加载模板
			catdv.ajax.temp(hl_config.url.temp+mr.url+hl_config.suf.temp,{n:m,v:mr.ver},function(res){
				//模版数据
				var s=res.config.params.n;
				//处理为路由时用模板及数据源
				hl_config.temp[s].temp=Vue.extend({template:res.data,data:function(){return catdv.datas.apd;}});
				Vue.component('menu_'+s,hl_config.temp[s].temp);
				mn.cou++;
				if(catdv.validateLoadTempOk(n)){
					catdv.replaceTemp(n,c,m,qy);
				}
			});
			catdv.loadTempCss(n,mr.css,c,m,qy);
			catdv.loadTempJs(n,mr.js,c,m,qy);
		}
	}
};
/**
 * 验证加载是否完成
 * @param n 功能名
 */
catdv.validateLoadTempOk=function(n){
	var m=hl_config.model[n];
	if(!m){
		return false;
	}
	if(m.sum>m.cou){
		return false;
	}
	if(m.jSum&&m.jSum>m.jCou){
		return false;
	}
	if(m.cSum&&m.cSum>m.cCou){
		return false;
	}
	if(m.pSum&&m.pSum>m.pCou){
		return false;
	}
	return true;
}
/**
 * 刷新模板内容
 * @param n 功能名
 * @param c 子功能页面
 * @param m 菜单名
 * @param qy 参数集合
 */
catdv.replaceTemp=function(n,c,m,qy){
	catdv.log("in replaceTemp..."+n);
	if(hl_config.comp[n]){
		//是子模板
		var md=hl_config.comp[n].model;
		console.log("in comp replaceTemp..."+md);
		if(catdv.validateLoadTempOk(md)){
			catdv.replaceTemp(md,c,m,qy);
		}
		return;
	}
	//处理模板
	// <transition name="fade">
	var t='<div id="'+n+'">';
	for(i in c){
		var s=c[i];
		t+='<div id="temp_'+s+'"><temp_'+s+'></temp_'+s+'></div>';
	}
	if(m){
		if(m.indexOf("float_")===-1){
			t+='<div class="menu_space">&nbsp;</div>';
			t+='<div id="menu_'+m+'" class="menu_body"><menu_'+m+'></menu_'+m+'></div>';
		}else{
			t+='<div id="menu_'+m+'" class="menu_float_body"><menu_'+m+'></menu_'+m+'></div>';
		}
	}
	t+='</div>';
	// </transition>
	try{
		//加入路由规则
		catdv.datas.rVue.addRoutes([{path:'/'+n,name:n,component:{template:t}}]);
	}catch(e){
		console.log(e);
	}
	//这里需要处理
	var qys=undefined;
	if(qy){
		qys=catdv.url.assemblyParam(qy);
	}
	var tu="/"+n+(qys?"?"+qys:"");
	if(hl_config.tmp.next){
		var x=hl_config.tmp.next;
		hl_config.tmp.next=undefined;
		//进行跳转
		x(tu);
	}
};
/**
 * 得到模版所需求数据
 * @param n 功能名
 * @param c 子功能页面
 */
catdv.getTempData=function(n,c,u){
	catdv.log("in getTempData..."+c);
	function tmpFun(o){
		var p=hl_config.pData[o];
		var pm={z:o};
		var m=p.param;
		var pageNum = 1;
		var pageSize = 20;
		//处理参数
		for(pn in m){
			if(pn.indexOf("_v")===(pn.length-2)){
				var tpn=pn.substring(0,pn.length-2);
				if(m[tpn]){
					//存在的一组关系，从值到属性
					pm[m[tpn]]=m[pn];
					continue;
				}
			}
			if(m[pn+'_v']){
				//存在的一组关系，从属性到值
				pm[m[pn]]=m[pn+'_v'];
				continue;
			}
			switch(pn){
				case "p"://当前页数
					pm[m[pn]]=m["p_v"]?m["p_v"]:1;
					break;
				case "s"://页面数据量
					pm[m[pn]]=m["s_v"]?m["s_v"]:20;
					break;
				case "ids"://id拼串","分割
					pm[m[pn]]=catdv.datas.rApp.$route.query.ids;
					break;
				case "s_v"://过滤掉页面数量配置
				case "p_v"://过滤掉页面数配置
					break;
				default:
					/**所带其他参数****/
					pm[m[pn]]=catdv.datas.rApp.$route.query[pn];
			}
		}
		//进行请求
		window.catdv.ajax[p.meth](hl_config.url.data+p.url+hl_config.suf.data,pm,function(res){
			//模版数据
			// debugger
			var o=res.config.params.z;
			var pm=res.config.params;
			delete pm.hl_cid;
			delete pm.hl_ctoken;
			catdv.log("\t\tpost ["+o+"] request : "+res.config.url+">>"+catdv.showJson(res.config.params));
			catdv.log("\tpost back data :"+catdv.showJson(res.data));
			var tn=hl_config.pData[o].dtg;
			if(!res.data.ret){
				for(k in res.data.data){
					catdv.setData(o,k,res.data.data[k]);
				}
				//对数据的二次处理操作
				// debugger
				if(catdv[o+"_data_back"]){
					//如果目标方法存在
					catdv[o+"_data_back"](res,o,n);
				}
			}
		},function(error){
			console.log(error);
			console.log(error.response);
			if (error.response) {
			  console.log(error.response.data);
			  console.log(error.response.status);
			  console.log(error.response.headers);
			} else if (error.request) {
			  console.log(error.request);
			} else {
			  console.log('Error', error.message);
			}
			console.log(error.config);
		});
	};
	for(i in c){
		var s=c[i];
		if(catdv[s+"_init"]){
			//如果目标方法存在
            catdv[s+"_init"](s,n);
		}
		var d=hl_config.pModule[s].data;
		if(d){//存在需要相关数据的
			if(catdv.isArray(d)){
				for(j in d){
					var o=d[j];
					tmpFun(o);
				}
			}else{
				tmpFun(d);
			}
		}
	}
	//菜单部分
	if(u){
		if(catdv["menu_"+u+"_init"]){
			//如果目标方法存在
			catdv["menu_"+u+"_init"](u,n);
		}
	}
};
/**
 * 得到功能数据
 * @param n 功能名
 */
catdv.getFunData=function(n){
	return catdv.datas.apd[hl_config.pData[n].dtg];
};
/**
 * 对数据进行值设置
 * @param n 功能名
 * @param kp 属性路径，“.”分层
 * @param v 目标值
 * @param lvl 日志级别
 */
catdv.setData=function(n,kp,v,lvl){
	// console.log(v);
	catdv.log("in setData ... "+n+" >> "+(hl_config.pData[n]?hl_config.pData[n].dtg:"/")+" >> "+kp+" :["+v+"]");
	//判定log输出等级
	var sLog=false;
	if(!n||n===""||n==="/"){
		var d=catdv.datas.apd;
	}else{
		if(!hl_config.de_data){
			sLog=true;
		}else if(hl_config.de_data[n]){
			sLog=true;
		}else{
			var nl=n.split("_");
			var tn="";
			for(j in nl){
				tn+=nl[j];
				if(hl_config.de_data[tn]){
					sLog=true;
					break;
				}
				tn+="_";
			}
		}
		var d=catdv.datas.apd[hl_config.pData[n].dtg];
	}
	lvl=lvl?lvl:2;
	if(sLog){
		catdv.log(" >>> start setData "+n+">> "+catdv.showJson(d),lvl-1);
	}
	var ks=kp.split(".");
	var s=ks.length-1;
	var i=0;
	while(i<s){
		if(!d[ks[i]]){
            Vue.set(d,ks[i],{});
//			d[ks[i]]={};
		}
		d=d[ks[i++]];
	}
    if(!d[ks[s]]){
        Vue.set(d,ks[s],{});
    }
	var ton=typeof(v);
	if(ton==="object"){
		//是对象模式
		try{
			if(sLog){
				catdv.log(">set .... object val ... <"+kp+"::"+catdv.showJson(v)+">",lvl);
			}
			for(k in v){
				Vue.set(d[ks[s]],k,v[k]);
			}
		}catch(e){
			if(sLog){
				catdv.log(">>>>>>set error .... val ... <"+kp+"::"+ks[s]+"::"+v+">",999);
			}
			Vue.set(d,ks[s],v);
		}
	}else{
		if(sLog){
			catdv.log(">set ....["+ton+"] val ... <"+kp+"::"+ks[s]+"::"+v+">",lvl);
		}
		Vue.set(d,ks[s],v);
	}
	if(sLog){
		catdv.log(" <<< "+n+">> "+catdv.showJson(catdv.datas.apd[hl_config.pData[n].dtg]),lvl-1);
		catdv.log(" <<< over setData "+n+">> "+catdv.showJson(d),lvl-1);
	}
};
/**
 * 删除目标字段的值
 * @param n 功能名
 * @param kp 属性路径，“.”分层
 */
catdv.delData=function(n,kp){
	catdv.log("-- in delData ... "+n+" >> "+(hl_config.pData[n]?hl_config.pData[n].dtg:"/")+" >> "+kp);
	if(!n||n===""||n==="/"){
		var d=catdv.datas.apd;
	}else{
		if(!hl_config.de_data){
		}else if(hl_config.de_data[n]){
		}else{
			var nl=n.split("_");
			var tn="";
			for(j in nl){
				tn+=nl[j];
				if(hl_config.de_data[tn]){
					break;
				}
				tn+="_";
			}
		}
		var d=catdv.datas.apd[hl_config.pData[n].dtg];
	}
	var ks=kp.split(".");
	var s=ks.length-1;
	var i=0;
	while(i<s){
		if(!d[ks[i]]){
			//因为不存在直接跳出
			return;
		}
		d=d[ks[i++]];
	}
	Vue.set(d,ks[s],undefined);
};
/**
 * 加载模版所需子模板
 */
catdv.loadTempComp=function(n,pa,c,m,qy){
	if(!pa){
		return;
	}
	function tmpFun(n,pp,c,m,qy){
		var mn=hl_config.model[pp];
		if(!mn){
			//不存在则创建
			mn=hl_config.model[pp]={};
			hl_config.comp[pp]={model:n};
			mn.sum=1;
			mn.jSum=0;
			mn.cSum=0;
			mn.cou=0;
			mn.jCou=0;
			mn.cCou=0;
		}
		//子功能块
		if(!hl_config.temp[pp]){
			//因不存在自模板而进行获取
			hl_config.temp[pp]={};
			var pr=hl_config.pComp[pp];
			if(pr.js){
				if(catdv.isArray(pr.js)){
					mn.jSum+=pr.js.length;
				}else{
					mn.jSum++;
				}
			}
			if(pr.css){
				if(catdv.isArray(pr.css)){
					mn.cSum+=pr.css.length;
				}else{
					mn.cSum++;
				}
			}
			//加载模板
			catdv.ajax.temp(hl_config.url.temp+pr.url+hl_config.suf.temp,{n:pp,v:pr.ver},function(res){
				//模版数据
				var s=res.config.params.n;
				//处理为路由时用模板及数据源
				var vec={template:res.data,props:['data']};
				hl_config.temp[s].temp=Vue.extend(vec);
				Vue.component(hl_config.pComp[s].tn,hl_config.temp[s].temp);
				hl_config.model[n].pCou++;
				if(catdv.validateLoadTempOk(pp)){
					catdv.replaceTemp(pp,c,m,qy);
				}
			});
			//加载css
			if(pr.css){
				catdv.loadTempCss(pp,pr.css,c,m,qy);
			}
			//加载js
			if(pr.js){
				catdv.loadTempJs(pp,pr.js,c,m,qy);
			}
		}else{
			hl_config.model[n].pCou++;
			if(catdv.validateLoadTempOk(pp)){
				catdv.replaceTemp(pp,c,m,qy);
			}
		}
	};
	if(catdv.isArray(pa)){
		for(i in pa){
			var pp=pa[i];
			tmpFun(n,pp,jp,m,qy);
		}
	}else{
		tmpFun(n,pa,m,qy);
	}
}

/**
 * 加载模版所需js
 */
catdv.loadTempJs=function(n,ja,c,m,qy){
	if(!ja){
		//因为不存在不处理，容错
		return;
	}
	function tmpFun(n,jp,c,m,qy){
		if(!hl_config.jsl[jp]){
			//因为还不存在，进行加载
			catdv.loadJs(hl_config.url.js+jp+hl_config.suf.js,function(){
				hl_config.model[n].jCou++;
				if(catdv.validateLoadTempOk(n)){
					catdv.replaceTemp(n,c,m,qy);
				}
			});
			hl_config.jsl[jp]=true;
		}else{
			//因为被加载过，所以不再处理
			hl_config.model[n].jCou++;
			if(catdv.validateLoadTempOk(n)){
				catdv.replaceTemp(n,c,m,qy);
			}
		}
	};
	if(catdv.isArray(ja)){
		for(i in ja){
			var jp=ja[i];
			tmpFun(n,jp,c,m,qy);
		}
	}else{
		tmpFun(n,ja,c,m,qy);
	}
};
/**
 * 加载模版所需css
 */
catdv.loadTempCss=function(n,ca,c,m,qy){
	if(!ca){
		//因为不存在不处理，容错
		return;
	}
	function tmpFun(n,cp,c,m,qy){
		if(!hl_config.cssl[cp]){
			//因为还不存在，进行加载
			catdv.loadCss(hl_config.url.css+cp+hl_config.suf.css,function(){
				hl_config.model[n].cCou++;
				if(catdv.validateLoadTempOk(n)){
					catdv.replaceTemp(n,c,m,qy);
				}
			});
			hl_config.cssl[cp]=true;
		}else{
			//因为被加载过，所以不再处理
			hl_config.model[n].cCou++;
			if(catdv.validateLoadTempOk(n)){
				catdv.replaceTemp(n,c,m,qy);
			}
		}
	};
	if(catdv.isArray(ca)){
		for(i in ca){
			var cp=ca[i];
			tmpFun(n,cp,c,m,qy);
		}
	}else{
		tmpFun(n,ca,c,m,qy);
	}
};

/**
 * \
 * @param {{object}}  向微信发送的配置参数
 * @param {{string}} object.appId  公众号名称，由商户传入
 * @param {{string}} object.timeStamp  时间戳，自1970年以来的秒数
 * @param {{string}} object.nonceStr  随机串
 * @param {{string}} object.package  公众号名称，由商户传入
 * @param {{string}} object.paySign   微信签名
 * @param {{string}} object.signType  微信签名方式  default=> MD5
 * @param {{string}} toLinkName 支付成功，要跳转到页面路由
 * @constructor
 */
catdv.WeixinJS = function (data,toLinkName) {
    WeixinJSBridge.invoke('getBrandWCPayRequest',data,function(res){
        if(res.err_msg=="get_brand_wcpay_request:ok"){
            catdv.toLink(toLinkName);
        }else{
        	//==>>之后配置模态框 提示用户
            // itoyo.model({
            //     message:'微信支付失败，是否重新支付',
            //     confirmButtonText:'确定',
            //     cancelButtonText:'取消'
            // },'confirm',function(){
            //     ty_rc_pay();
            // });
        }
    });
};