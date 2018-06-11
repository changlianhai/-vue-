/* 本JS控制提币的流程，  提币 ---设置地址，获取地址--输入提币数量 ---提币成功 提币记录 某条提币记录的详情   */

/*  提币流程 start */
// ===>> 1.0  挖矿详情页，提币按钮进行提币
catdv.cardInfo_to_link_withdraw = function () {
    var obj = tools.getMining().data;
    var address = obj.address;
    var unuseIncome = tools.getWithdraw().useIncome;

    // // ??? 稍候放开
    // if (unuseIncome === 0 || unuseIncome.length === 0) {
    //     MINT.Toast('当前没有可提取的比特币');
    //     return;
    // }


    // ==>> 依据是否有地址，进行对应调到不同的页面, 导航头部保存按钮的显示和隐藏
    if (address.length === 0) {
        catdv.toLink('mn_set_addr');
        catdv.datas.apd.nav.address_flag = '';
    } else {
        catdv.toLink('wd_form');
        catdv.datas.apd.nav.address_flag = 'hide';
    }

};


// ===>> 2.0 设置收货地址
catdv.address_model_save = function () {
    var address = tools.getMining().data.address;
    var timer = null;
    var reg = /[a-zA-Z0-9]{34}/;
    window.clearTimeout(timer);
    if (address.length === 0) {
        MINT.Toast({
            message: '比特币地址不能为空，请输入',
            duration: 1000
        });
        return;
    }

    // ==>> 验证比特币格式
    if (!reg.test(address)) {
        MINT.Toast({
            message: '收币地址格式不正确，请重新输入',
            duration: 1000
        });
        return;
    }

    // ===>> ajax进行判断 (***)
    var paramObj = {};
    paramObj.session = "365d1b669d6146d896921275a7475e201111";  //用户唯一标识
    paramObj.mid = "801001001";    //消息码
    paramObj.method = "save_address";  // 方法名
    paramObj.params = {
        address: address   // 收币地址
    };
    catdv.ajax.postJsonForm('http://maopan.gsie.cn/cat', JSON.stringify(paramObj), function (res) {
        if (res.data && res.data.result) {
            //==>>成功了，将收币地址放到数据池里面
            MINT.Toast({
                message: '设置地址成功',
                duration: 1000
            });
            catdv.setData('', 'mining.data.address', address);     //重绘收获地址
            catdv.datas.apd.nav.address_flag = 'hide';

            timer = setTimeout(function () {
                var saveFlag = catdv.datas.rVue.history.current.query.saveFlag;
                if (saveFlag == 1) {
                    catdv.toLink('mn_set');
                } else {
                    catdv.toLink('wd_form');
                }
            }, 1200);
        } else {   // 错误提示用户
            MINT.Toast(res.data.error.msg);
        }
    });
};


// ===>> 3.0获取收币地址，从数据池里面(*****)
catdv.add_get_addresss = function () {
    //catdv.datas.apd.mining.data.address = catdv.datas.apd.mining.data.address;
};


// ===>> 4.0 单击提币，进行发送手机后给后台，用户输入验证码
catdv.withdraw_start = function () {
    var price = catdv.datas.apd.withdraw.useIncome;     //已提取的比特币数量
    var all = catdv.datas.apd.withdraw.unuseIncome;     //可提取比特币数量
    var userTel = catdv.datas.apd.mining.data.phone;    //用户手机号

    if (price === 0) {
        MINT.Toast('提取的比特币数量为0，没有意义，请重新输入');
        return;
    }

    // if (!isNaN(price)) {
    //     MINT.Toast('格式不正确，请重新输入');
    //     catdv.setData('', 'withdraw.useIncome', '');
    //     catdv.setData('', 'withdraw.cost', 0);
    //     return;
    // }

    if (price.length === 0) {
        MINT.Toast('提币数量不能为空，请输入');
        return;
    }
    if (!window.Number(price)) {
        MINT.Toast({
            message: '提币数量格式不正确，请重新重新输入',
            duration: 600
        });
        window.setTimeout(function () {
            catdv.datas.apd.withdraw.extractAll = '';
        }, 1000);
        return;
    }

    if (price > all) {
        catdv.datas.apd.withdraw.tipsFlag = false;
        return;
    } else {
        catdv.datas.apd.withdraw.tipsFlag = true
    }
    catdv.datas.apd.withdraw.popUpClassFlag = '';  //弹框出来
    var ipt = document.getElementById('checkInpt').getElementsByTagName('input');
    ipt[0].focus();
    //提示用户，正在发送验证码
    MINT.Indicator.open({
        text: "验证码发送中,请稍等",
        spinnerType: "fading-circle"
    });


    //==>>后台给用户手机发送验证码
    var paramObj = {
        method: 'sendcode',
        mid: "202020020",
        params: {
            phone: userTel
        }
    };
    // ==>> 调用ajax 进行判断
    catdv.ajax.postJsonForm('http://maopan.gsie.cn/cat', JSON.stringify(paramObj), function (res) {
        MINT.Indicator.close();
        phoneCheck();
        if (res.data && res.data.result) {


        } else {//错误判断
            MINT.Toast(res.data.error.msg);
        }
    });
};


//===>> 5.验证码最后以为输入完毕，进行提币Ajax
var withdraw_go_details = function (_this) {
    if (_this.value.length === 1) {
        //catdv.datas.apd.withdraw.popUpClassFlag = 'hide';
        _this.blur();

        MINT.Indicator.open({
            text: "提币验证中，请稍等",
            spinnerType: "fading-circle"
        });

        //MINT.Indicator.open('校验中，请稍后');
        var address = tools.getMining().data.address;
        var money = tools.getWithdraw().useIncome.toString();  //===>>提取的BTC
        var cost =  tools.getWithdraw().cost.toString();
        var code = [];


        var ipts = document.getElementById('checkInpt').getElementsByTagName("input");
        for (var i = 0; i < ipts.length; i++) {
            code.push(ipts[i].value);
        }
        code = code.join('');  //==>>转为字符串
        //console.log(code);

        var paramObj = {
            method: "save_record",
            session: "365d1b669d6146d896921275a7475e201111",
            mid: "3215645154",
            params: {
                address: address,
                money: money,
                cost: cost,
                code: code

            }
        };
        // ==>> 调用ajax 进行判断
        catdv.ajax.postJsonForm('http://maopan.gsie.cn/cat', JSON.stringify(paramObj), function (res) {
            MINT.Indicator.close();
            if (res.data && res.data.result) {
                //数据及时更新
                catdv.setData('', 'withdraw.recordId', res.data.data.recordId);         //订单号
                catdv.setData('', 'withdraw.cost', res.data.data.cost);                 //手续费
                catdv.setData('', 'withdraw.address', res.data.data.address);           //收获地址
                MINT.Toast({
                    message: '操作成功',
                    iconClass: 'icon icon-success'
                });
                setTimeout(function () {
                    catdv.datas.apd.withdraw.popUpClassFlag = 'hide';
                    catdv.toLink('wd_succ');
                }, 3000);
            } else {//错误判断
                MINT.Toast(res.data.error.msg);
                catdv.datas.apd.withdraw.withdrawTipsFlag = false;
                catdv.datas.apd.withdraw.errorIdClass = true;

            }
        });


    }

};

// ==>> 6.提币成功，调到挖矿中页面
catdv.success = function () {
    catdv.toLink('mn_main');
};


/*   -----    提币步骤完毕  end ------------------    */






/*---------      提币记录操作获取列表数据(Ajax请求)  start     ---------------*/
// ==>> 1.进入页面获取数据
catdv.record_init = function (e) {
    console.log(111);
    var paramObj = {
        method: "list_record",
        mid: "99999"
    };

    var wd = catdv.datas.apd.withdraw;
    // ==>> 判断是否请求数据(核心拦截)  wd.records有数据，并且length长度不为0，进入页面就不在请求了。
    if (wd.records && wd.records.length) {
        return;
    }
    tools.ajax(hl_config.url.url, 'withdraw', true, paramObj, {}, e, function (res) {
        var list = res.data.data.records;
        if (!list || list.length === 0) {//如果请求的列表为空，不在去后台请求
            //a.listDataEnd = true;
        } else {
            //将请求数据放入到列表中
            var totalPage = Math.ceil((res.data.data.totalCount / catdv.datas.apd.withdraw.refers.pageSize));
            catdv.setData('', "withdraw", res.data.data);
            catdv.setData('', "withdraw.refers.totalPageNo", totalPage); // ====>> 设置数据
            //重置pageNoNum为请求下一页做准备
            //tools.getWithdraw().refers.pageNo = p;
            tools.getWithdraw().refers.totalpageNo = Math.ceil((res.data.data.totalCount / tools.getWithdraw().refers.pageSize));
        }
    }, function (res) {
        console.log('获取失败，稍候重试');
    });
};


//加载更多，上拉
catdv.record_bottom_load = function (e) {
    var paramObj = {
        method: "list_record",
        mid: "99999"
    };
    var a = catdv.datas.apd, p = a.withdraw.refers.pageNo + 1;
    a.withdraw.refers.pageNo = p;

    if (p > a.withdraw.refers.totalPageNo) {
        e.$refs.listLoadmore.onBottomLoaded();
        a.withdraw.recordsListDataEnd = true;
        return;
    }
    tools.ajax(hl_config.url.url, 'withdraw', true, paramObj, {}, e, function (res) {
        var oldList = catdv.datas.apd.withdraw.records;
        var newList = res.data.data.records;
        if (newList.length > 0) {
            newList.forEach(function (item, index, self) {
                oldList.push(item);
            });
        }
    }, function (res) {
        console.log('获取失败，稍候重试');
    });

};


//下拉
catdv.record_top_load = function (e) {
    catdv.record_init(e);
};

//提币记录某天记录的详情页面
catdv.records_details = function (_this) {
    var address = _this.getAttribute('address');
    var cost = _this.getAttribute('cost');
    var money = _this.getAttribute('money');
    var time = _this.getAttribute('time');
    var recordId = _this.getAttribute('recordId');
    var status = _this.getAttribute('status');

    catdv.setData('', 'withdraw.recordDetails.address', address);
    catdv.setData('', 'withdraw.recordDetails.cost', cost);
    catdv.setData('', 'withdraw.recordDetails.money', money);
    catdv.setData('', 'withdraw.recordDetails.createTime', time);
    catdv.setData('', 'withdraw.recordDetails.recordId', recordId);
    catdv.setData('', 'withdraw.recordDetails.status', status);
    catdv.toLink('wd_details', {address: address, cos: cost, money: money, time: time});
};


/*---------      提币记录操作获取列表数据(Ajax请求)  end    ---------------*/


// == 全部提取按钮
function total_get_sure_withdraw_all() {
    catdv.datas.apd.withdraw.useIncome = catdv.datas.apd.withdraw.unuseIncome;
    calculation_cost();
}


// ==>> 验证码填写错误， 再一次发送验证码
function popup_send() {
    catdv.datas.apd.withdraw.withdrawTipsFlag = true;
    catdv.datas.apd.withdraw.errorIdClass = false;
    catdv.withdraw_start();
    var ipt = document.getElementById('checkInpt').getElementsByTagName('input');

    for (var i = 0; i < ipt.length; i++) {
        ipt[i].value = '';
    }
    ipt[0].focus();
}


// ==>> 控制手机验证码失去焦点
function phoneCheck() {
    var txts = document.getElementById('checkInpt').getElementsByTagName("input");
    for (var i = 0; i < txts.length; i++) {
        var t = txts[i];
        t.index = i;
        t.setAttribute("readonly", true);
        t.onkeyup = function () {
            this.value = this.value.replace(/^(.).*$/, '$1');
            var next = this.index + 1;
            if (next > txts.length - 1) return;
            txts[next].removeAttribute("readonly");
            txts[next].focus();
        }
    }
    txts[0].removeAttribute("readonly");
}


//==>>切换tips信息,提示信息
function user_ipt() {
    catdv.datas.apd.withdraw.tipsFlag = true
}

//==>> 关闭弹框
function withdraw_close_popUp() {
    catdv.datas.apd.withdraw.popUpClassFlag = 'hide';
}

//提示框弹出来
function pop_tips() {
    catdv.datas.apd.withdraw.popTipsFlag = false;

}

//关闭框弹出来
function pop_tips_close() {
    catdv.datas.apd.withdraw.popTipsFlag = true;
}

//==>>输入可提取币数，计算手续费
function calculation_cost() {
    var useIncome = catdv.datas.apd.withdraw.useIncome;
    catdv.datas.apd.withdraw.cost = (catdv.datas.apd.withdraw.useIncome * 0.05);
    var price = catdv.datas.apd.withdraw.useIncome;  //用户输入的提取数量
    var all = catdv.datas.apd.withdraw.unuseIncome;  //总共可提取的数量
    if (price.length === 0) {


        catdv.datas.apd.withdraw.cost = 0;
    }
    // if (!isNaN(price)) {
    //     MINT.Toast('输入格式不正确，请重新输入');
    //     catdv.datas.apd.withdraw.useIncome = 0;
    //     catdv.datas.apd.withdraw.cost = 0;
    //     return;
    // }
    if (price > all) {
        catdv.datas.apd.withdraw.tipsFlag = false;
        return;
    } else {
        catdv.datas.apd.withdraw.tipsFlag = true
    }
    // 点后最多八位
    if (useIncome.toString().slice(useIncome.toString().indexOf('.') + 1).length > 8) {
        MINT.Toast('小数点后最多八位,请重新输入');
        catdv.setData('', 'withdraw.useIncome', '');
        catdv.datas.apd.withdraw.cost = 0;
        return;
    }
    // 点前五位
    if (useIncome.toString().slice(0,useIncome.toString().indexOf('.')).length > 5) {
        MINT.Toast('小数点前最多三位,请重新输入');
        catdv.setData('', 'withdraw.useIncome', '');
        catdv.datas.apd.withdraw.cost = 0;
        return;
    }
}


//==>>进入挖矿攻略页面
catdv.mn_strategy = function () {
    catdv.toLink('mn_strategy')
};







