/**
 * 变更iframe的高度
 * @param e 目标元素
 * @param h 目标高度
 */
function changeIfreamHeight(e,h){
	var ev=document.getElementById(e);
	ev.style.height=(parseInt(h)+16)+'px';
}
// 统一页面长度控制，针对rem单位   
(function(doc,w){
	var d=doc.documentElement,re='orientationchange' in window?'orientationchange':'resize';
	var r=function(){
		var cw=d.clientWidth;
		if(!cw)
			return;
		d.style.fontSize=(cw/37.5)+'px';
	};
	if(!doc.addEventListener)
		return;
	w.addEventListener(re,r,false);
	doc.addEventListener('DOMContentLoaded',r,false);
})(document,window);
/**
 * 判定当前系统
 */
function decisionSystem(){
	var u=navigator.userAgent.toLowerCase();
	// app=navigator.appVersion;
	// var ia=u.indexOf('Android')>-1||u.indexOf('Linux')>-1;//andr
	// var ii=!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);//ios
	var ag={aliapp:"ali",
	android:"android",
	linux:"android",
	ip:"ios",
	symbianos:"symbian",
	"windows phone":"winPhone",
	mac:"mac"};
	var flag=true;
	for(v in ag){
		if(u.indexOf(v)>=0){
			return ag[v];
		}
	}
	return "pc";
}
/**
 * 页面加载完全后的初始化操作
 */
window.onload=function(){
    catdv.log("catdv onload...");
	// 判定url地址
	var h_f=window.location.href;
	var h_w=h_f.indexOf('?');
	var h_j=h_f.indexOf('#');
	if(h_j===-1){// 无#
		if(h_w===-1){// 无?
			window.location.href=h_f+'?';
		}// 有?无处理
	}else{// 有#
		if(h_w===-1||h_w>h_j){// 无?，或?在#后
			window.location.href=h_f.substring(0,h_j)+'?'+h_f.substring(h_j);
		}// 有?且在#前无处理
	}
	// 获取一系列参数
	catdv.datas=new hl_data();
	if(catdv.cookie.enable()&&catdv.cookie.get("hl_ctoken")){
		catdv.datas.ctoken=catdv.cookie.get("hl_ctoken");
		if(catdv.cookie.get("hl_cid")){
			catdv.datas.cid=catdv.cookie.get("hl_cid");
		}
		if(catdv.cookie.get("hl_cscope")){
			catdv.datas.cscope=catdv.cookie.get("hl_cscope");
		}
	}else{
		if(catdv.url.param["hl_ctoken"]){
			catdv.datas.ctoken=catdv.url.param["hl_ctoken"];
		}
		if(catdv.url.param["hl_cid"]){
			catdv.datas.cid=catdv.url.param["hl_cid"];
		}
		if(catdv.url.param["hl_cscope"]){
			catdv.datas.cscope=catdv.url.param["hl_cscope"];
		}
	}
	catdv.datas.pHead=document.getElementsByTagName('HEAD').item(0);
	// 页面中常用信息初始化
	catdv.datas.apd.infor.protocol=location.protocol;
	catdv.datas.apd.infor.sys=decisionSystem();

	// vue中的filter初始化
	window.vueFilterInit();
	//如果存在初始化方法，则调用 add 2017-12-25 xwj
	if(window.catdv_info_init){
		window.catdv_info_init();
	}
	var routes=[{path:'/',redirect:hl_config.homepage}];
	// 初始化Vue对象
	catdv.datas.sApp=new Vue({el:'#hl_send'});
	var router=new VueRouter({routes:routes});
	// 过滤过程中的重复调用判定
	var inShow=false;
	catdv.datas.rVue=router;
	// 路由操作前
	router.beforeEach(function(to,from,next){
		if(hl_config.tmp.next){
			return;
		}
		var p=to.path.substring(1);
		var pc=hl_config.page[p];
		if(pc){
			if(inShow){
				return;
			}
			inShow=true;
			var dr=hl_config.router[p];
			if(!dr){
				// 不存在，获取模版
				hl_config.tmp.next=next;
				hl_config.router[p]={};
				// 初始化数据
				// 进行获取模版相关数据
				catdv.loadTempCont(p,pc.chr,pc.menu,to.query);
				inShow=false;
				return;
			}else{
				// 使用
				hl_config.tmp.next=undefined;
				inShow=false;
				next();
				return;
			}
		}
	});
	// 路由处理后
	router.afterEach(function(to,from,next){
		// 首次进入页面添加历史访问记录
		if(catdv.historyList.length==0){
			catdv.historyList.push(to.fullPath.replace('/',''));
		}
		// 进行数据获取操作
		var p=to.path.substring(1);
		var pc=hl_config.page[p];
		// 变更标题名
		catdv.changeTitle(pc.tit);
		catdv.getTempData(p,pc.chr,pc.menu,to.query);
		catdv.setData("/","pageName",p);
		try{
			if(to.query.bak){
				catdv.setData("/","bak",true);
			}else{
				catdv.setData("/","bak",false);
			}
		}catch(e){
		}
		// 是否需要从新登录
		// reLoginWeChat();
	});
	// 路由对象
	catdv.datas.rApp=new Vue({el:"#hl_router",
	router:router,
	data:function(){
		return catdv.datas.apd;
	}});
	catdv.log("onload over ...");
};