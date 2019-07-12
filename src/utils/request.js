import {HOST, API_PREFIX} from './config';

// options 参考 https://mp.weixin.qq.com/debug/wxadoc/dev/api/network-request.html
module.exports.request = function(options) {
    if (options.url.indexOf('http') !== 0) {
        options.url = API_PREFIX + options.url;
    }

    if (!options.method) {
        options.method = 'POST';
    }
    if (options.loading !== false) {
        options.loading = true;
    }

    if (options.method === 'POST' || options.method === 'PUT') {
        options.header = Object.assign({
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-auth-token': wx.getStorageSync('session_token')
        }, options.header);

        // 处理 data，仅支持一层结构，支持上传数组数据，例如{url:['1','2']} 会转换为 url[]=1&&url[]=2
        let data = options.data || {};
        let keys = Object.keys(data);
        let datas = [];

        keys.forEach(key=>{
            let value = data[key];
            if (!Array.isArray(value)) {
                datas.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
            }
            else {
                value.forEach(v=>datas.push(`${encodeURIComponent(key)}[]=${encodeURIComponent(v)}`));
            }
        });

        if (options.token !== false) {
            datas.push(`token=${wx.getStorageSync('session_token')}`)
        }

        options.data = datas.join('&');
    }
    if(options.method === 'GET' ) {
        options.header = Object.assign({
            'X-auth-token': wx.getStorageSync('session_token')
        }, options.header);
    }
    // if (options.method === 'PUT') {
    //   options.header = Object.assign({
    //     'X-auth-token': wx.getStorageSync('token')
    //   }, options.header);
    //   if (options.token !== false) {
    //     datas.push(`token=${wx.getStorageSync('token')}`)
    //   }
    // }
    const originFail = options.fail;
    options.fail = function(error) {
        wx.hideLoading();
        originFail && originFail(error);
    }

    if (!options.noDefaultSuccess) {
        let success = options.success;
        options.success = function(res) {
            console.log('res', res)
            let result = res.data;
            if (result.error_code && result.error_code != 9998) {
                console.log(result)
            }

            wx.hideLoading();

            success && success.call(null, result);
        }
    }

    if (options.loading) {
        wx.showLoading();
    }
    console.log(`发送请求：${options.url}`, options);
    return wx.request(options)
}