/**
 * @method 获取列表数据
 * @param url 请求地址
 * @author phuhoang
 */

export function GetList(url) {
  return function (target, propertyKey) {
    target[propertyKey] = function () {
      target[propertyKey] = [];
      this.http.post(url, {}, false).then(res => target[propertyKey] = res.result == 1000 ? (res.data.list || res.data) : []).catch(err => target[propertyKey] = []);
    }
  }
}