import { Component, OnInit, Input, ChangeDetectorRef, Inject, NgZone, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { DagConfigService } from '../../services/dag-config.service';
import { CommonService } from '../../services/common.service';
import { ApilistService } from '../../services/apilist.service';
import { SqlFunctionService } from '../../services/sql-function.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { newProjectDialog } from '../project-manage/project-manage.component';
import { Md5 } from 'ts-md5/dist/md5';
import 'codemirror/lib/codemirror';
import 'codemirror/mode/sql/sql';
import 'codemirror/addon/display/autorefresh';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/sql-hint';

declare var $: any;

export interface TableItem {
    alias: string;
    id: string;
    createOper: string;
    size: string;
    createTime: string;
    coluns: string;
    rows: string;
}

export interface DialogData {
}

@Component({
    selector: 'app-node-config',
    templateUrl: './node-config.component.html',
    styleUrls: ['./node-config.component.css']
})
export class NodeConfigComponent implements OnInit {

    constructor(public changeDetectorRef: ChangeDetectorRef,
        public dialog: MatDialog,
        public dagCofigService: DagConfigService,
        private zone: NgZone,
        private apilist: ApilistService,
        private common: CommonService,
        private sqlFun: SqlFunctionService) {
    }

    tableHeader: any = { name: '字段', type: '类型' };
    displayedColumns = ['name', 'type'];
    columnsToDisplay = this.displayedColumns.slice();
    tableData: any;
    tabIndex: string = '0';
    @Input() config: any;
    @Input() tableList: any;
    @Input() projectId: any;
    @Input() dagData: any;
    @Output() configChange = new EventEmitter<string>();
    myControl = new FormControl();
    filteredOptions: Observable<TableItem[]>;

    private projectUrl = this.apilist.projectUrl;
    private planSchemaUrl = this.apilist.planSchemaUrl;
    private assetsFunctionsUrl = this.apilist.assetsFunctionsUrl;

    updateOption() {
        this.changeDetectorRef.markForCheck();
        this.changeDetectorRef.detectChanges();
    }

    displayFn(item?: TableItem): string | undefined {
        return item ? item.alias : undefined;
    }

    private _filter(name: string): TableItem[] {
        const filterValue = name.toLowerCase();

        return this.tableList.filter(option => option.alias.toLowerCase().indexOf(filterValue) === 0);
    }

    openFeatureModel(config: any, name: string, item: any) {
        let temp = {
            title: name,
            config: config,
            dataDef: [],
            expressions: [],
            statisticFuncList: this.dagCofigService.statisticFuncList,
            argsOptions: [],
            errMsg: ''
        };
        let variables = [];
        temp.argsOptions = this.getArgsOptions(temp.config.featureConfig.feature.expression.inputs);
        if (config.featureConfig.variables.length > 0) {
            temp.argsOptions = this.getArgsOptionsForDynamic(temp.argsOptions, config.featureConfig.variables);
        }
        this.formatePlanSchema(this.dagData.portValues, false, (schema: any) => {
            temp.dataDef = schema.length > 0 ? schema[0].schemas : [];
            if (!temp.config.tableName) {
                temp.config.tableName = schema.length > 0 ? schema[0].name.slice(schema[0].name.indexOf(':') + 1) : '';
            }
            temp.config = config;
            this.getExpressions((data: any) => {
                temp.expressions = data;
                if (!temp.config.featureConfig.feature.expression.function) {
                    temp.config.featureConfig.feature.expression.function = 'collect';
                }
                if (temp.dataDef.length <= 0) {
                    this.common.customTip('数据源不能为空，请检查', 'warning');
                    return;
                }

                if (!temp.config.featureConfig.feature.flowId) {
                    temp.config.featureConfig.feature.flowId = temp.dataDef[0] && temp.dataDef[0].name;
                }
                if (temp.argsOptions.length == 1 && temp.argsOptions[0].staticValue === '') {
                    temp.argsOptions[0].staticValue = temp.dataDef[0].name;
                }
                this.zone.run(() => {
                    let result = JSON.parse(JSON.stringify(temp));
                    this.common.openModel(featureEditDialog, result, (data: any) => {
                        data.argsOptions.forEach((item: any, index: any) => {
                            if (item.type === '$') {
                                temp.config.featureConfig.feature.expression.inputs[index] = item.type + item.dynamicValue;
                                variables.push({
                                    'alias': item.dynamicValue,
                                    'calc': { 'on': item.calcOn, 'oper': item.calcOper },
                                    'filter': item.filter,
                                    'flowId': data.config.featureConfig.feature.flowId,
                                    'key': { 'dim': item.keyOn, 'ns': 'bsfit', 'on': item.keyOn },
                                    'name': item.variableName,
                                    'tw': { 'on': item.twOn, 'pattern': item.twPattern },
                                    'namespace': 'cn.com.bsfit.dd',
                                    'use': data.config.tableName
                                });
                                temp.config.featureConfig.variables = variables;
                            } else {
                                temp.config.featureConfig.feature.expression.inputs[index] = item.type + item.staticValue;
                            }
                        });
                        temp.config.tableName = data.config.tableName;
                        temp.config.featureConfig.feature.flowId = data.config.featureConfig.feature.flowId;
                        temp.config.featureConfig.feature.expression.function = data.config.featureConfig.feature.expression.function;
                        temp.config.name = temp.config.featureConfig.feature.name = data.config.featureConfig.feature.name;
                        temp.config.alias = temp.config.featureConfig.feature.alias = data.config.featureConfig.feature.alias;
                        item.errMsg = data.errMsg;
                        this.configItemChange();
                    }, '', '1000px', '600px');
                });
            });
        });
    }

    openSqlModel(item: any) {
        var config = this.dagCofigService.codemirrorOptions;
        var temp = JSON.parse(JSON.stringify(item));
        this.formatePlanSchema(this.dagData.portValues, false, (schema: any) => {
            config.hintOptions.tables = this.formateCustomSql(schema);
            temp.schema = schema;
            temp.config = config;
            temp.containerHeight = 490 - 48 * (schema.length + 1) - 16;
            this.zone.run(() => {
                const dialogRef = this.dialog.open(SqlEditDialog, {
                    width: '1000px',
                    height: '590px',
                    data: temp
                });
                dialogRef.afterClosed().subscribe(result => {
                    if (result && result.value || result.value === '') {
                        item.sql = result.value;
                        this.configItemChange();
                    }
                });
            });
        });
    }

    selectSchema(item: any) {
        this.formatePlanSchema(this.dagData.portValues, true, (schema: any) => {
            if (schema.length > 0) {
                var param: any = {};
                param.data = schema[0].schemas;
                param.type = item.schemaType;
                this.formateDisabledSchema(param, item)
                console.log(param)
                this.common.openModel(SelectSchemaDialog, param, (result) => {
                    if (result) {
                        if (item.schemaType === 'radio') {
                            if (result.selected !== undefined && result.selected !== '') {
                                this.config.config[item.configKey] = result.selected.name;
                            } else {
                                this.config.config[item.configKey] = '';
                            }
                        } else {
                            var temp: any = [];
                            result.forEach((res: any) => {
                                res.schema.forEach((it: any) => {
                                    if (it.isCheck) {
                                        temp.push(it.name);
                                    }
                                })
                            });
                            this.config.config[item.configKey] = temp;
                        }
                        this.configItemChange();
                    }
                }, '', '1000px', '600px');
            } else {
                this.config.config[item.configKey] = ''
                this.common.customTip('无可用schema信息', 'warning');
            }
        });
    }

    fetchTableDetail(value: any, item: any, event:any) {
        $('.blurInput').blur()
        if (item.config.tableId !== value.id) {
            item.config.tableId = value.id;
            this.configItemChange();
        }
        this.fetchTableSchema(value.id);
    }

    fetchTableSchema(tableId: any) {
        var url = this.projectUrl + '/' + this.projectId + '/table/' + tableId;
        this.common.httpCommon('get', url).subscribe((data: any) => {
            this.tableData = data.data.schema;
        });
    }

    fetchPlanSchema(callback: any) {
        var temp: any = {};
        var url = this.planSchemaUrl;
        var param: any = { dag: this.dagData };
        this.common.httpCommon('post', url, param).subscribe((data: any) => {
            if (data) {
                temp = data.data.portValues;
                callback && callback(temp);
            }
        });
    }

    formatePlanSchema(tempData: any, isFormate: boolean, callback: any) {
        var result: any = [];
        var unSortResult: any = [];
        tempData && tempData.forEach((item: any) => {
            var tempResult: any = {};
            if (item.value && item.value.schemas) {
                var index = 0;
                this.dagData.ports.forEach((port: any) => {
                    if (item.uuid === port.portValueUuid) {
                        if (this.config.inputPortUuids.indexOf(port.uuid) > -1) {
                            index = this.config.inputPortUuids.indexOf(port.uuid) + 1;
                        }
                    }
                });
                if (index) {
                    if (item.value.name !== undefined && item.value.name !== '' && item.value.name !== null) {
                        tempResult.name = 'T' + index + ':' + item.value.name;
                    } else {
                        tempResult.name = 'T' + index;
                    }
                    if (isFormate) {
                        tempResult.schemas = this.formateSchemaWithType(item.value.schemas);
                    } else {
                        tempResult.schemas = item.value.schemas;
                    }
                    unSortResult[index - 1] = tempResult;
                }
            }
        });
        if (unSortResult.length > 0) {
            unSortResult.forEach((item: any) => {
                if (item !== '' && item !== undefined) {
                    result.push(item);
                }
            });
        }
        callback && callback(result);
    }

    formateSchemaWithType(schema: any) {
        let result: any = []
        let temp: any = []
        schema.forEach((item: any) => {
            if (result[item.type]) {
                result[item.type].push(item)
            } else {
                result[item.type] = [item]
            }
        })
        for (let re in result) {
            const te: any = {}
            te.type = re
            te.isCheck = false
            te.isShow = true
            te.schema = result[re]
            temp.push(te)
        }
        return temp;
    }

    formateDisabledSchema(param: any, item: any) {
        if (item.schemaType === 'radio') {
            param.data.forEach((pas: any) => {
                pas.schema.forEach((pa: any) => {
                    if (pa.name === this.config.config[item.configKey]) {
                        param.selected = pa;
                    }
                    if (this.config.config[item.exclusion] && this.config.config[item.exclusion].indexOf(pa.name) > -1) {
                        pa.disabled = true;
                    } else {
                        pa.disabled = false;
                    }
                })
            });
        } else if (item.schemaType === 'checkbox') {
            param.data.forEach((pas: any) => {
                pas.schema.forEach((pa: any) => {
                    if (this.config.config[item.exclusion] !== '' && this.config.config[item.exclusion] === pa.name) {
                        pa.disabled = true;
                    } else {
                        pa.disabled = false;
                    }
                    if (this.config.config[item.configKey] && this.config.config[item.configKey].indexOf(pa.name) > -1) {
                        pa.isCheck = true;
                    } else {
                        pa.isCheck = false
                    }
                })
            });
        }
    }

    formateCustomSql(schema: any) {
        // 自定义sql function 加在SqlFunctionService中
        var customSql = this.formateSqlFun();
        schema.forEach((items: any) => {
            var tempArray = [];
            items.schemas.forEach((item: any) => {
                tempArray.push(item.name);
            });
            customSql[items.name.split(':')[0]] = tempArray;
            customSql[items.name.split(':')[1]] = tempArray;
        });
        return customSql;
    }

    formateSqlFun() {
        var temp: any = {}
        this.sqlFun.sqlTipFunction.forEach((item: any) => {
            temp[item] = []
        })
        return temp;
    }

    configItemChange() {
        this.configChange.emit(this.config);
    }

    checkIntNumber(value: any, item: any) {
        var min = item.min || 1
        var max = item.max || 65535
        if (value === '') {
            item.errMsg = '请输入[' + min + '，' + max + ']范围内的整数';
        } else {
            if (value.indexOf('.') > -1 || parseInt(value) < parseInt(min) || parseInt(value) > parseInt(max) || parseInt(value) === NaN) {
                item.errMsg = '请输入[' + min + '，' + max + ']范围内的整数';
            } else {
                item.errMsg = '';
            }
        }
        this.configItemChange()
    }

    checkStringInput(value: any, item: any) {
        if (value === '') {
            item.errMsg = '不允许为空'
        } else {
            item.errMsg = ''
        }
        this.configItemChange()
    }

    // checkMemoryInput(value: any, item: any) {
    //     var reg = '^[1-9][0-9]*[g]{1}$';
    //     if (value.match(reg) === null) {
    //         item.errMsg = '请输入正确参数，例如4g'
    //     } else {
    //         item.errMsg = ''
    //     }
    //     this.configItemChange()
    // }

    getExpressions(callback: any) {
        let url = this.assetsFunctionsUrl;
        let temp: any = [];
        this.common.httpCommon('get', url).subscribe((data: any) => {
            if (data) {
                temp = data.data;
                callback && callback(temp);
            }
        });
    }

    getArgsOptions(featureExpressionInputs: any) {
        let argsOptions = [];
        featureExpressionInputs.map(item => {
            if (item.slice(0, 1) === '#') {
                argsOptions.push({
                    type: item.slice(0, 1),
                    staticValue: item.slice(1, item.length)
                });
            } else {
                argsOptions.push({
                    type: item.slice(0, 1),
                    dynamicValue: item.slice(1, item.length)
                });
            }
        });
        return argsOptions;
    }

    getArgsOptionsForDynamic(argsOptions, featureConfigVariables) {
        argsOptions.forEach((item: any) => {
            if (item.type === '$') {
                featureConfigVariables.forEach((variable: any) => {
                    if (variable.alias === item.dynamicValue) {
                        item['variableName'] = variable.name;
                        item['keyOn'] = variable.key.on;
                        item['calcOper'] = variable.calc.oper;
                        item['calcOn'] = variable.calc.on;
                        item['twOn'] = variable.tw.on;
                        item['twPattern'] = variable.tw.pattern;
                        item['filter'] = variable.filter;
                    }
                });
            }
        });
        return argsOptions;
    }

    ngOnInit() {
        this.filteredOptions = this.myControl.valueChanges
            .pipe(
                startWith<string | TableItem>(''),
                map(value => typeof value === 'string' ? value : value.alias),
                map(alias => alias ? this._filter(alias) : this.tableList.slice())
            );
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.config && !changes.config.firstChange) {
            if (changes.config.currentValue.uuid !== changes.config.previousValue.uuid) {
                this.tabIndex = '0';
            }
            if (changes.config.currentValue.className && changes.config.currentValue.className.indexOf('ReadTableNode') > 0) {
                this.fetchTableSchema(changes.config.currentValue.config.tableId);
            }

        }
        this.updateOption();
    }

}