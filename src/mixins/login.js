import wepy from 'wepy';
import {request} from '../utils/request'

/*
* 登录流程
* 1. 检查token，本地是否存有  session_token
*
* **/
export default class login extends wepy.mixin {
    data = {
        login: 'This is login mixin.'
    }
    methods = {
        checkToken() {
            let session_token = wx.getStorageSync('session_token');
            console.log('session_token', session_token)
            if(session_token) {
                //存在直接返回
                this.$navigate({
                    url: 'index'
                })
            }else {
                //不存在时判断有没有认证过小程序
                this.isRegister();
            }
        },

        login () {
            console.log('begin login');

        }
    }
    checkToken() {
        let session_token = wx.getStorageSync('session_token');
        console.log('session_token', session_token)
        if(session_token) {
            //存在直接返回
            this.$navigate({
                url: 'index'
            })
        }else {
            //不存在时判断有没有认证过小程序
            this.isRegister();
        }
    }
    isRegister() {
        wx.login({
            success: wxLogin=>{
                console.log('wxLogin:::', wxLogin);
                if (wxLogin.code) {
                    request({
                        url: '/weixin/login',
                        method: 'GET',
                        data: {
                            code: wxLogin.code
                        },
                        success: res=>{
                            console.log('res::::', res);
                            if(!res.error_code) {
                                const { session_token } = res.data;
                                try {
                                    wx.setStorageSync('session_token', session_token)
                                } catch (e) { }
                                if(session_token) {
                                    console.log('未授权');
                                }else {
                                    console.log('已授权');
                                }
                            }
                        }
                    })
                }else {
                    console.log('获取登录code失败')
                }
            },
            fail: (res)=>{
                console.log('fail:::', res)
            }
        })
    }
    onShow() {
        console.log('mixin onShow')
    }

    onLoad() {
        console.log('mixin onLoad')
    }
}
