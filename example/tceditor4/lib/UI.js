/**
 * UI系统
 * @author Haitao Li
 * @mail 279641976@qq.com
 * @site http://lbxx1984.github.io/
 */
/**
 * @constructor
 * @param {function} callback ui发生触发时的总回调
 */
function UI(callback) {


    //用于闭包的this指针副本
    var _this = this;
    //激活的关节input组件
    this.display = {};
    //激活的关节id
    this.currentJoint = null;
    //激活的物体
    this.currentMesh = null;
    //菜单栏(左上角)
    this.menuBar = $('#menu');
    //信息显示栏(右下角)
    this.informationBar = $('#information');
    //附加控制按钮栏(菜单栏右侧，默认隐藏)
    this.affiliatedBar = $('#affiliatedButtons');
    //控制按钮栏(菜单栏下方)
    this.controlBar = $('#control');
    //TAB导航栏(右上角)
    this.tabNavigator = $('#tabNavigator');
    //TAB的SCENE面板(右侧，TAB导航下，默认显示)
    this.scene = $('#SCENE');
    //TAB的MESH面板(右侧，TAB导航下，默认隐藏)
    this.mesh = $('#MESH');

    
    /**注册事件*/
    this.menuBar.bind('mouseleave', menuMouseLeaveHandler);
    this.menuBar.find('ul>li').bind('mousemove', menuMouseMoveHandler);
    this.menuBar.find('.menuitem').bind('click', menuClickHandler);
    this.affiliatedBar.bind('click', affiliatedBarClickHandler);
    this.controlBar.bind('click', controlBarClickHandler);
    this.scene.find('label').bind('click', hideItemHandler);
    this.scene.find('input').bind('change', sceneCtrlChangeHandler);
    this.mesh.find('label').bind('click', hideItemHandler);
    this.mesh.find('input').bind('change', meshCtrlChangeHandler);
    this.tabNavigator.find('li').bind('click', tabNavigatorClickHandler);
    $('#mesh_material').bind('change', selectChangeHandler);
    $('#meshlist').bind('click', itemClickHandler);
    $('#lightlist').bind('click', itemClickHandler);
    $('#vectorlist').bind('change', vectorChangeHandler);


    /**处理句柄*/
    /**
     * 场景信息输入框更改事件
     * @param {Object} e change事件对象
     */
    function sceneCtrlChangeHandler(e) {
        callback({
            type: 'change',
            cmd: e.target.id,
            value: e.target.value
        });
        return;
    }
    /**
     * 物体信息输入框更改事件
     * @param {Object} e change事件对象
     */
    function meshCtrlChangeHandler(e) {
        var geo = stage.getGeometryByID(config.geometry.selected);
        var value = Number(e.target.value);
        if (!geo || isNaN(value)) return;
        var obj = {};
        obj.type = 'change';
        obj.cmd = e.target.id;
        obj.value = value;
        obj.geo = geo;
        obj.sync = $('#mesh_scale_sync')[0].checked;
        if (obj.cmd.indexOf('_s') > -1) {
            if (obj.cmd == 'mesh_sx') {
                obj.value = obj.value / geo.scale.x;
            } else if (obj.cmd == 'mesh_sy') {
                obj.value = obj.value / geo.scale.y;
            } else if (obj.cmd == 'mesh_sz') {
                obj.value = obj.value / geo.scale.z;
            }
            if (obj.value == 0) obj.value = 1;
            if (obj.sync) {
                var x = $('#mesh_sx'),
                    y = $('#mesh_sy'),
                    z = $('#mesh_sz')
                if (obj.cmd != 'mesh_sx') {
                    x.val((x.val() * obj.value).toFixed(2));
                }
                if (obj.cmd != 'mesh_sy') {
                    y.val((y.val() * obj.value).toFixed(2));
                }
                if (obj.cmd != 'mesh_sz') {
                    z.val((z.val() * obj.value).toFixed(2));
                }
            }
        }
        callback(obj);
        return;
    }
    /**
     * 关节顶点输入框更改事件
     * @param {Object} e change事件对象
     */
    function vectorChangeHandler(e) {
        var arr = e.target.id.split('_');
        var geo = stage.getGeometryByID(arr[0]);
        if (!geo) return;
        var x, y, z, obj;
        x = $('#' + arr[0] + '_' + arr[1] + '_x').val();
        y = $('#' + arr[0] + '_' + arr[1] + '_y').val();
        z = $('#' + arr[0] + '_' + arr[1] + '_z').val();
        if (isNaN(x) || isNaN(y) || isNaN(z)) return;
        obj = {};
        obj.type = 'change';
        obj.cmd = 'mesh_joint';
        obj.geo = geo;
        obj.joint = Number(arr[1]);
        obj.value = [Number(x), Number(y), Number(z)];
        callback(obj);
        return;
    }
    /**
     * item点击事件
     * @param {Object} e 鼠标事件对象
     */
    function itemClickHandler(e) {
        var id = '', type = '', dom = null, listname = 'mesh';
        if (e.target.className.indexOf('listitem') > -1) {
            dom = e.target;
        } else {
            dom = e.target.parentNode;
        }
        if (dom.parentNode.id == 'meshlist') {
            listname = 'mesh'
        } else {
            listname = 'light'
        }
        if (e.target.className.indexOf('visible') > -1) {
            if (e.target.className.indexOf('active3') > -1) {
                e.target.className = 'iconfont visibleButton';
                e.target.innerHTML = '&#xe615;';
                type = listname + '_visible';
            } else {
                e.target.className = 'iconfont visibleButton active3';
                e.target.innerHTML = '&#xe614;';
                type = listname + '_hide';
            }
        } else if (e.target.className.indexOf('lock') > -1) {
            if (e.target.className.indexOf('active3') > -1) {
                e.target.className = 'iconfont lockButton';
                e.target.innerHTML = '&#xe605;';
                type = listname + '_lock';
            } else {
                e.target.className = 'iconfont lockButton active3';
                e.target.innerHTML = '&#xe600;';
                type = listname + '_unlock';
            }
        } else if (e.target.className.indexOf('trash') > -1) {
            type = listname + '_trash';
        } else {
            type = listname + '_select';
        }
        id = dom.id;
        callback({
            type: 'click',
            cmd: type,
            value: id,
            dom: dom
        });
        return;
    }
    /**
     * 所有下拉菜单事件
     * @param {Object} e 鼠标事件对象
     */
    function selectChangeHandler(e) {
        //修改当前选中物体的材质
        if (e.target.id == 'mesh_material') {
            var geo = stage.getGeometryByID(config.geometry.selected);
            var mat = material.get(e.target.value);
            if (!geo || !mat) return;
            geo.material = mat;
        }
        return;
    }
    /**
     * tab导航点击事件
     */
    function tabNavigatorClickHandler() {
        if (this.parentNode.currentActive == null) {
            this.parentNode.currentActive = this.parentNode.firstChild;
        } 
        $(this.parentNode.currentActive).removeClass('active');
        this.parentNode.currentActive = this;
        $(this.parentNode.currentActive).addClass('active');
        $('#tabContent>div').addClass('tabItemHide');
        var id = $(this).text().replace(/[^a-z]/ig, '');
        $('#' + id).removeClass('tabItemHide');
        return;
    } 
    /**
     * 二级label点击事件
     */
    function hideItemHandler() {
        var id = this.id.substr(1);
        var type = this.innerHTML.charAt(0);
        var inner = this.innerHTML.substr(1);
        type = (type == '▼') ? '▶' : '▼'
        this.innerHTML = type + inner;
        if (type == '▼') {
            $('#' + id).removeClass('tabItemHide');
        } else {
            $('#' + id).addClass('tabItemHide');
        }
        return;
    } 
    /**
     * 控制按钮栏点击事件
     * @param {Object} event 鼠标事件对象
     */
    function controlBarClickHandler(event) {
        if (event.target.id == null) return;
        var arr = event.target.id.split('_');
        if (arr[0] == 'view' || arr[0] == 'tool') {
            $(this).find('div[id^="' + arr[0] + '"]').removeClass('active');
            $(event.target).addClass('active');
            callback({
                type: arr[0],
                cmd: arr[1]
            });
        } else {
            if (event.target.id == 'grid_show') {
                event.target.data_hidden = !event.target.data_hidden;
                if (event.target.data_hidden) {
                    $(event.target).html('&#xe614;');
                    callback({
                        type: 'click',
                        cmd: 'grid_hidden'
                    });
                } else {
                    $(event.target).html('&#xe615;');
                    callback({
                        type: 'click',
                        cmd: 'grid_show'
                    });
                }
            } else {
                callback({
                    type: 'click',
                    cmd: event.target.id
                });
            }
        }
        return;
    }
    /**
     * 菜单鼠标点击事件
     * @param {Object} event 鼠标事件对象
     */
    function menuClickHandler(event) {
        if (event.target.id.indexOf('g_') > -1) {
            callback({
                type: 'tool',
                cmd: event.target.id
            });
            _this.controlBar.find('div[id^="tool"]').removeClass('active');
        }
        return;
    }
    /**
     * 菜单鼠标移动事件
     * @param {Object} event 鼠标事件对象
     */
    function menuMouseMoveHandler(event) {
        if (_this.menuBar.current) {
            $('#' + _this.menuBar.current).css('display', 'none');
        }
        _this.menuBar.current = event.target.innerHTML.replace(/[^a-z]/ig, '');
        $('#' + _this.menuBar.current).css({
            'display': 'block',
            'left': $(this).offset().left + 'px'
        });
        return;
    }
    /**
     * 菜单鼠标离开事件
     */
    function menuMouseLeaveHandler() {
        _this.menuBar.find('div').css({'display': 'none'});
        return;
    }
    /**
     * 附属控制栏点击事件
     * @param {Object} event 鼠标事件对象
     */
    function affiliatedBarClickHandler(event) {
        if (event.target.id == null) return;
        var arr = event.target.id.split('_');
        if (arr.length == 3 && arr[0] == 'transformer') {
            $(this).find('div[id^="' + arr[0] + '"]').removeClass('active');
            $(event.target).addClass('active');
            callback({
                type: 'click',
                cmd: arr[0] + '_' + arr[1]
            });
        } else if (arr[1] == 'world') {
            var tag = $(event.target);
            var key = 'world';
            if (tag[0].current == 1) {
                tag[0].current = 0;
                tag.html('&#xe611;');
            } else {
                tag[0].current = 1;
                key = 'local';
                tag.html('&#xe60e;');
            }
            var r = callback({
                type: 'click',
                cmd: arr[0] + '_' + key
            });
            if (r) {
                if (tag[0].current == 1) {
                    tag[0].current = 0;
                    tag.html('&#xe611;');
                } else {
                    tag[0].current = 1;
                    tag.html('&#xe60e;');
                }
            }
        } else {
            callback({
                type: 'click',
                cmd: arr[0] + '_' + arr[1]
            });
        }
        return;
    }

    return;
}


/**
 * 设置某个颜色显示器的颜色
 * @param {string} p 显示器ID前缀
 * @param {string} v CSS颜色
 */
UI.prototype.setColors = function(p, v) {
    $('#' + p + '_color').val(v);
    return;
}
/**
 * 显示摄像机信息
 * @param {Object} p 摄像机位置信息position
 * @param {Object} l 摄像机观察点位置信息lookAt
 * @param {Object} r 摄像机焦距 Radius
 */
UI.prototype.setCameraInfo = function(p, l, r) {
    $('#camera_px').val(p.x.toFixed(2));
    $('#camera_py').val(p.y.toFixed(2));
    $('#camera_pz').val(p.z.toFixed(2));
    $('#camera_lx').val(l.x.toFixed(2));
    $('#camera_ly').val(l.y.toFixed(2));
    $('#camera_lz').val(l.z.toFixed(2));
    $('#camera_r').attr('max', r.b).attr('min', r.a).val(r.r);
    return;
}
/**
 * 显示鼠标位置
 * @param {Object} pos 3D位置对象
 */
UI.prototype.setMousePosition = function(pos) {
    var out = [
        'x:', parseInt(pos.mouse3d.x), ' ',
        'y:', parseInt(pos.mouse3d.y), ' ',
        'z:', parseInt(pos.mouse3d.z)
    ];
    this.informationBar.html(out.join(''));
    return;
}
/**
 * 在信息栏显示信息
 * @param {string} str 信息串
 */
UI.prototype.alert = function(str) {
    this.informationBar.html(str);
    return;
}
/**
 * 显示指定的附加控制栏，或隐藏附加控制栏
 * @param {string} type 附加控制栏名称，如果为空则隐藏所有附加控制栏
 */
UI.prototype.affiliatedBarShow = function(type) {
    if (type) {
        this.affiliatedBar.css({'display': 'block'});
        this.affiliatedBar.find('div,span').css('display', 'none');
        this.affiliatedBar.find('[id^="' + type + '"]').css('display', 'inline-block');
    } else {
        this.affiliatedBar.css({'display': 'none'});
    }
    return;
}
/**
 * 设置网格复选框选中状态
 * @param {boolean} 是否选中
 */
UI.prototype.gridVisible = function(v) {
    var d = $('#grid_visible')[0];
    if (v == null) {
        if (d.checked) {
            d.checked = false;
        } else {
            d.checked = true;
        }
    } else {
        d.checked = v;
    }
    return;
} 
/**
 * 切换视角按钮激活状态
 * @param {string} type 附加控制栏名称，如果为空则隐藏所有附加控制栏
 */
UI.prototype.changeView = function(view) {
    this.controlBar.find('div[id^="view"]').removeClass('active');
    $('#view_' + view).addClass('active');
    return;
}
/**
 * 显示材质列表
 * @param {Array} arr 材质配置信息
 */
UI.prototype.addMaterials = function(arr) {
    var s = $('#mesh_material');
    for (var key in arr) {
        s.append('<option>' + key + '</option>');
    }
    return;
}
/**
 * 显示灯光列表
 * @param {Array} arr 灯光配置信息
 */
UI.prototype.addLights = function(arr) {
    for (var key in arr) {
        this.addItem('light', key);
    }
    return;
}
/**
 * 向指定容器中添加自定义item条目
 * @param {string} type 容器名称
 * @param {string} id item的id
 */
UI.prototype.addItem = function(type, id) {
    if (!type || !id) return;
    var arr = [
        '<div class="listitem" id="',id,'">',
            '<div class="iconfont visibleButton">&#xe615;</div>',
            '<div class="iconfont lockButton">&#xe605;</div>',
            '<div class="itemTitle">',id,'</div>',
            '<div class="iconfont trashButton">&#xe60c;</div>',
        '</div>'
    ];
    $('#' + type + 'list').append(arr.join(''));
    return;
}
/**
 * 显示选中物体信息
 * @param {number} id 物体id
 */
UI.prototype.selectMesh = function(id) {
    $('#meshlist>div').removeClass('active');
    if (id != null) {
        $('#' + id).addClass('active');
        var geo = stage.getGeometryByID(id);
        if (!geo) return;
        $('#mesh_select').val(id).css({
            'width': '150px',
            'text-align': 'left'
        });
        $('#mesh_material').val(geo.material.name);
        this.freshMeshPRS(geo);
        this.freshMeshVertices(geo);
        this.freshMeshFaces(geo);
    }
    return;
}
/**
 * 显示物体位置、旋转、缩放
 * @param {Object} geo 3D物体对象
 */
UI.prototype.freshMeshPRS = function(geo) {
    if (!geo) return;
    $('#mesh_px').val(geo.position.x.toFixed(2));
    $('#mesh_py').val(geo.position.y.toFixed(2));
    $('#mesh_pz').val(geo.position.z.toFixed(2));
    $('#mesh_rx').val(parseInt(geo.rotation.x * 57.3));
    $('#mesh_ry').val(parseInt(geo.rotation.y * 57.3));
    $('#mesh_rz').val(parseInt(geo.rotation.z * 57.3));
    $('#mesh_sx').val(geo.scale.x.toFixed(2));
    $('#mesh_sy').val(geo.scale.y.toFixed(2));
    $('#mesh_sz').val(geo.scale.z.toFixed(2));
    return;
}
/**
 * 重新渲染物体的顶点集中
 * @param {number} id 3D物体id
 */
UI.prototype.reloadMeshVetrices = function(id) {
    var geo = stage.getGeometryByID(id);
    if (!geo) return;
    this.freshMeshVertices(geo);
    return;
}
/**
 * 显示物体顶点序列
 * @param {Object} geo 3D物体对象
 */
UI.prototype.freshMeshVertices = function(geo) {
    if (!geo || this.currentJoint != null) return;
    var l = $('#vectorlist'), i = '', v = null, n, matrix, pos;
    //显示世界坐标，本地坐标没意义，变换时进行换算就可以了。
    l.html('');
    matrix = tcMath.rotateMatrix(geo);
    for (n = 0; n < geo.geometry.vertices.length; n++) {
        if (n < 10) {
            i = '00';
        } else if (n < 100) {
            i = '0';
        } else {
            i = '';
        }
        v = geo.geometry.vertices[n];
        pos = tcMath.Local2Global(v.x, v.y, v.z, matrix, geo);
        var arr = [
            '<span>No.', i, n, ':</span>',
            '<input type="text" readonly id="', 
                geo.tid, '_', n, '_x" value="', pos[0].toFixed(2), '"/>',
            '<input type="text" readonly id="',
                geo.tid, '_', n, '_y" value="', pos[1].toFixed(2), '"/>',
            '<input type="text" readonly id="',
                geo.tid, '_', n, '_z" value="', pos[2].toFixed(2), '"/><br>'
        ];
        l.append(arr.join(''));
    }
    return;
}
/**
 * 显示物体三角面
 * @param {Object} geo 3D物体对象
 */
UI.prototype.freshMeshFaces = function(geo) {
    if (!geo) return;
    var l = $('#facelist'), i = '', v = null, n;
    l.html('');
    for (n = 0; n < geo.geometry.faces.length; n++) {
        if (n < 10) {
            i = '00';
        } else if (n < 100) {
            i = '0';
        } else {
            i = '';
        }
        v = geo.geometry.faces[n];
        l.append(
            '<span>No.' + i + n + ':</span>' +
            '<input type="text" readonly value="' + v.a + '"/>' +
            '<input type="text" readonly value="' + v.b + '"/>' +
            '<input type="text" readonly value="' + v.c + '"/><br>'
        );
    }
    return;
}
/**
 * 修改代表选中顶点的输入框为可用
 * @param {Object} geo 3D物体对象
 * @param {number} joint 关节顶点索引
 */
UI.prototype.selectJoint = function(geo, joint) {
    $('#' + geo + '_' + joint + '_x').attr('type', 'number').removeAttr('readonly');
    $('#' + geo + '_' + joint + '_y').attr('type', 'number').removeAttr('readonly');
    $('#' + geo + '_' + joint + '_z').attr('type', 'number').removeAttr('readonly');
    this.display.x = $('#' + geo + '_' + joint + '_x');
    this.display.y = $('#' + geo + '_' + joint + '_y');
    this.display.z = $('#' + geo + '_' + joint + '_z');
    this.currentMesh = geo;
    this.currentJoint = joint;
    window.scrollTo(0, this.display.x.offset().top - 300);
    return;
}
/**
 * 修改代表选中顶点的输入框为不可用
 */
UI.prototype.dropJoint = function() {
    var m = this.currentMesh;
    var n = this.currentJoint;
    $('#' + m + '_' + n + '_x').attr('type', 'text').attr('readonly', true);
    $('#' + m + '_' + n + '_y').attr('type', 'text').attr('readonly', true);
    $('#' + m + '_' + n + '_z').attr('type', 'text').attr('readonly', true);
    this.currentMesh = null;
    this.currentJoint = null;
    this.display = {};
    return;
}
/**
 * 重新渲染物体顶点信息
 * @param {Object} geo 3D物体对象
 * @param {number} index 关节顶点索引
 */
UI.prototype.freshMeshVector = function(geo, index) {
    if (!geo || !this.display.x) return;
    var matrix = tcMath.rotateMatrix(geo);
    var v = geo.geometry.vertices[index];
    var pos = tcMath.Local2Global(v.x, v.y, v.z, matrix, geo);
    this.display.x.val(pos[0].toFixed(2));
    this.display.y.val(pos[1].toFixed(2));
    this.display.z.val(pos[2].toFixed(2));
    return;
}
