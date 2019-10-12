import { Component, OnInit, AfterViewInit, ChangeDetectorRef, ViewChild, Inject, NgZone, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { Router, ActivatedRoute, ParamMap, CanDeactivate } from '@angular/router';
import { Overlay } from '@angular/cdk/overlay';
import { ContextMenuComponent } from "../context-menu/context-menu.component";
import { DagConfigService } from '../../services/dag-config.service';
import { CommonService } from '../../services/common.service';
import { Observable, fromEvent } from 'rxjs';
import { map, filter, scan } from 'rxjs/operators';
import { checkSaveGuard } from './check-save.guard';
declare var jsPlumb: any;
declare var $: any;

@Component({
    selector: 'app-jsplumb-drag',
    templateUrl: './jsplumb-drag.component.html',
    styleUrls: ['./jsplumb-drag.component.css']
})
export class JsplumbDragComponent implements OnInit, checkSaveGuard {

    constructor(private changeDetectorRef: ChangeDetectorRef,
        public dagCofigService: DagConfigService,
        private common: CommonService,
        public dialog: MatDialog,
        private overlay: Overlay,
        private zone: NgZone,
        private router: Router,
        private route: ActivatedRoute) { }
    @ViewChild(ContextMenuComponent)
    private contextMenu: ContextMenuComponent;
    private projectUrl = this.apilist.projectUrl;
    private nodeinstanceUrl = this.apilist.nodeinstanceUrl;
    private planSchemaUrl = this.apilist.planSchemaUrl;
    dagDate: any = {};
    projectId: any;
    planId: any;
    planDetail: any;
    localLinkList: any = [];
    instance: any;
    selectedItem: any;
    contextMenuPos: any;
    showContext: boolean = false;
    configList: any = { template: [] };
    isShowConfig: boolean = false;
    nodeInstanceSize: any = [180, 36];
    zoomLevel: number = 1;
    readableTable: any;
    planList: any;
    runningState: boolean = false;
    fullScreenState: boolean = false;
    contextMenuList: any = []; //右键菜单列表
    executionId: any;
    dagSaveSign: boolean = true;
    dagDestroy: boolean = false;
    isEmpty: boolean = true;
    isOpen: any;
    isInit: boolean = true;
    contextCommonList: any = [{ value: '重命名', callback: 'nodeRename' }, { value: '删除', callback: 'deleteNode' }];
    contextRunList: any = [
        { value: '运行本节点', callback: 'runTheNode' },
        { value: '运行至本节点', callback: 'runToTheNode' },
        { value: '从本节点开始运行', callback: 'runFromTheNode' }
    ];
    contextLogView: any = [{ value: '查看日志', callback: 'viewNodeLog' }];
    contextEval: any = [{ value: '查看评估报告', callback: 'viewEvalReport' }]

    // node function
    newNode(nodeid: any, left: any, top: any) {
        var itemDetail = JSON.parse(JSON.stringify(this.dagCofigService.nodeDetailList[nodeid]))
        if (itemDetail.config.createOper != undefined) itemDetail.config.createOper = this.planDetail.createOper;
        if (itemDetail.config.createTime != undefined) itemDetail.config.createTime = new Date().getTime();
        var uuid = this.guid();
        var iconName = this.dagCofigService.iconConfig[itemDetail.className]
        this.dagDate.nodes.push({
            name: itemDetail.nodeName,
            uuid: uuid,
            position: [left, top],
            parentsId: [uuid],
            template: itemDetail.configList,
            config: itemDetail.config,
            className: itemDetail.className,
            status: 0,
            iconName: iconName,
            msg: itemDetail.msg,
            algoName: itemDetail.algoName,
            algoCategory: itemDetail.algoCategory
        })
        this.changeDetectorRef.markForCheck();
        this.changeDetectorRef.detectChanges();
        $('.nodeInstance-detail').css({ 'transform': 'scale(' + this.zoomLevel + ', ' + this.zoomLevel + ')' })
        var inputPortUuids = []
        var outputPortUuids = []
        for (var index = 0; index < itemDetail.inputPortDes.length; index++) {
            var nodePoint = [(index + 1) / (itemDetail.inputPortDes.length + 1), 0, 0, 0]
            var portuuid = this.guid();
            this.dagCofigService.targetEndpoint.scope = itemDetail.inputScope[index].dataType + itemDetail.inputScope[index].format
            var endpoint = this.instance.addEndpoint(uuid, { anchor: nodePoint, uuid: portuuid }, this.dagCofigService.targetEndpoint);
            $(endpoint.canvas).attr({ 'title': '端点名称:' + itemDetail.inputPortDes[index], 'data-placement': 'bottom', 'data-toggle': 'tooltip' })
            $(endpoint.canvas).tooltip()
            var portValueUuid = ''
            inputPortUuids.push(portuuid)
            this.dagDate.ports.push(this.createPortObject(portuuid, itemDetail.inputPortDes[index], portValueUuid, itemDetail.inputScope[index]))
        }
        for (var index = 0; index < itemDetail.outputPortDes.length; index++) {
            var nodePoint: number[] = []
            if (itemDetail.outputHiddenNumber) {
                nodePoint = [(index + 1) / (itemDetail.outputPortDes.length + 1 - itemDetail.outputHiddenNumber), 1, 0, 0]
            } else {
                nodePoint = [(index + 1) / (itemDetail.outputPortDes.length + 1), 1, 0, 0]
            }
            var portuuid = this.guid();
            if (itemDetail.outputPortDes[index] !== '') {
                this.dagCofigService.sourceEndpoint.scope = itemDetail.outputScope[index].dataType + itemDetail.outputScope[index].format
                var endpoint = this.instance.addEndpoint(uuid, { anchor: nodePoint, uuid: portuuid }, this.dagCofigService.sourceEndpoint);
                $(endpoint.canvas).attr({ 'title': '端点名称:' + itemDetail.outputPortDes[index], 'data-placement': 'bottom', 'data-toggle': 'tooltip' })
                $(endpoint.canvas).tooltip()
            }
            outputPortUuids.push(portuuid)
            var portValueUuid = this.guid();
            this.dagDate.ports.push(this.createPortObject(portuuid, itemDetail.outputPortDes[index], portValueUuid, itemDetail.outputScope[index]))
            this.dagDate.portValues.push({ uuid: portValueUuid, value: {}, dataType: itemDetail.dataType, format: itemDetail.format })
        }
        this.dagDate.nodes[this.dagDate.nodes.length - 1].inputPortUuids = inputPortUuids
        this.dagDate.nodes[this.dagDate.nodes.length - 1].outputPortUuids = outputPortUuids
        this.dagSaveSign = false;
        // this.nodeContextMenu()
        $('[data-toggle="tooltip"]').tooltip()
        this.instance.draggable(jsPlumb.getSelector(".experiment-drag-container .nodeInstance"));
        this.nodeInstanceDrag()
    }
    initNode() {
        for (var i = 0; i < this.dagDate.nodes.length; i++) {
            for (var index = 0; index < this.dagDate.nodes[i].inputPortUuids.length; index++) {
                var nodePoint = [(index + 1) / (this.dagDate.nodes[i].inputPortUuids.length + 1), 0, 0, 0]
                var uuid = this.dagDate.nodes[i].inputPortUuids[index]
                var port = this.queryPortItem(uuid)
                this.dagCofigService.targetEndpoint.scope = port.dataType + port.format
                var endpoint = this.instance.addEndpoint(this.dagDate.nodes[i].uuid, { anchor: nodePoint, uuid: uuid }, this.dagCofigService.targetEndpoint);
                if (port.name !== undefined) {
                    $(endpoint.canvas).attr({ 'title': '端点名称:' + port.name, 'data-placement': 'bottom', 'data-toggle': 'tooltip' })
                    $(endpoint.canvas).tooltip()
                }
            }
            for (var index = 0; index < this.dagDate.nodes[i].outputPortUuids.length; index++) {
                var nodePoint = [(index + 1) / (this.dagDate.nodes[i].outputPortUuids.length + 1), 1, 0, 0]
                var uuid = this.dagDate.nodes[i].outputPortUuids[index]
                var port = this.queryPortItem(uuid)
                if (port.name !== '' && port.name !== undefined) {
                    this.dagCofigService.sourceEndpoint.scope = port.dataType + port.format
                    var endpoint = this.instance.addEndpoint(this.dagDate.nodes[i].uuid, { anchor: nodePoint, uuid: uuid }, this.dagCofigService.sourceEndpoint);
                    $(endpoint.canvas).attr({ 'title': '端点名称:' + port.name, 'data-placement': 'bottom', 'data-toggle': 'tooltip' })
                    $(endpoint.canvas).tooltip()
                }
            }
        }
        this.initConnection()
    }
    selectTheNode(item: any, index: any) {
        this.selectedItem = item
        this.selectedItem.index = index
        // var tempItem = JSON.parse(JSON.stringify(item))
        if (typeof (item.template) === 'string') {
            item.template = JSON.parse(item.template)
        } else {
            item.template = item.template
        }
        this.configList = item
        this.copyTheNode()
    }

    showThePlanConfig() {
        this.formatePlanSummary(this.planDetail)
    }

    nodeInstanceDrag() {
        var gloabl = this
        $(".experiment-drag-container .nodeInstance").draggable({
            scroll: false,
            start: function() {
                $('[data-toggle="tooltip"]').tooltip('hide')
            },
            drag: function() {
                $('[data-toggle="tooltip"]').tooltip('hide')
            },
            stop: function(event: any, ui: any) {
                var position = [parseInt(ui.position.left), parseInt(ui.position.top)]
                var nodeId = $(this)[0].id
                var item = gloabl.queryNodeDetail(nodeId)
                item.position = position
                gloabl.dagSaveSign = false;
            }
        })
    }

    // 运行状态的connection样式修改
    changeRunningConnection(uuid: any) {
        if (this.instance) {
            var connections = this.instance.getAllConnections()
            connections.forEach((con: any) => {
                // 根据targetid 对比
                // $(con.canvas.children[0]).removeClass('link-runing')
                // if (con.sourceId === uuid) {
                if (con.targetId === uuid) {
                    $(con.canvas.children[0]).addClass('link-runing')
                }
            })
        }
    }

    removeNodeRunningConnection(uuid: string) {
        if (this.instance) {
            var connections = this.instance.getAllConnections()
            connections.forEach((con: any) => {
                if (con.targetId === uuid) {
                    $(con.canvas.children[0]).removeClass('link-runing')
                }
            })
        }
    }

    removeAllRunningConnection() {
        var connections = this.instance.getAllConnections()
        connections.forEach((con: any) => {
            $(con.canvas.children[0]).removeClass('link-runing')
        })
    }

    // port function
    createPortObject(uuid: any, name: any, portValueUuid: any, scope: any) {
        var empty: any = []
        var temp = { uuid: uuid, name: name, portValueUuid: portValueUuid, childrenPortsUuid: empty, dataType: scope.dataType, format: scope.format };
        return temp;
    }

    // connection function
    initConnection() {
        if (this.dagDate.ports.length) {
            this.dagDate.ports.forEach((items: any) => {
                if (items.childrenPortsUuid !== undefined) {
                    items.childrenPortsUuid.forEach((item: any) => {
                        this.instance.connect({ uuids: [items.uuid, item] })
                    })
                }
            })
        }
        this.isInit = false;
    }

    handleConnection(input: any, output: any, type: any) {
        if (type === 'connect') {
            this.dagDate.ports.forEach((port: any) => {
                if (input === port.uuid) {
                    if (port.childrenPortsUuid.indexOf(output) < 0) {
                        port.childrenPortsUuid.push(output)
                        this.dagSaveSign = false;
                    }
                }
            })
        } else if (type === 'detach') {
            this.dagDate.ports.forEach((port: any) => {
                if (input === port.uuid) {
                    port.childrenPortsUuid = this.deleteAnumInArray(output, port.childrenPortsUuid)
                    this.dagSaveSign = false;
                }
            })
        }
    }

    handlePortValues(item: any) {
        var port = this.queryPortItem(item)
        var portValue = this.queryPortValueItem(port.portValueUuid)
        this.dagDate.portValues.splice(portValue.index, 1)
    }

    handlePort(item: any) {
        var index = this.queryPortIndex(item)
        this.dagDate.ports.splice(index, 1)
    }

    // 右键菜单组合
    nodeContextMenu(item: any, index: any, e: any) {
        var tempContextArr: any = []
        const disabled = item.status === 3 ? false : true;
        const dividing = { value : 'dividingLine' }
        this.selectedItem = item
        this.selectedItem.index = index
        //组件的右键菜单组合
        tempContextArr = JSON.parse(JSON.stringify(this.contextRunList))
        tempContextArr.push(dividing)
        if (item.className.endsWith('BinaryClassifierEvalNode')) {
            this.contextEval.disabled = item.status === 3 ? false : true;
            tempContextArr = tempContextArr.concat(this.contextEval)
            tempContextArr.push(dividing)
        }
        item.outputPortUuids.forEach((output: any, i: any) => {
            var port = this.queryPortItem(output)
            var portValue = this.queryPortValueItem(port.portValueUuid)
            if (port.dataType === '2') {
                const temp = [
                    { value: item.outputPortUuids.length > 1 ? '查看数据表' + (i + 1) : '查看', callback: 'viewTheData', param: i, disabled: disabled },
                    { value: item.outputPortUuids.length > 1 ? '导出数据表' + (i + 1) : '导出', callback: 'exportTheData', param: i, disabled: disabled }
                ]
                tempContextArr = tempContextArr.concat(temp)
            } else if (port.dataType === '1') {
                const temp = [{ value: item.outputPortUuids.length > 1 ? '导出模型' + (i + 1) : '导出模型', callback: 'exportTheModel', param: i, disabled: disabled }]
                tempContextArr = tempContextArr.concat(temp)
            }
        })
        tempContextArr.push(dividing)
        tempContextArr = tempContextArr.concat(this.contextCommonList)
        tempContextArr.push(dividing)
        if (!item.className.endsWith('ReadTableNode')) {
            if (item.status === 3 || item.status === 4) {
                this.contextLogView[0].disabled = false
            } else {
                this.contextLogView[0].disabled = true
            }
            tempContextArr = tempContextArr.concat(this.contextLogView)
        }
        e.preventDefault()
        $('[data-toggle="tooltip"]').tooltip('hide')
        this.contextMenuList = tempContextArr
        this.contextMenuPos = [e.pageX, e.pageY]
        this.contextMenu.showContextMenu();
        this.changeDetectorRef.markForCheck();
        this.changeDetectorRef.detectChanges();
    }

    // 右键菜单回调函数
    contextMenuItem(item: any) {
        this.zone.run(() => {
            this[item.callback](item.param)
        })
    }

    //右键菜单处理函数 函数名对应contextMenuList中的callback
    deleteNode() {
        this.common.confirmDialog({}, () => {
            this.instance.remove(this.selectedItem.uuid)
            this.dagDate.nodes.splice(this.selectedItem.index, 1)
            this.selectedItem.inputPortUuids.forEach((item: any) => {
                this.handlePort(item)
            })
            this.selectedItem.outputPortUuids.forEach((item: any) => {
                this.handlePortValues(item)
                this.handlePort(item)
                var port = this.queryPortItem(item)
                if (port.childrenPortsUuid && port.childrenPortsUuid.length > 0) {
                    port.childrenPortsUuid.forEach((portId: any) => {
                        this.handleConnection(item, portId, 'detach')
                    })
                }
            })
        })
        this.dagSaveSign = false;
    }

    nodeRename() {
        var data = this.selectedItem.name
        this.common.openModel(nodeRenameDialog, data, (data: any) => {
            this.selectedItem.name = data
        }, '', '400px', '200px')
        this.dagSaveSign = false;
    }

    viewTheData(index: any) {
        var portItem = this.queryPortItem(this.selectedItem.outputPortUuids[index])
        var portValue = this.queryPortValueItem(portItem.portValueUuid)
        var url = this.projectUrl + '/' + this.projectId + '/data/' + portValue.data.value.id + '/command/previewParquet'
        const param = { plan: { planId: this.planId, version: this.planDetail.version, dag: this.dagDate }, data: {} }
        this.common.httpCommon('post', url, param).subscribe((data: any) => {
            if (data) {
                var dataTemp = data.data
                dataTemp.baseInfo = dataTemp.baseinfo
                dataTemp.baseInfo.size = parseFloat(dataTemp.baseInfo.fileSize)
                dataTemp.datas = dataTemp.records
                dataTemp.schemas = dataTemp.schemaList
                if (portValue.data.dataType === '2') {
                    var temp = []
                    dataTemp.schemaList.forEach((item: any) => {
                        temp.push(item.name)
                    })
                    dataTemp.displayedColumns = temp
                    dataTemp.columnsToDisplay = dataTemp.displayedColumns.slice()
                }
            }
        })
    }

    runTheNode() {
        var param = this.planDetail
        param.dag = this.dagDate
        param.startNode = this.selectedItem.uuid
        param.stopNode = this.selectedItem.uuid
        param.force = false
        this.runTheDagFunction(param)
    }

    runToTheNode() {
        const param = this.planDetail
        param.dag = this.dagDate
        param.startNode = ''
        param.stopNode = this.selectedItem.uuid
        param.force = false
        this.runTheDagFunction(param)
    }

    runFromTheNode() {
        const param = this.planDetail
        param.dag = this.dagDate
        param.startNode = this.selectedItem.uuid
        param.stopNode = ''
        param.force = false
        this.runTheDagFunction(param)
    }

    viewNodeLog() {
        const url = this.nodeinstanceUrl + '/' + this.selectedItem.id + '/command/getSummaryLog'
        const detailurl = this.nodeinstanceUrl + '/' + this.selectedItem.id + '/command/getDetailLog'
        this.common.httpCommon('get', url).subscribe((log: any) => {
            this.common.openModel(NodeInstanceLogDialog, log.data.log, (data: any) => {
                if (data) {
                    window.open(detailurl)
                }
            })
        })
    }

    exportTheData(index: any) {
        const portItem = this.queryPortItem(this.selectedItem.outputPortUuids[index])
        const portValue = this.queryPortValueItem(portItem.portValueUuid)
        const url = this.projectUrl + '/' + this.projectId + '/data/' + portValue.data.value.id + '/command/exportProjectTable';
        const dialog = { title: '导出数据表', placehold: '请输入导出数据表名称', url: url, type: 'table', plan: { planId: this.planId, version: this.planDetail.version, dag: this.dagDate } }
        this.common.openModel(exportProjectTableDialog, dialog, (data: any) => { }, '', '400px', '200px')
    }

    exportTheModel(index: any) {
        const portItem = this.queryPortItem(this.selectedItem.outputPortUuids[index])
        const portValue = this.queryPortValueItem(portItem.portValueUuid)
        const url = this.projectUrl + '/' + this.projectId + '/data/' + portValue.data.value.id + '/command/exportProjectModel';
        const dialog = { title: '导出模型', placehold: '请输入导出模型名称', url: url, type: 'model', plan: { planId: this.planId, version: this.planDetail.version, dag: this.dagDate } }
        this.common.openModel(exportProjectTableDialog, dialog, (data: any) => { }, '', '400px', '200px')
    }

    viewEvalReport() {
        const portItem = this.queryPortItem(this.selectedItem.outputPortUuids[0])
        const portValue = this.queryPortValueItem(portItem.portValueUuid)
        window.open('./#/eveluation/' + portValue.data.value.id)
    }

    //右键菜单处理函数

    // 浏览器全屏函数
    fullScreen() {
        const browType = ['webkitRequestFullScreen', 'requestFullscreen', 'mozRequestFullScreen', 'msRequestFullscreen']
        const el = document.getElementById('fullscreen-container');
        browType.forEach((item: any) => {
            if (typeof el[item] !== undefined && el[item]) {
                el[item].call(el)
            }
        })
        // 将cdk-overlay移入fullscreen-container中，不然会被遮盖,检查是否已经存在cdk-overlay-container，不存在调用overlay.creat()
        if ($('.cdk-overlay-container').length === 0) {
            this.overlay.create()
        }
        $('.fullscreen-container').append($('.cdk-overlay-container'))
        $('[data-toggle="tooltip"]').tooltip('hide')
    }

    //浏览器退出全屏
    exitFull() {
        $('[data-toggle="tooltip"]').tooltip('hide')
        const broeType = ['exitFullscreen', 'mozCancelFullScreen', 'webkitExitFullscreen', 'webkitExitFullscreen']
        broeType.forEach((item: any) => {
            if (document[item]) {
                document[item].call(document)
            }
        })
    }

    // ctrl+c & ctrl+v 复制节点 delete 删除节点
    // mac 上 cmd+c & cmd+v , fn+delete 删除
    copyTheNode() {
        const gloabl = this
        const select = JSON.parse(JSON.stringify((this.selectedItem)))
        let selectId = ''
        let position = []
        document.onkeydown = function(e) {
            const keyCode = e.keyCode || e.which || e.charCode;
            const ctrlKey = e.ctrlKey || e.metaKey;

            if (ctrlKey && keyCode === 67) {
                selectId = select.className.split('.')[select.className.split('.').length - 1]
                position = select.position
            }
            if (ctrlKey && keyCode === 86) {
                if (selectId) {
                    gloabl.newNode(selectId, position[0], position[1])
                }
            }
            if (keyCode === 46) {
                gloabl.deleteNode()
                document.onkeydown = null
            }
        }
        document.onmousedown = function(e) {
            position[0] = e.offsetX
            position[1] = e.offsetY
        }
    }

    //uuid function
    S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }

    guid() {
        return (this.S4() + this.S4() + "-" + this.S4() + "-" + this.S4() + "-" + this.S4() + "-" + this.S4() + this.S4() + this.S4());
    }

    // find dag date with nodeid
    queryNodeDetail(uuid: any) {
        var temp: any = {}
        this.dagDate.nodes.forEach((item: any) => {
            if (item.uuid == uuid) {
                temp = item
            }
        })
        return temp;
    }

    queryPortIndex(uuid: any) {
        var index = 0;
        this.dagDate.ports.forEach((item: any, i: any) => {
            if (item.uuid === uuid) {
                index = i
            }
        })
        return index;
    }

    queryPortItem(uuid: any) {
        var temp: any = {}
        this.dagDate.ports.forEach((item: any) => {
            if (item.uuid === uuid) {
                temp = item
            }
        })
        return temp;
    }

    queryPortValueItem(portValueUuid: any) {
        var temp: any = {}
        var data = this.dagDate.portValues
        data.forEach((item: any, index: any) => {
            if (item.uuid === portValueUuid) {
                temp.data = item
                temp.index = index
            }
        })
        return temp;
    }

    // 根据uuid(target)查找数据
    retuenNodeItemWithInput(uuid: any) {
        var temp: any = {}
        this.dagDate.nodes.forEach((item: any) => {
            if (item.inputPortUuids.indexOf(uuid) > -1) {
                temp = item
            }
        })
        return temp;
    }

    // 修改连线后组件的parentsId
    changeFatherIdsWhenConnect(uuid: any, parentsId: any) {
        var fatherItem = this.queryNodeDetail(uuid)
        if (fatherItem.outputPortUuids.length > 0) {
            fatherItem.outputPortUuids.forEach((output: any) => {
                var outputNode = this.queryPortItem(output)
                if (outputNode.childrenPortsUuid.length) {
                    outputNode.childrenPortsUuid.forEach((child: any) => {
                        var returnItem: any = this.retuenNodeItemWithInput(child)
                        returnItem.parentsId = parentsId.concat(returnItem.parentsId)
                        this.changeFatherIdsWhenConnect(returnItem.uuid, parentsId)
                    })
                }
            })
        }
    }

    // 修改删除线条时子节点的parentsId
    changeFatherIdsWhenDetach(sourceId: any, targetId: any) {
        var sourceItem = this.queryNodeDetail(sourceId)
        var targetItem = this.queryNodeDetail(targetId)
        targetItem.parentsId = this.differentArray(targetItem.parentsId, sourceItem.parentsId)
        if (targetItem.outputPortUuids.length) {
            this.deleteChildNodeFatherIds(targetItem, sourceItem.parentsId)
        }
    }

    deleteChildNodeFatherIds(targetItem: any, parentsId: any) {
        targetItem.outputPortUuids.forEach((item: any) => {
            var childItem = this.queryPortItem(item)
            if (childItem.childrenPortsUuid.length) {
                childItem.childrenPortsUuid.forEach((childPort: any) => {
                    var child = this.retuenNodeItemWithInput(childPort)
                    child.parentsId = this.differentArray(child.parentsId, parentsId)
                    if (child.outputPortUuids.length) {
                        this.deleteChildNodeFatherIds(child, parentsId)
                    }
                })
            }
        })
    }

    // other function

    deleteAnumInArray(item: any, array: any) {
        const index = array.indexOf(item)
        if (index > -1) {
            array.splice(index, 1)
        }
        return array
    }

    differentArray(arr1: any, arr2: any) {
        var arr = arr1.filter(item => { return !arr2.includes(item); });
        return arr;
    }

    // 组件端点的tooltip
    showTooltip() {
        $('[data-toggle="tooltip"]').tooltip()
    }


    // node节点验证，包括非空验证以及输入正确性验证
    configItemChange(item: any) {
        var status = true
        this.dagSaveSign = false;

        item.template.forEach((template: any) => {
            template.config.forEach((config: any) => {
                if (item.config[config.availableKey] === config.availableValue || config.availableValue === undefined) {
                    if (config.configKey !== undefined) {
                        status = this.checkConfigIsEmpty(item.config[config.configKey]) && !this.checkConfigIsEmpty(config.errMsg) ? status : false
                    }
                }
            })
        })
        if (status) {
            item.status = 1
            item.msg = ''
            this.changeDagNodeStatus(item, 1)
            this.fetchPlanSchema()
        } else {
            item.status = 0
            this.changeDagNodeStatus(item, 0)
            item.msg = '参数配置不正确'
        }
    }

    checkConfigIsEmpty(config: any) {
        if (config === undefined || config === null || config === '' || config.length === 0) {
            return false;
        } else {
            return true;
        }
    }

    changeDagNodeStatus(item: any, status: any) {
        this.dagDate.nodes.forEach((node: any) => {
            if (node.parentsId.indexOf(item.uuid) > -1) {
                node.status = status && node.status ? 1 : 0
            }
        })
    }

    checkNodeConfigAfterSchema(item: any) {
        var status = 1
        item.template.forEach((template: any) => {
            template.config.forEach((config: any) => {
                if (item.config[config.availableKey] === config.availableValue || config.availableValue === undefined) {
                    if (config.configKey !== undefined) {
                        status = this.checkConfigIsEmpty(item.config[config.configKey]) && !this.checkConfigIsEmpty(config.errMsg) ? status : 0
                    }
                }
            })
        })
        return status;
    }

    // 隐藏文件夹的组件展示时无法拖动，需要再次绑定
    newItemDragable(item: any) {
        var gloabl = this
        setTimeout(() => {
            gloabl.draggableHelper()
        }, 100)
    }

    // stop函数中计算新建节点的位置信息，包括menu是否展示的情况下进行处理
    draggableHelper() {
        var gloabl = this
        $(".newNodeId").draggable({
            helper: function(event: any) {
                if (!gloabl.runningState && event.currentTarget.id) {
                    return $("<div class='add-item'>" + event.currentTarget.textContent + "</div>")
                } else {
                    return;
                }
            },
            stop: function(event: any, ui: any) {
                var nodeListWidth = $('.node-list-container').width()
                var top = $("#experiment-container").scrollTop() - (parseInt($('.experiment-drag-container').css('top').substring('px')) || 0);
                var left = 0
                if ($('.mat-drawer').css('visibility') === 'hidden' || gloabl.fullScreenState) {
                    left = $("#experiment-container").scrollLeft() - (parseInt($('.experiment-drag-container').css('left').substring('px')) || 0);
                } else {
                    left = $("#experiment-container").scrollLeft() - (parseInt($('.experiment-drag-container').css('left').substring('px')) || 0) - 91;
                }
                if (!gloabl.runningState) {
                    gloabl.newNode(event.target.id, parseInt(ui.position.left + left) - nodeListWidth, parseInt(ui.position.top + top) - 40)
                }
            }
        });
    }

    // dag页面的缩放，只缩放组件大小
    zoomIn() {
        this.zoomLevel = this.zoomLevel + 0.1
        this.zoom()
    }

    zoomOut() {
        this.zoomLevel = this.zoomLevel - 0.1
        this.zoom()
    }

    zoomReset() {
        this.zoomLevel = 1
        this.zoom()
    }

    zoom() {
        var gloabl = this
        this.nodeInstanceSize[0] = this.zoomLevel * 180
        this.nodeInstanceSize[1] = this.zoomLevel * 36
        $('.nodeInstance-detail').css({ 'transform': 'scale(' + this.zoomLevel + ', ' + this.zoomLevel + ')' })
        // 猜测需要等渲染完成后重绘才能生效
        setTimeout(() => {
            gloabl.instance.repaintEverything()
        }, 50)
    }

    initJsplumb() {
        var global = this
        jsPlumb.ready(function() {
            global.instance = jsPlumb.getInstance({
                Connector: "Bezier",
                ConnectionOverlays: [
                    ["Arrow", {
                        location: 1,
                        visible: true,
                        width: 8,
                        length: 8,
                        id: "ARROW",
                        events: {
                            click: function() {
                                console.log("wsa");
                            }
                        }
                    }],
                    ["Label", {
                        location: 0.5,
                        id: "label",
                        cssClass: "aLabel",
                        visible: false,
                        events: {
                            click: function() { }
                        }
                    }]
                ],
                Container: "canvas"
            });

            global.instance.batch(function() {
                global.instance.bind("connection", function(info: any, originalEvent: any) {
                    global.handleConnection(info.connection.endpoints[0].getUuid(), info.connection.endpoints[1].getUuid(), 'connect')
                    var target = global.queryNodeDetail(info.targetId)
                    var source = global.queryNodeDetail(info.sourceId)
                    var portTarget = global.queryPortItem(info.connection.endpoints[1].getUuid())
                    var portSource = global.queryPortItem(info.connection.endpoints[0].getUuid())
                    portTarget.portValueUuid = portSource.portValueUuid
                    if (target.parentsId.indexOf(info.sourceId) < 0) {
                        global.changeFatherIdsWhenConnect(info.sourceId, source.parentsId)
                    }
                    if (!global.isInit) {
                        global.fetchPlanSchema()
                    }
                });
                global.instance.bind("connectionDrag", function(info: any, originalEvent: any) {
                    var item = global.queryNodeDetail(info.sourceId)
                    item && item.parentsId.forEach((id: any) => {
                        global.instance.getEndpoints(id).forEach((item: any) => {
                            $(item.canvas).addClass('can-connect')
                        })
                    })
                })
                global.instance.bind("connectionDetached", function(info: any, originalEvent: any) {
                    var portItem = global.queryPortItem(info.connection.endpoints[1].getUuid())
                    global.handleConnection(info.connection.endpoints[0].getUuid(), info.connection.endpoints[1].getUuid(), 'detach')
                    global.changeFatherIdsWhenDetach(info.sourceId, info.targetId)
                    portItem.portValueUuid = ''
                    if (!global.isInit) {
                        global.configItemChange(global.queryNodeDetail(info.targetId))
                    }
                });

                global.instance.bind("connectionMoved", function(info: any, originalEvent: any) {
                    var oriportItem = global.queryPortItem(info.originalTargetEndpoint.getUuid())
                    var portTarget = global.queryPortItem(info.connection.endpoints[1].getUuid())
                    var portSource = global.queryPortItem(info.connection.endpoints[0].getUuid())
                    global.handleConnection(info.connection.endpoints[0].getUuid(), info.originalTargetEndpoint.getUuid(), 'detach')
                    global.handleConnection(info.connection.endpoints[0].getUuid(), info.connection.endpoints[1].getUuid(), 'connect')
                    global.changeFatherIdsWhenDetach(info.originalSourceId, info.originalTargetId)
                    oriportItem.portValueUuid = ''
                    portTarget.portValueUuid = portSource.portValueUuid
                    if (!global.isInit) {
                        global.configItemChange(global.queryNodeDetail(info.originalTargetId))
                        global.configItemChange(global.queryNodeDetail(info.newTargetId))
                    }
                });
                global.instance.bind("connectionDragStop", function() {
                    $('.can-connect').removeClass('can-connect');
                });
                // 连线以及锚点的右键
                global.instance.bind("contextmenu", function(info: any, event: any) {
                    event.preventDefault()
                })

                global.instance.bind("beforeDrop", function(info: any, originalEvent: any) {
                    var target = global.queryNodeDetail(info.targetId)
                    var source = global.queryNodeDetail(info.sourceId)
                    // 连接父节点判断
                    if (source.parentsId.indexOf(target.uuid) > -1) {
                        return false;
                    } else {
                        return true;
                    }
                });
                global.initNode()
                global.instance.draggable(jsPlumb.getSelector(".experiment-drag-container .nodeInstance"), { scroll: false });
            });

            jsPlumb.fire("jsPlumbDemoLoaded", global.instance);
        })
        $('[data-toggle="tooltip"]').tooltip()
        // this.instance.draggable(jsPlumb.getSelector(".experiment-drag-container .nodeInstance"));
        this.nodeInstanceDrag()
    }

    // http请求函数
    fetchReadableTable(id: any) {
        this.readableTable = []
        var url = this.projectUrl + '/' + id + '/table'
        this.common.httpCommon('get', url).subscribe((data: any) => {
            if (data && data.data) {
                this.readableTable = data.data
            }
        })
    }

    fetchPlanDetail(projectId: any, planId: any) {
        var global = this
        this.dagDate = {}
        global.initJsplumb()
        var url = this.projectUrl + '/' + projectId + '/plan/' + planId
        // for develop
        this.dagDate = { nodes: [], ports: [], portValues: [] }
        this.common.httpCommon('get', url).subscribe((data: any) => {
            if (data) {
                this.planDetail = data.data
                this.formatePlanSummary(this.planDetail)
                if (data.data.dag !== '{}' && data.data.dag !== 'null' && data.data.dag !== '') {
                    this.dagDate = JSON.parse(data.data.dag)
                    if (this.dagDate.nodes) {
                        this.dagDate.nodes.forEach((item: any) => {
                            item.template = item.template
                            item.iconName = this.dagCofigService.iconConfig[item.className]
                        })
                    }
                } else {
                    var temp = { nodes: [], ports: [], portValues: [] }
                    this.dagDate = temp
                }
                if (data.data.isRuning) {
                    this.runningState = true
                    this.fetachRuningDagStatus(this.projectId, this.planId)
                }
                setTimeout(() => { global.initJsplumb() }, 200);
            }
        })
    }

    fetchPlanSummary(projectId: string) {
        const url = this.projectUrl + '/' + projectId
        this.common.httpCommon('get', url).subscribe((summary: any) => {
            if (summary) {
                $('.project-title').html(summary.data.projectName)
            }
        })
    }

    formatePlanSummary(planDetail: any) {
        var configTemp: any = { template: [] }
        var temp = { tabName: '实验详情', config: [] }
        var detail = JSON.parse(JSON.stringify(planDetail))
        temp.config.push({ name: '实验名称', value: 'test', type: 'string' })
        temp.config.push({ name: '创建时间', value: detail.createTime, type: 'date' })
        temp.config.push({ name: '更新时间', value: detail.updateTime, type: 'date' })
        temp.config.push({ name: '创建者', value: detail.createOper, type: 'string' })
        temp.config.push({ name: '备注', value: '', type: 'string' })
        configTemp.template.push(temp)
        this.configList = configTemp
    }

    fetachRuningDagStatus(projectId: any, planId: any) {
        var gloabl = this
        var url = this.projectUrl + '/' + projectId + '/plan/' + planId
        this.common.httpCommon('get', url).subscribe((data: any) => {
            var statusData = JSON.parse(data.data.dag)
            statusData.nodes.forEach((item: any, index: any) => {
                this.dagDate.nodes[index].status = item.status
                this.dagDate.nodes[index].progress = item.progress
                if (item.status === 2) {
                    this.changeRunningConnection(item.uuid)
                } else if (item.status === 3) {
                    this.removeNodeRunningConnection(item.uuid)
                }
            })
            if (data.data.isRuning && this.projectId === projectId) {
                if (!this.dagDestroy) {
                    setTimeout(() => {
                        gloabl.fetachRuningDagStatus(projectId, this.planId)
                    }, 300)
                }
            } else {
                this.dagDate.portValues = statusData.portValues
                this.dagDate.nodes.forEach((node: any, index: any) => {
                    node.id = statusData.nodes[index].id
                })
                this.runningState = false;
                this.removeAllRunningConnection()
            }
        })
    }

    fetchPlanSchema() {
        var temp: any = {};
        var url = this.planSchemaUrl;
        var param: any = { dag: this.dagDate };
        this.common.httpCommon('post', url, param).subscribe((data: any) => {
            if (data) {
                this.changeNodeStatueWithSchema(data.data.nodes)
                this.changeSchemaValue(data.data.portValues)
            }
        });
    }

    changeNodeStatueWithSchema(nodes: any) {
        nodes.forEach((node: any) => {
            this.dagDate.nodes.forEach((dagNode: any) => {
                if (dagNode.uuid === node.uuid) {
                    dagNode.status = this.checkNodeConfigAfterSchema(dagNode) && node.status
                    dagNode.msg = node.msg
                }
            })
        })
    }

    changeSchemaValue(portValue: any) {
        portValue.forEach((port: any) => {
            this.dagDate.portValues.forEach((dagPort: any) => {
                if (port.uuid === dagPort.uuid) {
                    dagPort.enabled = port.enabled
                    dagPort.value = port.value
                }
            })
        })
    }

    saveThePlan() {
        var url = this.projectUrl + '/' + this.projectId + '/plan/' + this.planId
        this.planDetail.dag = this.dagDate
        this.common.httpCommon('post', url, this.planDetail).subscribe((data: any) => {
            if (data) {
                this.dagSaveSign = true;
                this.common.customTip('保存成功', 'success')
            }
        })
    }

    // dag运行函数
    runTheDag() {
        var param = this.planDetail
        param.dag = this.dagDate
        param.force = false
        this.runTheDagFunction(param)
    }

    runTheDagWithForce() {
        var param = this.planDetail
        param.dag = this.dagDate
        param.force = true
        this.runTheDagFunction(param)
    }

    runTheDagFunction(param: any) {
        var url = this.projectUrl + '/' + this.projectId + '/plan/' + this.planId + '/execution/'
        this.runningState = true
        this.dagSaveSign = true
        this.common.httpCommon('post', url, param).subscribe((data: any) => {
            if (data) {
                this.executionId = data.data.executionId
                this.fetachRuningDagStatus(this.projectId, this.planId)
            } else {
                this.runningState = false
            }
        })
    }

    stopTheDag() {
        var url = this.projectUrl + '/' + this.projectId + '/execution/' + this.executionId
        this.common.httpCommon('delete', url).subscribe((data: any) => {
            if (data) {
                this.common.customTip('停止成功', 'success')
            }
        })
    }

    changeThePlan(id?: any) {
        if (this.planId !== id) {
            this.isEmpty = false;
            if (this.dagSaveSign) {
                this.router.navigate(['/drag', this.projectId, id]);
                // this.instance.deleteEveryEndpoint()
                this.planId = id
                this.fetchPlanDetail(this.projectId, this.planId)
            } else {
                var confirm = window.confirm('你还没有保存，确定要离开吗？')
                if (confirm) {
                    this.dagSaveSign = true;
                    this.router.navigate(['/drag', this.projectId, id]);
                    this.planId = id
                    this.fetchPlanDetail(this.projectId, this.planId)
                }
            }
        }
    }

    ngOnInit(): void {
        var gloabl = this
        this.initJsplumb()
        // 检测页面全屏动作
        fromEvent(window, 'resize').subscribe((event: any) => {
            this.fullScreenState = !this.fullScreenState
        })
        window.onbeforeunload = function(e) {
            if (!gloabl.dagSaveSign) {
                var e = window.event || e;
                e.returnValue = ("确定离开当前页面吗？");
            }
        };
    }
    canDeactivate(): Observable<any> | any {
    }

    ngAfterViewInit(): void {
        $('[data-toggle="tooltip"]').tooltip()
        $(".experiment-drag-container").draggable()
        this.draggableHelper()
    }

    ngOnDestroy(): void {
        window.onbeforeunload = null;
    }

}



