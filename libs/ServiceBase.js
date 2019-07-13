import es6 from 'es6-promise'

class ServiceBase {
    constructor() {
        this.__init()
    }

    __init() {
        const that = this
        that.suffix = 'Request'
        that.instanceSource = {
            method: [
                'OPTIONS', 
                'GET', 
                'HEAD', 
                'POST', 
                'PUT', 
                'DELETE', 
                'TRACE', 
                'CONNECT',
            ]
        }
        for(let key in that.instanceSource) {   
            that.instanceSource[key].forEach(function(method) {
                that[method.toLowerCase() + that.suffix] = function() {
                    return that.__getPromise(es6.Promise, that.__getResolver(that.__defaultRequest, [method, ...arguments], that))
                }
            })
        }
    }

    __getPromise(Promise, resolver) {
        if(Promise) return new Promise(resolver)
        throw new Error('Promise library is not supported')
    }

    __getResolver(method, args, context) {
        return function(resolve, reject) {
            method.apply(context, args)(resolve, reject)
        }
    }

    __defaultRequest(method = '', url = '', params = {}) {
        const $$header = this.setHeaders()
        const $$url = `${url}`
        // console.log($$url)
        // console.log(params)

        return function(resolve, reject) {
            wx.request({
                url: $$url,
                method: method,
                data: params,
                header: $$header,
                success: res => {
                    resolve(res.data)
                },
                fail: res => {
                  reject(res)
                },
                complete: res => {
                  // console.log('加载完成');
                }
            })
        }
    }

    setHeaders() {
        return {
        }
    }
}

export default ServiceBase