import wepy from 'wepy';

export default class Request extends wepy.mixin {
    methods={
        request() {
            wepy.request({
                url: '',
                success: ()=>{

                },

            })
        }
    }
}
