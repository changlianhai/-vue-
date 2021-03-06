/**
 *tools:
 * @type {{getAddr: address.getAddr, setAddr: address.setAddr}}
 */
var tools = {
    getAddr: function () {
        return catdv.datas.apd.mining.data.address || '';
    },
    getWithdraw: function () {
      return catdv.datas.apd.withdraw;    // 提币记录对象集合
    },
    getMining: function () {
      return catdv.datas.apd.mining;      //挖矿集合详情
    },
    setAddr: function () {
        catdv.datas.apd.mining.data.address = val;
    },
    backPage: function () {
        if ( !catdv.backPage() ) {
            catdv.toLink('mn_main'); //没有后退，重定向到首页
        }
    },
    dataFormat: function (dataList) {
        console.log(dataList);
        var obj = {};
        for(var i=0,len=dataList.length;i<len;i++) {
            obj[dataList[i]['statDate']] =dataList[i];
        }
        console.log(obj);
        return obj;
    },

    /**
     *  ajax: 对请求进行封装
     * @param {{string}}    url             请求地址
     * @param {{string}}    modelName       模块名称
     * @param {{boolean}}   isPaging        是否有分页
     * @param {{object}}    params          请求的参数
     * @param {{object}}    queryParams     请求的参数查询的参数
     * @param {{object}}    e               事件对象
     * @param {{function}}  callback        请求成功回调
     * @param {{function}}  error           请求失败回调
     * @return void
     */

    ajax: function (url, modelName, isPaging,params,queryParams, e,callback, error) {
        params.session = '365d1b669d6146d896921275a7475e201111';
        if (isPaging) {
            var a = catdv.datas.apd;
            var ev = e;
            var p = null;
            var s = null;
            var tc = catdv.datas.tc;
            if (modelName.indexOf('.') > -1) {
                var ary = modelName.split('.');
                p = a[ary[0]][ary[1]].refers.pageNo;
                s = a[ary[0]][ary[1]].refers.pageSize
            } else {
                p = a[modelName].refers.pageNo;
                s = a[modelName].refers.pageSize
            }
            params.params = {

                pageNo:p,
                pageSize:s
            };
            for(var key in queryParams) {
                params.params[key] = queryParams[key];
            }
        }
        catdv.ajax.postJsonForm(url, JSON.stringify(params), function (res) {
            if (res.data.result) {
                callback && callback(res);
            } else {//错误判断
                error && error(res);
            }
            //去下下拉状态
            if (isPaging) {
                    ev.$refs.listLoadmore.onBottomLoaded();
            }
        });
    }
};
