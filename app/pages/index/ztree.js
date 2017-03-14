/*
 zTree 依赖 结构  <ul id="ztreeId" class="ztree"></ul> 
 点击弹窗 树形目录  初始化代码如下：
 // clickRenderCallback 是外部回调函数 点击某一项 输出所有需要的值 
 // zNodes 是树形目录的数据结构代码 
  var clickRenderCallback = function(treeNode){
    console.log(treeNode);
  }
  var zSingle = new ZTreeSingle({
    clickRenderCallback: clickRenderCallback
  });
  $('.btn').click(function() {
    zSingle.modalZtree(zNodes);     
  });
  注意：节点名称字段为：accName，子节点字段名为 subList;  idKey字段为 id, pIdKey字段为 parentId 已经和开发约定好了 后续需要
       调用树形菜单 都需要按照这个约定来做。
  data: {
    simpleData: {
      enable: true,
      idKey: 'id', 
      pIdKey: 'parentId'
    },
    key: {
      name: 'accName',
      children: 'subList'
    }
  }
 */
var modalInst;
var modalInst2;
var ZTreeSingle = function(cfg) {
  this.init();
  this.clickRenderCallback = cfg.clickRenderCallback || null; // 点击某一项菜单的回调
  this.newAddCallback = cfg.newAddCallback || null;           // 新增一项的回调
  this.self = this;
};
ZTreeSingle.prototype.init = function() {
  var stylesheet = '.ztree-container {float: left; width: 220px; padding: 0; padding-top: 22px; background: #393857; overflow:scroll;}' + 
    '.ztree{overflow:hidden;padding-right:0px;}' + 
    '.ztree-container .ztree {overflow-x: scroll;}' +
    '.ztree-container .ztree li a {padding-right:100%;}' + 
    '.hidden{display:none}'+
    '.zcontent .value {margin-left: 139px;height: 44px;line-height:44px;}'+
    '.remodal p{font-size: 16px}'+
    '.ztree li span{color: #fff; opacity: 0.5;}'+
    '#j-modal-nd .ztree li span{color: #333; opacity: 1;}' +
    '.ztree li span.useless{opacity: 0.3 !important;}'+
    '#j-modal-nd .ztree li span.useless{opacity: 0.5 !important;}'+
    '.ztree li ul.level0.line{border-left: none}' + 
    '.ztree li span.button.add {background-position: -144px 0;}' + 
    '.ztree li ul.line{background: none; border-left: 1px dotted rgba(142, 140, 231, 0.42);margin-left:8px;}' + 
    '.ztree li ul.noline {border-left: none}' +
    '.ztree li ul{padding-left: 10px; padding-top: 4px; }'+
    '.ztree li{position: relative}'+  
    '.ztree li a {padding-left: 4px; padding-right: 100%; }' +
    '.ztree li span.button.add {right: 44px;}' +
    '.ztree li span.button.remove {right: 8px;}' +
    '.ztree li span.button.remove, .ztree li span.button.add {position:absolute; top: 5px; background: url("@@@PREFIX@@@/images/del.png") no-repeat 0 0;background-size: 15px 18px;width: 15px; height: 18px; opacity: 1;}' + 
    '.ztree li span.button.add{background: url("@@@PREFIX@@@/images/add.png") no-repeat 0 0; background-size: 15px 18px;}'+
    '.ztree li .aParent .add, .ztree li .aParent .remove{top: 8px}' +
    '.ztree li span.button.center_open, .ztree li span.button.bottom_open, .ztree li span.button.roots_open {opacity:1; background: url("@@@PREFIX@@@/images/jian.png") no-repeat 0 0;background-size: 10px 2px; width: 10px;height: 10px;margin-left: 4px;margin-top: 7px;}' + 
    '.ztree li span.button.center_close, .ztree li span.button.bottom_close, .ztree li span.button.roots_close{opacity: 1; background: url("@@@PREFIX@@@/images/plus.png") no-repeat 0 0; background-size: 10px 10px; width: 10px; height: 10px; margin-left: 4px;}'+
    '.ztree li span.button.ico_open, .ztree li span.button.ico_close, .ztree li span.button.ico_docu{display: none}'+
    '.ztree li a.curSelectedNode{border: none;background: none;padding-top: 1px; color: #fff; opacity: 1;}'+
    '.ztree li .white{color: #fff;opacity: 1;}'+
    '#j-modal-nd .ztree li .white {font-weight: 700; }' +
    '.ztree li a.curSelectedNode span {opacity: 1}'+
    '.ztree li a.curSelectedNode:hover{text-decoration: none}'+
    '.ztree .li_open{border-left: 2px solid rgba(142, 140, 231, 100);background: #30304D;}'+
    '#j-modal-nd .ztree .li_open {background: none; border-left: none}' + 
    '.ztree .fontsize14 {font-size: 14px; opacity: 1}'+
    '.ztree .margintop14{ padding-left: 16px; padding-bottom: 8px; padding-top: 8px;}' + 
    '#j-modal-nd .ztree .margintop14{padding-top: 4px; padding-bottom: 4px;}' +
    '#j-modal-nd {width: 400px; height: 300px; overflow-x: auto; overflow-y: scroll;}' + 
    '#j-modal-nd .ztree .margintop14 {padding-left: 0px;}' + 
    '#j-modal-nd .ztree{padding:0;}'+
    '.ztree-search {margin-bottom: 18px; overflow: hidden}' + 
    '.ztree-search input {float: left; padding-left: 5px; width: 200px; font-size: 14px; height: 34px; border: 1px solid #ccc; border-radius: 3px; -webkit-border-radius: 3px;}' + 
    '.ztree-search .open2-btn{float: left; margin-left: 16px; width: 120px; height: 36px; cursor: pointer; line-height: 36px; border-radius: 3px; -webkit-border-radius: 3px; background: #81c784; color: #fff;}' + 
    '.ztree-search .open2-btn:hover {background: #66bb6a}' + 
    '.errorMsg{font-size: 14px; color: red; text-align: left; margin-top: -10px;}' + 
    '.ztree .line li{height: 28px;}' +
    '.add-remove{position: absolute; top: 3px; right:0;width:69px;height:28px;border-top-left-radius: 5px; border-bottom-left-radius: 5px;background:#5452AF;overflow:hidden;}';

    var win_open = '<div class="remodal" data-remodal-id="modal" id="j-modal">' +
                      '<button data-remodal-action="close" class="remodal-close"></button>'+
                      '<p></p>'+
                      '<button data-remodal-action="confirm" class="remodal-confirm">确定</button>'+
                      '<button data-remodal-action="cancel" class="remodal-cancel hidden">取消</button>'+
                    '</div>';
    // 动态增加样式
    this.addStyleSheet(stylesheet);
    // 动态增加弹窗html结构
    $('body').prepend(win_open);

    // 弹窗实例化
    if ($('[data-remodal-id=modal]').length > 0) {
      modalInst = $('[data-remodal-id=modal]').remodal();
    }
};
// JS 动态添加css样式
ZTreeSingle.prototype.addStyleSheet = function(refWin, cssText, id) {
  var self = this;
   if(self.isString(refWin)) {
       id = cssText;
       cssText = refWin;
       refWin = window;
   }
   refWin = $(refWin);
   var doc = document;
   var elem; 
   if (id && (id = id.replace('#', ''))) {
       elem = $('#' + id, doc);
   }

   // 仅添加一次，不重复添加
   if (elem) {
       return;
   }
   //elem = $('<style></style>'); 不能这样创建 IE8有bug
   elem =  document.createElement("style");         
   // 先添加到 DOM 树中，再给 cssText 赋值，否则 css hack 会失效
   $('head', doc).append(elem);
   if (elem.styleSheet) { // IE
      elem.styleSheet.cssText = cssText;
   } else { // W3C
       $(elem).append(doc.createTextNode(cssText));
   }
};
ZTreeSingle.prototype.isString = function(str) {
  return Object.prototype.toString.apply(str) === '[object String]';
};
ZTreeSingle.prototype.beforeRemove = function(treeId, treeNode) {
  if (treeNode.status === 0 || $("#" + treeNode.tId + '_span').hasClass('useless')) {
    window.zSingle.noAddMenu();
    $("#j-modal p").html("该节点已经处于废弃状态~");
    $(".remodal-confirm").removeClass("J_UnLessNode");
    return false;
  }
  window.zSingle.noSubMenu();
  $('.remodal-cancel').removeClass('hidden');
  $(".remodal-confirm").addClass("J_UnLessNode");
  $("#j-modal p").html("确认废弃该节点 -- " + treeNode.accName + " 吗？");

  // 为了获取treeNode 因此dom操作放在里面进行
  $(document).on('click', '.J_UnLessNode', function(){
    // 如果它有子节点的话， 那么需要递归遍历当前根节点下的所有子节点，使它们也被废弃
    window.zSingle.allChilds(treeNode);
  });
  return false;
};
ZTreeSingle.prototype.noAddMenu = function() {
  modalInst.open();
  $('.remodal-cancel').addClass('hidden');
  $("#j-modal p").html('已被废弃,不能增加菜单了');
  $(".remodal-confirm").removeClass("J_UnLessNode");
};
ZTreeSingle.prototype.noSubMenu = function() {
  modalInst.open();
  $('.remodal-cancel').addClass('hidden');
  $("#j-modal p").html('不能再增加菜单了');
  $(".remodal-confirm").removeClass("J_UnLessNode");
};
ZTreeSingle.prototype.addHoverDom = function(treeId, treeNode) {
  var status,
      isNoUser;
  var zTree = window.zTree; 
  if (treeId !== 'ztreeId') {
    return;
  }
  var sObj = $("#" + treeNode.tId + "_span");
  if ($("#addBtn_"+treeNode.tId).length > 0) {
    return;
  }
  var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
    + "' title='add node' onfocus='this.blur();'></span>";
  sObj.after(addStr);
  $("#ztreeId .add, #ztreeId .remove").wrapAll("<div class='add-remove'></div>");
  var btn = $("#addBtn_"+treeNode.tId);
  if (btn) {
    btn.bind("click", function(){
      if (treeNode.status === 0 || $("#" + treeNode.tId + '_span').hasClass('useless')) {
        window.zSingle.noAddMenu();
        $("#j-modal p").html("该节点已经处于废弃状态~");
        $(".remodal-confirm").removeClass("J_UnLessNode");
        return false;
      }
      var aParent = $(this).closest('a');
      var level;
      // 获取状态 是否被废弃状态
      status = treeNode.status;
      if (status === 0) {
        isNoUser = window.zSingle.noAddMenu(status);
        return false;
      }
      // 如果是第四层菜单的话 不允许再增加子菜单
      level = treeNode.level;
      if (level > 2) {
        window.zSingle.noSubMenu();
        return;
      }
      if (treeNode.level === 0) {
        $("#" + treeNode.tId).addClass('li_open');
      }
      // 获取当前子节点的name和父节点name
      var allNodesName = window.zSingle.getAllParentName(treeNode);
      // 点击新增回调
      window.zSingle.newAddCallback && $.isFunction(window.zSingle.newAddCallback) && window.zSingle.newAddCallback(zTree, treeId, treeNode,allNodesName.reverse());
      // zTree.addNodes(treeNode, {id:null, pId:treeNode.id, accName:"new node" });
      // 获取所有的节点数据, 是否显示 废弃 文案
      var nodes = zTree.getNodes();
      window.zSingle.isUseless(nodes);
      return false;
    });
  }
};
ZTreeSingle.prototype.removeHoverDom = function(treeId, treeNode) {
  $("#addBtn_"+treeNode.tId).unbind().remove();
  $(".add-remove").remove();
};
// 对所有子节点进行操作
ZTreeSingle.prototype.allChilds = function(treeNode) {
  var subListElem = treeNode.subList;
  var accId = treeNode.accId;  // 当前账户id
  /*
  $.ajax({
    url: '',
    type: 'POST',
    dataType: 'json',
    data: {
      
    },
    success: function(data) {
      if (data.status === 1) {
        // 成功
      } else if(data.status === 0) {
        // 失败
        var errmsg = data.errmsg;
      }
    },
    error: function(err) {

    }
  })
  */
  $("#" + treeNode.tId + '_span').addClass('useless');
  var spanHtml = $("#" +treeNode.tId + '_span').html();
  if (spanHtml && spanHtml.indexOf('废弃') === -1) {
    $("#" +treeNode.tId + '_span').append('(废弃)')
  }
  if (subListElem && subListElem.length) {
    // 进行递归调用
    for (var i = 0, ilen = subListElem.length; i < ilen; i++) {
      window.zSingle.allChilds(subListElem[i]);
    }
  }
};
// 获取所有父节点的name值 -- 通过递归的方式
ZTreeSingle.prototype.getAllParentName = function(node) {
  var arrs = [];
  var rAllNodesName = function(node) {
     var accName = node.accName;
     var tId = node.tId;
     arrs.push({
       accName: accName,
       tId: tId
     });
     // 如果该节点有父节点的话， 使用递归的方式 递归获取
     var parentNode = node.getParentNode();
     if (parentNode && parentNode.accName) {
        rAllNodesName(parentNode);
     }
  };
  rAllNodesName(node);
  return arrs;
};
ZTreeSingle.prototype.clearClassWhite = function(treeId) {
  $("#" + treeId).find('span').removeClass("white");
};
ZTreeSingle.prototype.zTreeOnClick = function(event, treeId, treeNode) {
  // 获取当前子节点的name和父节点name
  var allNodesName = window.zSingle.getAllParentName(treeNode);
  window.zSingle.clearClassWhite(treeId);
  for (var i = 0, ilen = allNodesName.length; i < ilen; i++) {
    $("#" + allNodesName[i].tId + '_span').addClass('white');
  }
  if (treeId !== "ztreeId") {
    // 针对弹窗 点击某一项 触发事件
    window.zSingle.clickRenderCallback && $.isFunction(window.zSingle.clickRenderCallback) && window.zSingle.clickRenderCallback(treeNode);
    return;
  }
  // 说明该节点是废弃状态 废弃状态 应该去掉选中状态
  if (treeNode.status === 0) {
    var zTree = $.fn.zTree.getZTreeObj(treeId);
    var node = zTree.getSelectedNodes()[0];
    zTree.cancelSelectedNode(node);
  }
  window.zSingle.clickRenderCallback && $.isFunction(window.zSingle.clickRenderCallback) && window.zSingle.clickRenderCallback(allNodesName.reverse(),treeNode);
};
ZTreeSingle.prototype.hideLine = function(treeId, treeNode) {
  console.log(treeNode);
  // 展开节点 如果树节点id是 ztreeId 的话，直接隐藏 线条
  if ( treeId === "ztreeId") {
    if (treeNode.isLastNode) {  
      var tId = treeNode.tId;
      $("#" +tId).find('ul').addClass('line noline');
    }
  }
};
ZTreeSingle.prototype.zTreeOnExpand = function(event, treeId, treeNode) {
  var zTree = window.zTree; 
  // 获取所有的节点数据, 是否显示 废弃 文案
  var nodes = zTree.getNodes();
  window.zSingle.isUseless(nodes);
  if (treeNode.open && (treeNode.level === 0)) {
    $("#" + treeNode.tId).addClass('li_open');
  } 
  if (treeNode.isLastNode) {
    $('#' +treeNode.tId).find('ul').addClass('line');
  }
  // 如果它有子节点的话， 那么需要递归遍历当前根节点下的所有子节点，使它们也被废弃
  if ($("#" + treeNode.tId + '_span').hasClass("useless")) {
    window.zSingle.allChilds(treeNode);
  }
};
ZTreeSingle.prototype.zTreeOnCollapse = function(event, treeId, treeNode) {
  if (!treeNode.open && (treeNode.level === 0)) {
    $("#" + treeNode.tId).removeClass('li_open');
  }
};
// 判断节点是否需要显示废弃状态--- 通过递归的方式遍历子节点
ZTreeSingle.prototype.isUseless = function(nodes) {
  var rAllNodesisStatus = function(node) {
    var status = node.status;
    if (status === 0) {
      var spanHtml = $("#" +node.tId + '_span').html();
      if (spanHtml && spanHtml.indexOf('废弃') === -1) {
        $("#" +node.tId + '_span').append('(废弃)');
        $("#" +node.tId + '_span').addClass('useless');
      }
    }
    var subList = node.subList;
    if (subList && subList.length) {
      for (var j = 0, jlen = subList.length; j < jlen; j++) {
        rAllNodesisStatus(subList[j]);
      }
    }
  };
  if (nodes && nodes.length) {
    for (var i = 0, ilen = nodes.length; i < ilen; i++) {
      rAllNodesisStatus(nodes[i]);
    }
  }
};
ZTreeSingle.prototype.isRepeatName = function(pNode, name) {
  var subLists = pNode.subList;
  var isflag = false;
  if (subLists && subLists.length) {
    for(var i = 0, ilen = subLists.length; i < ilen; i++) {
      if (subLists[i].accName === name) {
        isflag = true;
        break;
      }
    }
  }
  return isflag;
};
// 根据inputVal的值 展开父节点下的对应的子节点  通过递归的方式遍历所有子节点 进行对比
ZTreeSingle.prototype.expandNode = function(inputVal) {
  var zTree = window.zTree; 
  var nodes = zTree.getNodes();
  var allNodes = [];
  // 是否搜索到对应的值
  var isSearchVal = false; 
  // 获取所有的节点数据
  if (!inputVal) {
    $('.errorMsg').removeClass('hidden').html('查询的名称不能为空！');
    return;
  } else {
    $('.errorMsg').addClass('hidden');
  }
  var getAllNodes = function(node) {
    var accName = node.accName;
    var id = node.id;
    allNodes.push({name:accName, id: id});
    var subList = node.subList;
    if (subList && subList.length) {
      for (var j = 0, jlen = subList.length; j < jlen; j++) {
        getAllNodes(subList[j]);
      }
    }
  };
  for (var j = 0, jlen = nodes.length; j < jlen; j++) {
    getAllNodes(nodes[j]);
  }
  if (allNodes.length) {
    for (var i = 0, ilen = allNodes.length; i < ilen; i++) {
      if (inputVal === allNodes[i].name) {
        var node = zTree.getNodeByParam("id", allNodes[i].id, null);
        zTree.expandNode(node, true, false, true, true);
        zTree.selectNode(node, true);
        isSearchVal = true;
        zTree.setting.callback.onClick(null, 'ztreeId2', node);
        break;
      }
    }
  }
  if (!isSearchVal) {
    $('.errorMsg').removeClass('hidden').html('没有搜索到对应的名称');
  } else {
    $('.errorMsg').addClass('hidden');
  }
};
ZTreeSingle.prototype.modalZtree = function(zNodes) {
  var win_open2 = '<div class="remodal" data-remodal-id="win_open2" id="j-modal-nd">' +
                    '<button data-remodal-action="close" class="remodal-close"></button>'+
                    '<div class="ztree-content">' +
                      '<div class="ztree-search"><input type="text" /><div class="open2-btn">确定</div></div>'+ 
                      '<div class="errorMsg hidden">查询的名称不能为空！</div>'+
                      '<ul id="ztreeId2" class="ztree"></ul>'+
                    '</div>'+
                  '</div>';
  // 动态增加弹窗html结构
  if ($("#j-modal-nd").length < 1) {
    $('body').prepend(win_open2);
    // 弹窗实例化
    modalInst2 = $('[data-remodal-id=win_open2]').remodal();
    console.log(window.zSingle)
    var setting2 = {
      view: {
        selectedMulti: false
      },
      edit: {
        enable: true,
        showRemoveBtn: false,
        showRenameBtn: false
      },
      data: {
        simpleData: {
          enable: true,
          idKey: 'id', 
          pIdKey: 'parentId'
        },
        key: {
          name: 'accName',
          children: 'subList'
        }
      },
      callback: {
        beforeRemove: window.zSingle.beforeRemove,
        onClick: window.zSingle.zTreeOnClick,
        onExpand: window.zSingle.zTreeOnExpand,
        onCollapse: window.zSingle.zTreeOnCollapse
      }
    };
    $.fn.zTree.init($("#ztreeId2"), setting2, zNodes);
    var zTree = $.fn.zTree.getZTreeObj("ztreeId2"); 
    window.zTree = zTree;
    var nodes = zTree.getNodesByFilter(function(node) {
      return node.level === 0
    });
    $(nodes).each(function(index, item){
      $("#" + item.tId).addClass('margintop14');
      $("#" + item.tId).find('a').addClass('aParent');
      $("#" + item.tId).find('a span:last-child').addClass('fontsize14');
    });
    // 监听关闭弹窗事件
    $(document).on('closing', '#j-modal-nd', function (e) {
      window.zSingle.clearClassWhite('ztreeId2');
      // 折叠全部节点
      zTree.expandAll(false);
      $('.ztree-search input').val('');
    });
    // 点击确定事件
    var timer;
    $('#j-modal-nd').on('click', '.open2-btn', function(e) {
      var inputVal = $.trim($(this).closest('.ztree-search').find('input').val());
      // 折叠全部节点
      zTree.expandAll(false);
      timer && clearTimeout(timer);
      // 使用定时器 延时一些时间
      timer = setTimeout(function() {
        window.zSingle.expandNode(inputVal);
      }, 500);
      
    });
    /*
    // 默认选中指定节点并执行事件
    var node = zTree.getNodeByParam("id", nodes[0].id);
    zTree.setting.callback.onClick(null, 'ztreeId2', node);
    */
    /*
    // 获取所有的节点数据, 是否显示 废弃 文案
    var allNodes = zTree.getNodes();
    window.zSingle.isUseless(allNodes);
    */
  }
  modalInst2.open();
};
window.ZTreeSingle = ZTreeSingle;

