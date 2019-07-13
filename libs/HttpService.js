import ServiceBase from 'ServiceBase'

class Service extends ServiceBase {
	constructor() {
		super()
		this.$$path = {
      // 获取小程序配置信息
      BaseInfoUrl: 'https://www.huangquemaishou.com/app/boc/bocdetail',
      ShopListUrl: 'https://www.huangquemaishou.com/app/boc/shoplist',
      ShopDetailUrl: 'https://www.huangquemaishou.com/app/boc/shopdetail',
    }
	}

  getAiKaInfo(params) {
    const $$url = `${this.$$path.BaseInfoUrl}`;
    return this.getRequest($$url, params)
  }
  getAiKaShopList(params) {
    const $$url = `${this.$$path.ShopListUrl}`;
    return this.getRequest($$url, params)
  }
  getShopDetail(params) {
    const $$url = `${this.$$path.ShopDetailUrl}`;
    return this.getRequest($$url, params)
  }

}

export default new Service