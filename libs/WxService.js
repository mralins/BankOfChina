import tools from 'tools'
import es6 from 'es6-promise'

const Promise = es6.Promise

class Service {
    constructor() {
        this.__init()
    }

    __init() {
        this.wx = wx
        this.tools = new tools
    }

    request(params) {
    	return new Promise((resolve, reject) => {
    		this.wx.request({
    			url: params.url,
    			data: params.data,
    			header: params.header,
    			method: params.method,
				success: res => resolve(res),
	            fail: res => reject(res),
			})
    	})
    }
}

export default Service