/**
 * 材质系统
 * @author Haitao Li
 * @mail 279641976@qq.com
 * @site http://lbxx1984.github.io/
 */
/**
 * @constructor
 */
function Material(){
    /**所有已创建材质的hash表*/
    this.children = {};    
}

/**
 * 根据配置批量创建材质
 * @param {Array} arr 材质配置列表
 */
Material.prototype.load=function(arr){
    if (!(arr instanceof Array)) return;
    this.children = {};
    for (var n = 0; n < arr.length; n++) {
        this.children[arr[n].tid] = new THREE[arr[n].type](arr[n]);
    }
};

/**
 * 根据材质的名称制作对应材质副本并返回
 * @param {string} key 材质的名称
 * @retrun {Object} 材质副本
 */
Material.prototype.get = function(key) {
    var a = this.children[key].clone();
    a.name = key;
    return a;
};