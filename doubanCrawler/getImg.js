const urllib = require('urllib');
const iconv = require('iconv-lite');
const path = require('path');
const fs = require('fs');
const cheerio = require('cheerio');

const getDoubanHtml = async (ISBN) => {
    const res = await urllib.request('https://book.douban.com/subject_search', {
        method: 'POST',
        data: { search_text: ISBN, cat: 1001 },
    });

    //const html = iconv.decode(res.data, 'GBK');
    const html = res.data.toString();
    fs.writeFileSync("./html.html",html);
    return html;
}

const doit = async function () {
    console.log(await getDoubanHtml("7-80207-024-4"))
}
doit();
// module.exports = async function getExamInfo(stuId) {

//     const html = await getExamInfoHtml(stuId);

//     // use cheerio to parse html
//     let results = [];
//     const $ = cheerio.load(html);
//     items = $('tr');
//     items.each(function (index, iten) {
//         let chiildren = $(this).find('font');
//         let msg = {};
//         msg.time = chiildren.eq(0).text().trim();
//         msg.location = chiildren.eq(1).text().trim();
//         msg.courseNumber = chiildren.eq(2).text().trim();
//         msg.courseName = chiildren.eq(3).text().trim();
//         msg.stuId = chiildren.eq(4).text().trim();
//         msg.stuName = chiildren.eq(5).text().trim();
//         results.push(msg);
//     })
//     return results;



// }
