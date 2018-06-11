/*   本JS文件，是挖矿模块的交互   */


/* --------------- more更多页面跳转  start--------------*/
// ===>> 矿机管理
catdv.miner_status = function () {
    catdv.toLink('mn_miner');
};


// ===>> 收款地址
catdv.address_settings = function () {
    catdv.datas.apd.withdraw.isAddressFlag = false;
    catdv.toLink('mn_set_addr', {saveFlag: 1});
};

// ===>> 提币记录
catdv.withdraw_record = function (e) {
    catdv.toLink('wd_logs');
};


// ===>> 挖矿攻略
catdv.link_withdraw_add = function () {
    catdv.toLink('');
};

catdv.add_init = function () {
    var saveFlag = catdv.datas.rVue.history.current.query.saveFlag;
    saveFlag == 1 ? catdv.datas.apd.nav.address_flag = '' : null;
};

// ===>>挖矿中页面头部，三个点挑战到更多页面(***)
catdv.link_more = function () {
    catdv.toLink('mn_set');
};


// == >> 进入指定日期的挖币详情页(依据日期进行查询)
catdv.link_details = function (_this) {
    var date = _this.getAttribute('createtime');
    if (date) {
        catdv.toLink('mn_details', {date: date});
    }

};


/* --------------- more更多页面跳转  end-------------*/


// ===>> 挖矿模块加载完毕，挖矿列表数据获取和绑定
catdv.main_init = function () {
    getDugMoneyDetails();
    getUserBaseInfo();
};


/**
 * 挖矿中，挖矿列表数据
 */
function getDugMoneyDetails(e) {
    var paramObj = {};
    paramObj.mid = "801001001";
    paramObj.method = "summary";
    var mining = tools.getMining();


    // ==>>进来请求一次，以后就不请求了
    if (mining.dayList &&  mining.dayList.list && JSON.stringify(tools.getMining().dayList.list) !== '{}') {  //==>>初始化如果有数据就不进行请求 了(核心代码)
        return;
    }

    var url = hl_config.url.url;
    var url1 = hl_config.url.testUrl + 'miningList.json';
    tools.ajax(url1, 'mining.dayList', true, paramObj, {}, e, function (res) {
        var mining = tools.getMining().data;
        //===>> 挖矿中，列表数据
        if (res.data.data.detail.length === 0) {

        } else {
            tools.getWithdraw().profitFlag = false;
            tools.getWithdraw().getFlagClass = false;
            tools.getMining().data.noBTCClass = true;


            var totalPageNo = Math.ceil((res.data.data.totalCount / tools.getMining().dayList.refers.pageSize));
            catdv.setData('', 'mining.dayList.list',  tools.dataFormat(res.data.data.detail));            //有数据放到数据次里面
            catdv.setData('', 'mining.dayList.refers.totalCount', res.data.data.totalCount);  //有数据放到数据次里面
            catdv.setData('', 'mining.dayList.refers.totalPageNo', totalPageNo);        //有数据放到数据次里面

        }
    }, function (res) {
        MINT.Toast(res.data.error.msg);
    });
}

//上拉更新数据
catdv.main_top_load = function (e) {
    getDugMoneyDetails(e);
};

// 挖矿页面， 下拉加载更多
catdv.main_bottom_load = function (e) {
    var paramObj = {};
    var a = catdv.datas.apd;
    paramObj.mid = "801001001";
    paramObj.method = "summary";
    var ev = e, p = tools.getMining().dayList.refers.pageNo + 1, s = tools.getMining().dayList.refers.pageSize, tc = catdv.datas.tc;

    tools.getMining().dayList.refers.pageNo = p;
    if (p > tools.getMining().dayList.refers.totalPageNo) {
        ev.$refs.listLoadmore.onBottomLoaded();
        a.mining.data.dayListDataEnd = true;
        return;
    }
    var url = hl_config.url.url;
    var url1 = hl_config.url.testUrl + 'miningList1.json';
    tools.ajax(url1, 'mining.dayList', true, paramObj, {}, e, function (res) {
        var oldList = tools.getMining().dayList.list;

        var newList = res.data.data.detail;

        if (newList.length > 0) {
            // vue对象监听必须改地址
            var newObjList = tools.dataFormat(newList);
            var obj = Object.assign(newObjList,  tools.getMining().dayList.list);
            catdv.datas.apd.mining.dayList.list = obj;
            catdv.setData('','mining.dayList.list', obj);

        }
    }, function (res) {
        console.log('获取失败，稍候重试');
    });
};


/**
 *  矿机的基本信息 (数量， 总比特币，收货地址,等其他信息)
 */
function getUserBaseInfo(e) {
    var paramObj = {};
    paramObj.mid = "801001001";
    paramObj.method = "account_detail";
    tools.ajax(hl_config.url.url, '', false, paramObj, {}, e, function (res) {
        var mining =tools.getMining().data;
        var getMining = res.data.data.account;
        // 设置数据，保存到数据池
        catdv.setData('', 'mining.data.address', getMining.address);        //收获地址
        catdv.setData('', 'mining.data.totalBTC', getMining.totalIncome);    //总比特币数量 (总收入)
        catdv.setData('', 'mining.data.userId', getMining.userId);          //用户的id
        catdv.setData('', 'mining.data.id', getMining.id);                  // id
        catdv.setData('', 'mining.data.createTime', getMining.createTime);   //创建时间
        catdv.setData('', 'mining.data.modifyTime', getMining.modifyTime);   //修改时间
        catdv.setData('', 'withdraw.useIncome', getMining.useIncome);       //已提取的比特币(可提取)
        catdv.setData('', 'withdraw.unuseIncome', getMining.unuseIncome);   //可用的比特币数量
    }, function (res) {
        MINT.Toast(res.data.error.msg);
    });
}


// 矿机管理模块 (没有分页哦)
catdv.miner_init = function (e) {
    var paramObj = {
        method: 'cat_manager',
        mid: "202020020",
        params: {}
    };
    // ==>> 调用ajax 进行判断
    var url = hl_config.url.url;
    var url1 = hl_config.url.testUrl + 'mnManageList.json';
    tools.ajax(url1, '', false, paramObj, {}, e, function (res) {
        catdv.setData('', 'mining.data.isActive', res.data.data.isActive);             //猫盘活跃数量
        catdv.setData('', 'mining.data.totalCount', res.data.data.totalCount);         //猫盘总个数
        if (res.data.data.catIfno !== '[]') {
            catdv.setData('', 'mining.minerStatus', res.data.data.catIfno);           //矿机管理类列表
        }

        //==>> 不活跃数量处理
        if (typeof res.data.data.totalCount === 'number' && typeof res.data.data.isActive === 'number') {
            noActive = res.data.data.totalCount - res.data.data.isActive;
            catdv.setData('', 'mining.data.noActive', noActive);
        }

        if (typeof res.data.data.totalCount === 'number' && typeof res.data.data.isActive === 'string') {
            catdv.setData('', 'mining.data.noActive', res.data.data.totalCount);
        }
    }, function (res) {
        MINT.Toast(res.data.error.msg);
    });
};


/*  某天挖矿详情列表  -------------------------- start  上拉，下拉 */
catdv.details_init = function (e) {
    var paramObj = {};
    paramObj.mid = "801001001";    //消息码
    paramObj.method = "day_detail";  // 方法名
    var date = catdv.datas.rVue.history.current.query.date;
   // catdv.setData('', tools.getWithdraw().currentDayDetail, date)

    // start 数据过滤，找出对应那个对象，数据格式修改，在进行数据过滤

    // var histtoryData = catdv.datas.apd.mining.dayList.list;
    // var curObj = null;
    // curObj =  histtoryData.filter(function (item) {
    //     if (item.createTime.split(' ')[0] == date) {
    //         return true;
    //     }
    // });
    // histtoryData['']
    //debugger
    //debugger
    if (tools.getMining().dayList.list && tools.getMining().dayList.list[[date]] &&  tools.getMining().dayList.list[[date]].mnInfo) {

         return;
    }
    var url = hl_config.url.url;
    var url1 = hl_config.url.testUrl + 'dayList.json';
    tools.ajax(url1, 'mining.dateDetailsList', true, paramObj, {setDate: date}, e, function (res) {
        var totalPageNo = Math.ceil((res.data.data.totalCount / tools.getMining().dateDetailsList.refers.pageSize));
        catdv.setData('', 'mining.data.dayIncome', res.data.data.dayIncome);
        //catdv.setData('', 'mining.dateDetailsList.list', res.data.data.detail);
        catdv.setData('', 'mining.dateDetailsList.refers.totalPageNo', totalPageNo);
        catdv.datas.apd.nav.address_flag = 'hide';

        // ===>> 将数据放到下面
       // curObj[0].mnInfo = res.data.data.detail;
        //tools.getMining().dayList.list[date].mnInfo = res.data.data.detail;
        //debugger
       // debugger
        var dataStr = 'mining.dayList.list.' + date + '.mnInfo';
        console.log("dataStr>>>"+dataStr);
         catdv.setData('',dataStr,res.data.data.detail);
        //debugger
        //catdv.setData('',  tools.getMining().dayList.list[date].mnInfo,  res.data.data.detail)
        //console.log(tools.getMining().dayList.list[date]);

    }, function (res) {
        MINT.Toast(res.data.error.msg);
    });
};

// 某天详情下拉
catdv.details_top_load = function (e) {
    catdv.details_init(e)
};


// 某天详情上拉 - 加载更多
catdv.details_bottom_load = function (e) {
    console.log('bottom');
    var a = catdv.datas.apd;
    var p = tools.getMining().dateDetailsList.refers.pageNo + 1;
    var date = catdv.datas.rVue.history.current.query.date;
    var paramObj = {};
    paramObj.mid = "801001001";    //消息码
    paramObj.method = "day_detail";  // 方法名
    tools.getMining().dateDetailsList.refers.pageNo = p;
    if (p > tools.getMining().dateDetailsList.refers.totalPageNo) {
        e.$refs.listLoadmore.onBottomLoaded();
       a.mining.data.dateListDataEnd = true;
        return
    }
    var url1 = hl_config.url.testUrl+ 'dayList.json';
    var url = hl_config.url.url;
    tools.ajax(url1, 'mining.dateDetailsList', true, paramObj, {setDate: date}, e, function (res) {
        var oldList = tools.getMining().dateDetailsList.list;
        var newList = res.data.data.detail;
        if (newList.length > 0) {
            // newList.forEach(function (item, index, self) {
            //     oldList.push(item);
            // });

            debugger
            //var obj = {};
            //var newDataList = tools.dataFormat(newList);
           // var oldDataList = tools.getMining().dayList.list[date].mnInfo;
            var oldList = tools.getMining().dayList.list[date].mnInfo;
            newList.forEach(function (item) {
              oldList.push(item);
            });
            catdv.setData('',tools.getMining().dayList.list[date].mnInfo, oldList);
            //tools.getMining().dayList.list[date].mnInfo.push(newList);
           // console.log(' ============>>请求过来的的'+ newDataList);
            //console.log("老的数据" + oldDataList);
            //  oldDataList= Object.assign(newList, oldDataList);

            // var histtoryData = catdv.datas.apd.mining.dayList.list;
            // var curObj = null;
            // curObj =  histtoryData.filter(function (item) {
            //     if (item.createTime.split(' ')[0] == date) {
            //         return true;
            //     }
            // });
            // debugger
            // newList.forEach(function (item) {
            //     curObj[0].mnInfo.push(item);
            // });
        }
    }, function (res) {
        MINT.Toast(res.data.error.msg);
    });
};

/*  某天挖矿详情列表 ------------------------------------- end */


// 开启和关闭猫盘 ==>> Java
// 开通挖矿业务 ==>> App
catdv.settings_status = function (_this) {
    var isOpen = _this.getAttribute('isopen');
    var status = _this.getAttribute('status');  // ==>> -1 - 关闭   、  1 - 开启
    var sn = _this.getAttribute('snid');
    if (isOpen == -1) {
        //调用APP去开通
        return;
    } else {
        // 调用后台开启和关闭服务
        if (status == 1) {
            status = -1
        } else if (status == -1) {
            status = 1;
        }
    }
    var paramObj = {
        method: "isopen",
        session: "2343ewfss",
        mid: "848418747847",
        params: {
            sn: sn,
            status: status
        }
    };

    catdv.ajax.postJsonForm('http://maopan.gsie.cn/cat', JSON.stringify(paramObj), function (res) {
        if (res.data.result) {
            MINT.Toast('操作成功');
        } else {//错误判断
            MINT.Toast(res.data.error.msg);
        }
        //去下下拉状态
    });
};



