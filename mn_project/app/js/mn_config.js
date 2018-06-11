//配置类属性，通用url前缀
const hl_config={
	debug:1,
	de_data:{
//		list:1,
//		info:1
	},
	homepage:"mn_main",
	url:{},//主要url
	tmp:{},//已经加载过的模版
	router:{},//路由
	model:{},//模块
	temp:{},//模板
	jsl:{},//已经被动态加载的js文件
	cssl:{},//已经被动态加载的css文
	comp:{},//已经加载过的子模块
	tmp:{},//临时对象
	suf:{
		temp:'.html',
		//data:'.shtml',
		data:'',
		js:'.js',
		css:'.css'
	},
	//功能页面
	page:{//项目相关独立页面
        //==>>主页面
        mn_main:{
            tit:"挖矿中",
            chr:["nav_highlight","main"]
        },
        //==>>正常导航模块
		nav:{
			tit:"",
			chr:["nav"]
		},
        //==>>每日挖矿详情页
		nav_highlight:{
			tit:"",
			chr:["nav_highlight"]
		},
        //==>>每日挖矿页面
        mn_details:{
            tit:"挖币详情",
            chr:["nav_highlight","details"]
        },
        //==>>矿机状态变更页面
        mn_stu_opt:{
			tit:"挖矿",
			chr:["nav","mining"]
		},
        // ===>> 矿机状态列表页面
		mn_miner:{
			tit:"矿机管理",
			chr:["nav_highlight","miner"]
		},
        // ===>> 矿机设置页面
        mn_set:{
			tit:"更多",
			chr:["nav","more"]
		},
        // ===>>设置/变更收货地址页面
        mn_set_addr:{
			tit:"收款地址",
			chr:["nav","add"]
		},
		// ===>> 挖矿攻略
		mn_strategy:{
			tit:"挖矿攻略",
			chr:["nav", "strategy"]
		},
        // ===>> 提币页面
        wd_form:{
			tit:"提币",
			chr:["nav","total", "amount", "tipsPop"]
		},
		wd_details:{
			tit:"提币",
			chr:["nav","wd_details"]
		},

        //==>>提币成功
        wd_succ:{
			tit:"提币成功",
			chr:["nav","success"]
		},
        //==>>提币记录
        wd_logs: {
			tit:"提币记录",
            chr:["nav", "record" ]
		}
	},//以上每新增页面，需要到by_share中增加对应的分享数据处理方法
	// 页面模板路由
	pModule:{//页面中的模块，不同页面可用相同模块
		nav:{
			url:"nav/nav",
			js:['common/common'],
			css:["common/common","nav/nav","common/ico"]
		},
		nav_highlight:{
			url:"nav/nav_highlight",
			css:["common/common","nav/nav","common/ico"]
		},
		amount:{
			url:"popup/amount",
			css:["common/common","common/forms","popup/popup"]
		},
        tipsPop: {
			url: 'popup/tipsPop',
			css: ['common/common', 'popup/popup']
		},
		data_list:{
			url:"mining/data_list",
			js: ["mining/mining", "nav/nav",'common/common'],
			css:["common/common","common/ico","mining/mining"],
            isList:true

		},
        details:{
			url:"mining/details",
			js:["mining/mining",'nav/nav', 'withdraw/withdraw','common/common'],
			css:["common/common","nav/nav","common/forms","mining/mining"],
            isList:true

		},
		main:{
			url:"mining/main",
			js:["mining/mining", "withdraw/withdraw",'common/common','nav/nav'],
			css:["common/common","nav/nav","common/forms","common/ico","mining/mining", 'withdraw/withdraw'],
            isList:true
		},
		miner:{
			url:"mining/miner",
			js:["mining/mining", 'nav/nav',"common/common"],
			css:["common/common","nav/nav","common/forms","mining/mining"]
		},
		more:{
			url:"mining/more",
			js:["mining/mining", 'nav/nav','withdraw/withdraw'],
			css:["common/common","nav/nav","common/forms","mining/mining"]
		},
		strategy:{
			url:"mining/strategy",
			js:["mining/mining", 'nav/nav'],
			css:["common/common","mining/mining"]
		},
		add:{
			url:"withdraw/add",
			js:["withdraw/withdraw", 'nav/nav'],
			css:["common/common","common/forms", "withdraw/withdraw"]
		},
		total:{
			url:"withdraw/total",
			js:["withdraw/withdraw","nav/nav"],
			css:["common/common","nav/nav","common/forms","popup/popup", "withdraw/withdraw"]
		},
		success:{
			url:"withdraw/success",
			js:["withdraw/withdraw","nav/nav"],
			css:["common/common","nav/nav","common/forms","common/ico","mining/mining"]
		},
		record:{
            url:"withdraw/record",
            js:["withdraw/withdraw","nav/nav",'common/common'],
			//data: 'recordList',
            css:["common/common", "withdraw/withdraw", "mining/mining"],
            isList:true
		},
        mining: {
            url:"mining/mining",
            js:["mining/mining"],
            css:["common/common", "mining/mining"]
		},
		wd_details:{
			url:"withdraw/wd_details",
			js:["mining/mining", 'nav/nav'],
			css:["common/common","nav/nav","common/forms","mining/mining"]
		}
	},
	// 数据目标
	// https://getman.cn/5HyHP
	// 属性解析：
	// s:所在页数；p:每页数据量;
	pData:{//模块初始化所相关主动数据请求，不同模块可相关相同数据请求
        // recordList: {
        	// url: 'cat',
		// 	meth: 'post',
         //    dtg: 'recordList',
		// }
        // recordData:{
        	// url: 'cat',
		// 	meth:'post',
		// 	dtg: 'recordList',
		// }
		// colNews:{
		// 	url:"col/newsDatas",
		// 	meth:"get",
		// 	dtg:"clist",
		// 	param:{
		// 		w:"w",
		// 		s:"s",
		// 		p:"p"
		// 	}
		// },
		// recNews:{
		// 	url:"col/recNews",
		//
		// 	dtg:"rlismeth:"get",t",
		// 	param:{
		// 		w:"w",
		// 		s:"s",
		// 		p:"p"
		// 	}
		// },
		// newsInfo:{
		// 	url:"col/newsData",
		// 	meth:"get",
		// 	dtg:"ninfo",
		// 	param:{
		// 		id:"id"
		// 	}
		// }
	},
	pComp:{//子模块，不同模块可调用相同子模块，同一子模块可对应不同数据请求，但需要保证返回数据的字段匹配性
		// newsItem:{
		// 	tn:"news_item",
		// 	url:"news/ndata",
		// 	js:"news/news",
		// 	css:"news/news"
		// }
	},
	pMenu:{//页面相关菜单，不同页面可调用相同菜单
	}
};