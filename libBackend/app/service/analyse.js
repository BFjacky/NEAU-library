const grxx = require('../../models/grxx.js')
const rankTotalBooks = require('../../models/rankTotalBooks.js')
const nowBorrow = require('../../models/nowBorrow.js');
module.exports = app => {
    class analyseService extends app.Service {

        async rankTotalBooks() {
            /*
                对总借阅数量进行排名;
                并插入到数据库中
             */
            //获取数据库中所有的grxx
            function getAllGrxx() {
                return new Promise((resolve, reject) => {
                    let whereStr = {};
                    grxx.find(whereStr).sort('-totalBooks').exec((err, res) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(res);
                        }
                    })
                })
            }
            function upsertRank(stuId, rankCount, rankPercent, totalBooks) {
                return new Promise((resolve, reject) => {
                    let whereStr = { stuId: stuId };
                    let updateStr = {
                        rankCount: rankCount,
                        rankPercent: rankPercent,
                        totalBooks: totalBooks,
                    };
                    let cond = { upsert: true, multi: true };

                    rankTotalBooks.update(whereStr, updateStr, cond, function (err, res) {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(res);
                        }
                    })
                })
            }
            return new Promise(async (resolve, reject) => {
                try {
                    //grxx全部数据
                    let totalRes = await getAllGrxx();
                    let rankPercent;
                    let rankCount;
                    //调试i=0时的特殊情况
                    totalRes[-1] = 0;
                    //-----------------
                    for (let i = 0; i < totalRes.length; i++) {
                        if (totalRes[i].totalBooks != totalRes[i - 1].totalBooks) {
                            rankCount = i + 1;
                        }
                        rankPercent = rankCount / totalRes.length;
                        rankPercent = String(rankPercent);
                        rankPercent = rankPercent.slice(2, 7);
                        let rankPercent1 = rankPercent.slice(0, 2) + '.';
                        let rankPercent2 = rankPercent.slice(2, 5) + '%';
                        rankPercent = rankPercent1 + rankPercent2;

                        console.log(totalRes[i].stuId, rankCount, rankPercent, totalRes[i].totalBooks)

                        //将结果插入到数据库,我希望它是完全并发的，但又想获得一个大概的时间,
                        //所以在最后一条数据插入时用await阻塞了一下
                        if (i === totalRes.length - 1) {
                            await upsertRank(totalRes[i].stuId, rankCount, rankPercent, totalRes[i].totalBooks)
                        }
                        else {
                            upsertRank(totalRes[i].stuId, rankCount, rankPercent, totalRes[i].totalBooks)
                        }

                    }
                    resolve('成功将totalBooks排名信息更新!');
                } catch (err) {
                    reject(err);
                }
            })
        }

        //由stuId获得一名同学的总借阅量排名
        async getRank(stuId) {
            return new Promise((resolve, reject) => {
                let whereStr = { stuId: stuId }
                rankTotalBooks.find(whereStr, (err, res) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(res);
                    }
                })
            })
        }

        
        async getNeedBackBooks() {
            /*
                获取所有距离还书日期小于7天的书数据
                let res = await remindStudent();
                得到res包括所有剩余小于7天的对象数组;
                对象属性:{
                    stuId: '',              //学号
                    bookName: '',           //书名
                    leftDays: '',           //剩余天数
                    renewNum: '',           //可续借情况
                }
            */

            //获取数据库中所有的当前借阅信息
            async function AllnowBorrow() {
                return new Promise((resolve, reject) => {
                    let whereStr = {};
                    nowBorrow.find(whereStr, (err, res) => {
                        if (err) {
                            err.message = 'nowBorrow.find()时出错!';
                            reject(err);
                        } else {
                            resolve(res);
                        }
                    })
                })
            }

            //返回一个包含当前年月日的数组
            function getDate() {
                let date = new Date();
                let year = date.getFullYear();
                let month = date.getMonth() + 1;
                let day = date.getDate();
                let res = [];
                res[0] = parseInt(year);
                res[1] = parseInt(month);
                res[2] = parseInt(day);
                return res;
            }
            //计算当前日期距离还书日期的时间
            function NowtoLawBack(lawBackDate) {
                let date = getDate();
                //年差
                let subYear = lawBackDate[0] - date[0];
                //月差
                let subMonth = lawBackDate[1] - date[1];
                //日差
                let subDay = lawBackDate[2] - date[2];
                //最后用天数来计算距离还书的时间
                let leftDays = (subYear * 12 + subMonth) * 30 + subDay;
                return leftDays;
            }
            
            //提醒学生还书或续借
            return new Promise(async (resolve, reject) => {
                let res;
                let needRemind = [];
                let index = 0;
                try {
                    res = await AllnowBorrow();
                } catch (err) {
                    reject(err);
                }
                try {
                    for (let i = 0; i < res.length; i++) {

                        let lawBackDate = res[i].lawBackDate;
                        let bookName = res[i].bookName;
                        let renewNum = res[i].renewNum;
                        //将lawBackDate字符串转换为年月日整型数组--------------
                        lawBackDate = lawBackDate.slice(-10);
                        lawBackDate = lawBackDate.split('-');
                        lawBackDate[0] = parseInt(lawBackDate[0]); //年
                        lawBackDate[1] = parseInt(lawBackDate[1]);  //月
                        lawBackDate[2] = parseInt(lawBackDate[2]); //日
                        //--------------------------------------------------
                        let leftDays = NowtoLawBack(lawBackDate);
                        //--------------------------------------------------
                        needRemind[index] = {
                            stuId: '',
                            bookName: '',
                            leftDays: '',
                            renewNum: '',
                        }
                        //--------------------------------------------------
                        if (parseInt(leftDays) <= 7) {
                            needRemind[index].stuId = res[i].stuId;
                            needRemind[index].bookName = res[i].bookName;
                            needRemind[index].leftDays = leftDays;
                            needRemind[index].renewNum = renewNum;
                            index++;
                        }

                    }
                    resolve(needRemind);
                } catch (err) {
                    err.message = 'remindStudent中属性值出错（为undefined or null）';
                    reject(err);
                }
            })



        }
    }
    return analyseService;
}