import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DagConfigService } from '../../services/dag-config.service';
declare var $: any;

@Component({
    selector: 'app-node-list',
    templateUrl: './node-list.component.html',
    styleUrls: ['./node-list.component.css']
})
export class NodeListComponent implements OnInit {

    constructor(public dagCofigService: DagConfigService) { }
    @Output() toggleAfter = new EventEmitter<any>();
    filter: string = '';
    nodeList: any = this.dagCofigService.nodeListConfig;

    toggleItem(item: any) {
        item.isShow = !item.isShow
        this.toggleAfter.emit()
    }

    filtNodeList() {
        const nodeList = this.dagCofigService.nodeListConfig;
        if (this.filter !== '') {
            this.nodeList = this.sortNodeListFunction(nodeList)
        } else {
            this.nodeList = nodeList;
        }
    }

    sortNodeListFunction(list: any) {
        const tempList = []
        list.forEach((items: any) => {
            items.nodeList.forEach((node: any) => {
                if (node.folderName !== undefined) {
                    node.nodeList.forEach((nodeChild: any) => {
                        if (nodeChild.name.indexOf(this.filter) > -1) {
                            const temp = { folderName: items.folderName, isShow: items.isShow, nodeList: [] }
                            const tempChild = { folderName: node.folderName, isShow: node.isShow, nodeList: [nodeChild] }
                            if (!tempList.length) {
                                tempList.push(temp)
                                tempList[tempList.length - 1].nodeList.push(tempChild)
                            } else if (tempList[tempList.length - 1].folderName !== items.folderName) {
                                tempList.push(temp)
                                tempList[tempList.length - 1].nodeList.push(tempChild)
                            } else {
                                if (tempList[tempList.length - 1].nodeList[tempList[tempList.length - 1].nodeList.length - 1].folderName !== node.folderName) {
                                    tempList[tempList.length - 1].nodeList.push(tempChild)
                                } else {
                                    tempList[tempList.length - 1].nodeList[tempList[tempList.length - 1].nodeList.length - 1].nodeList.push(nodeChild)
                                }
                            }
                        }
                    })
                } else {
                    if (node.name.indexOf(this.filter) > -1) {
                        const temp = { folderName: items.folderName, isShow: items.isShow, nodeList: [] }
                        if (!tempList.length) {
                            tempList.push(temp)
                            tempList[0].nodeList.push(node)
                        } else {
                            if (tempList[tempList.length - 1].folderName !== items.folderName) {
                                tempList.push(temp)
                                tempList[tempList.length - 1].nodeList.push(node)
                            } else {
                                tempList[tempList.length - 1].nodeList.push(node)
                            }
                        }
                    }
                }
            })
        })
        return tempList;
    }

    ngOnInit() {
    }
}
