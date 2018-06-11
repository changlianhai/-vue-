if (!window.catdv)
    window.catdv = {};

/**
 * 全局数据存放点
 */
function hl_data() {
    return {
        //用户安全信息
        uInfo: {
            uid: 2,
            tc: 2
        },
        // 页面所需的数据对象
        apd: {//时间不够，暂不做主列表缓存处理 2017-12-25
            //用于某些详情页面向列表页面的返回
            bak: false,
            isLogoIn: false,
            pageParam: {},
            pageName: '',
            pUrl: hl_config.url.temp,
            dUrl: hl_config.url.data,
            login: {
                wexi: {}
            },
            //一些默认信息
            infor: {
                cnlpn: 1,
                colNewsDataEnd: false,
                rnlpn: 1,
                recNewsDataEnd: false
            },
            //列表数据控制对象，针对mint-ui的mt-loadmore
            listLoadmore: undefined,
            //刷新判定
            listDataEnd: false,
            //列表数据控制对象，针对mint-ui的mt-loadmore
            listDataElement: undefined,
            //新闻详情
            ninfo: {},
            //被抓取的所有新闻列表
            clist: {},
            //被推荐的新闻列表
            rlist: {},


            /**
             * 挖矿项目所需要的数据
             *  1.mining  矿机数量、总比特币数量、收币地址、 挖矿中的列表、 每日挖币详情页面类别、矿机管理列表, 提币记录
             *  2.withdraw  提币步骤所需要的数据
             *  3.nav  导航模块所需的数据
             */

            /**
             *  1.矿机数量、总比特币数量、收币地址、 挖矿中的列表、 每日挖币详情页面类别、矿机管理列表
             */
            mining: {
                data: {
                    session: '',                //用户唯一标识 APP
                    phone: '13403236423',       //用户手机号  -->>APP
                    address: '',                //收币地址
                    totalBTC: 0,                //总的比特币数量
                    noBTCClass: false,          //挖矿中页面是否有列表表示，展示提示信息
                    isActive: '-',              //猫盘活跃数量
                    totalCount: '-',            //猫盘总数量
                    noActive: '-',              //猫盘不活跃数量
                    dayIncome: 0,               //某天提的总币数
                    dayListDataEnd: false,     //挖矿中的列表数据，是否有加载更多
                    dateListDataEnd: false,     //每日挖币详情页面列表，是否有加载更多


                },
                dayList: {                     // 挖矿中的列表数据
                    refers: {
                        totalPageNo:0,
                        pageNo:1,
                        pageSize:10
                    },
                    list: {
                            date: '2017-11-12',
                            details:[

                            ]
                    }
                },
                minerStatus: [    //矿机管理类列表

                ],
                dateDetailsList: {
                        refers: {
                            totalPageNo:0,
                            pageSize:10,
                            pageNo:1
                        },
                         list:  [   //每日挖币详情页面列表  (这里可以做缓存)
                             // {
                             //     "createTime": "2018-05-17 16:07:47.0",
                             //     "id": 53703008,
                             //     "income": 0E-8,
                             //     "modifyTime": "2018-05-17 16:07:50.0",
                             //     "pow": 0.25860000,
                             //     "statDate": "2018-05-16",
                             //     "status": 0,
                             //     "userId": "365d1b669d6146d896921275a7475e20",
                             //     mnInfo: {
                             //         totle: '11',
                             //         list: [
                             //             {},
                             //             {}
                             //         ],
                             //         sn: {}    //唯一标识
                             //     }
                             // }
                         ]
                }
            },
            /**
             * 2. 提币步骤所需要的数据
             */
            withdraw: {
                popUpClassFlag: 'hide',         //提币弹框类名
                popTipsFlag: true,
                withdrawTipsFlag: 'true',       //验证码发送失败和成功，弹框显示内容切换
                currentSelDate: '',             // 当前选择的日期
                unuseIncome: 0,                 //可用
                useIncome: 0,                   //已提取的
                isAddressFlag: true,            //===>>true代表提币顺序， false代表更多进入的,
                tipsFlag: true,                //当用户输入的提币数量大于可以提取的数量，提示信息标识
                cost: 0,                        //手续费
                code: [],                       //手机短信验证码,
                recordId: '',                   //交易号
                getFlagClass: true,            //挖矿中页面，提币按钮样式，是否可以提币的样式
                profitFlag:true,               //累计收益提示标识
                errorIdClass: false,
                recordsListDataEnd: false,    //提币记录列表，是否有刷新
                navFixedClass: false,

                records:[                      //提币记录


                ],
                refers: {                       //提币记录分页
                    pageNo: 1,
                    pageSize: 10,
                    totalPageNo: 0
                },
                recordDetails: {  //提币详细信息
                    count: 0,   //提币个数
                    cost: 0,   //手续费
                    address: '',  //地址
                    createTime: '',  //提币时间
                    recordId: '',  //订单号
                    status: ''    //状态  -1-失败、0-待提取、1-成功
                }
            },


            /**
             *  3.导航模块所需的数据
             */
            nav: {
                title: '',
                address_flag: 'hide'
            }
        }
    }
}