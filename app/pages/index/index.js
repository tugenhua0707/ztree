
// 弹窗实例化
var modalInst2 = $('[data-remodal-id=modal2]').remodal();

var clickRenderCallback = function(allNodesName, treeNode) {
  var arrNames = [];
  if (allNodesName && allNodesName.length) {
    for (var i = 0, ilen = allNodesName.length; i < ilen; i++) {
       arrNames.push(allNodesName[i].accName);
    }
  }
  $(".ztop .title").html(allNodesName[allNodesName.length - 1].accName);
  var last = arrNames.pop();
  $('.ztop .stitle').html(arrNames.join('&nbsp;/&nbsp;'));
  if (allNodesName.length > 1) {
    $('.ztop .stitle').append("&nbsp;/&nbsp;<strong>"+last+"</strong>");
  } else {
    $('.ztop .stitle').append("<strong>"+last+"</strong>");
  }
  // ajax请求 渲染右边的内容
  var accId = treeNode.accId;
  /*
  $.ajax({
    url: '',
    type: 'POST',
    data: {
      accId: accId
    }
    dataType: 'json',
    success: function(data) {
      if(data.status === 1) {
        // 成功
      } else if(data.status === 0) {
        // 失败
      }
    }
  })
  */
  var data = {
    id: 10,  
    accId: "100",              // 账户id
    accType: 1,                // 账户类型：1-收入，3-支出;
    accName: "账户名称",        // 账户名称
    status: 1,                 // 账户状态[1-正常,-1-删除];
    currAmount: 1000,          // 当前总金额;
    latestChangeAmount: 2000,  // 最新更新的金额;
    totalExpense: 2000,        // 总支出;
    totalIncome: 3000,         // 总收入;
    createTime:  '2017-02-11', // 创建时间
    modifier: '乔峰',
    modifyTime: '2017-03-02'   // 修改时间
  };
  var strHtml = '';
  var status;
  var accType;
  if (data.status === 1) {
    status = '正常';
  } else if(data.status === -1) {
    status = '删除';
  }
  if (data.accType === 1) {
    accType = '收入';
  } else if(data.accType === 3) {
    accType = '支出';
  }
  strHtml +=  '<li><div class="title">账户名称</div><div class="value">'+data.accName+'</div></li>' + 
              '<li><div class="title">账户ID</div><div class="value">'+data.accId+'</div></li>' + 
              '<li><div class="title">账户状态</div><div class="value">'+ status +'</div></li>' + 
              '<li><div class="title">账户属性</div><div class="value">'+ accType +'</div></li>' + 
              '<li><div class="title">创建时间</div><div class="value">'+data.createTime+'</div></li>' + 
              '<li><div class="title">更新时间</div><div class="value">'+data.modifyTime+'</div></li>' + 
              '<li><div class="title">更新人员</div><div class="value">'+data.modifier+'</div></li>';
  $('#accountId').html(strHtml);
};
var newAddCallback = function(zTree, treeId, treeNode, allNodesName) {
  modalInst2.open();
  $('.remodal-cancel').removeClass('hidden');
  $(".account-name input").val('');
  $('.modal-tips').addClass('hidden').html('');

  var arrNames = [];
  if (allNodesName && allNodesName.length) {
    for (var i = 0, ilen = allNodesName.length; i < ilen; i++) {
       arrNames.push(allNodesName[i].accName);
    }
  }
  $('.directory span').html(arrNames.join('&nbsp;/&nbsp;'));
  $(".m-btn .remodal-cancel").unbind('click').bind('click', function() {
    // 取消操作
    $(".account-name input").val('');
    $('.modal-tips').addClass('hidden').html('');
    $("#" + treeNode.tId).removeClass('li_open');
    modalInst2.close();
  });
  $('.m-btn .remodal-confirm').unbind('click').bind('click', function(){
     // 确定操作
    /*
      parentId: 父级目录ID
      accType ：账户类型：默认为:负债1，3-资产;
      accName ：账户名称-简写;
     */
     var parentId = treeNode.id;
     var accType = $('.a-select').val();
     var accName = $('.account-name input').val();
     if (accName === '') {
       $('.modal-tips').removeClass('hidden').html('请填写账户名称');
     } else {
       $('.modal-tips').addClass('hidden');
     }
     /*
     $.ajax({
       url: '',
       type: 'POST',
       dataType: 'json',
       data: {

       },
       success: function(data) {
         if(data.status === 1) {
           // 成功
           modalInst2.close();
           zTree.addNodes(treeNode, {id:null, pId:treeNode.id, accName:data.accName });
         } else {
           // 失败
           $('.modal-tips').removeClass('hidden').html(data.errmsg);
         }
       }
     })
     */
     var aname = 'node';
     var isRepeatName = window.zSingle.isRepeatName(treeNode, aname);
     
     if(isRepeatName) {
       $('.modal-tips').removeClass('hidden').html('子节点不能有相同的名称，请重新输入');
     } else {
        $('.modal-tips').addClass('hidden');
        modalInst2.close();
        zTree.addNodes(treeNode, {id:null, pId:treeNode.id, accName:'node'});
        window.zSingle.hideLine(treeId, treeNode);
     }
  });
  // zTree.addNodes(treeNode, {id:null, pId:treeNode.id, accName:"new node" });
};
var zNodes = [
  { id:1, parentId:null, accName:"父节点 1",level:0,status:0,accId: 0,
    subList:[
      { 
        id:11, 
        parentId:1,
        accId: 1, 
        accName:"叶子节点 1-1", 
        subList: [
          { 
            id:111, 
            parentId:11, 
            accName:"叶子节点 1-1-1",
            status:0,
            accId: 2,
            subList: [
              { id:1111, parentId:111, accName:"叶子节点 1-1-2",status:0, accId: 3}
            ]
          }
        ]
      },
      { id:12, parentId:1, accName:"叶子节点 1-2",accId: 0},
      { id:13, parentId:1, accName:"叶子节点 1-3",accId: 0}
    ]
  },
  { id:2, parentId:null, accName:"父节点 2",status:1,level:0, accId: 0,
    subList: [
      { id:21, parentId:2, accName:"叶子节点 2-1", accId: 1, status:1,
        subList: [
          { 
            id:111, 
            parentId:21, 
            accName:"叶子节点 2-1-1",
            status:1,
            accId: 2,
            subList: [
              { id:1111, parentId:111, accName:"叶子节点 2-1-2",status:0, accId: 3}
            ]
          }
        ]
      },
      { id:22, parentId:2, accName:"叶子节点 2-2", accId: 1, status:0},
      { id:23, parentId:2, accName:"叶子节点 2-3", accId: 1}
    ]
  },  
  { id:3, parentId:null, accName:"父节点 3",status:1,level:0, accId: 0,
    subList: [
      { id:31, parentId:3, accName:"叶子节点 3-1", accId: 1},
      { id:32, parentId:3, accName:"叶子节点 3-2", accId: 1},
      { id:33, parentId:3, accName:"叶子节点 3-3", accId: 1}
    ]
  } 
];
var cfg = {
  clickRenderCallback: clickRenderCallback,
  newAddCallback: newAddCallback
};
window.zSingle = new ZTreeSingle(cfg);
var setting = {
  view: {
    addHoverDom: window.zSingle.addHoverDom,
    removeHoverDom: window.zSingle.removeHoverDom,
    selectedMulti: false
  },
  edit: {
    enable: true,
    showRemoveBtn: true,
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
$(document).ready(function(){  
  $.fn.zTree.init($("#ztreeId"), setting, zNodes);
  window.zTree = $.fn.zTree.getZTreeObj("ztreeId"); 
  var nodes = zTree.getNodesByFilter(function(node) {
    return node.level === 0
  });
  $(nodes).each(function(index, item){
    $("#" + item.tId).addClass('margintop14');
    $("#" + item.tId).find('a').addClass('aParent');
    $("#" + item.tId).find('a span:last-child').addClass('fontsize14');
  })
  // 默认选中指定节点并执行事件
  var node = zTree.getNodeByParam("id", nodes[0].id);
  zTree.setting.callback.onClick(null, 'ztreeId', node);

  // 获取所有的节点数据, 是否显示 废弃 文案
  var allNodes = zTree.getNodes();
  window.zSingle.isUseless(allNodes);


  // 点击菜单隐藏内容
  $(".btn-navbar").click(function() {
    $("#container").toggleClass("menu-hidden");
  });
});
