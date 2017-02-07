'use strict';

// add timestamps in front of log messages
// require('console-stamp')(console, 'yyyy/mm/dd HH:MM:ss');
const config = require('./config/config');
const IP_MAP = require('./cml_ip_map.json');
const Promise = require('bluebird');
// const cheerio = require('cheerio');
const table2json = require('tabletojson');
const request = require('request-promise');
const iconv = require('iconv-lite');
const loginFacebook = Promise.promisify(require('facebook-chat-api'));
const fs = require('fs');

const option = {
    method: 'POST',
    uri: 'http://cert.ntu.edu.tw/Module/Index/ip.php',
    encoding: null,
    form: {
        ip1:140,
        ip2:112,
        ip3:29,
        isset:'ok'
    }
};

let msg = {};

request(option)
    .then(buffer => {
        const decoded = iconv.decode(new Buffer(buffer), 'big5');
        const table = table2json.convert(decoded)[1];
        const banned = checkIP(table);

        if (!banned.length) return;
        msg.body = JSON.stringify(banned, null, '\t').replace(/[\{\},\[\]\t]/g, '');

        return loginFacebook(config.account);
    })
    .then(api => {
        api.sendMessage(msg, config.notify_channel_id, function (err) {
            console.log(msg.body);
        });
    })
    .catch(err => console.error(err));


function checkIP(list) {
    return list
        .filter(item => !!IP_MAP[item['違規IP']] )
        .map(item => Object.assign(item, { '主機': IP_MAP[item['違規IP']] }));
}