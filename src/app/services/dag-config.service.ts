import { Injectable } from '@angular/core';
import * as CodeMirror from 'codemirror';

@Injectable()
export class DagConfigService {

	constructor() { }
	connectorPaintStyle: any = {
		strokeWidth: 1,
		stroke: "#7F8081",
		joinstyle: "round",
		strokeDasharray: 5
	};
	connectorHoverStyle: any = {
		strokeWidth: 3,
		stroke: "#7F8081",
		outlineWidth: 5,
		outlineStroke: "white"
	};
	endpointHoverStyle: any = {
		fill: "#7F8081",
		stroke: "#7F8081",
		zIndex: 200
	}
	sourceEndpoint: any = {
		endpoint: "Dot",
		paintStyle: {
			fill: "#7F8081",
			radius: 5,
			strokeWidth: 1
		},
		isSource: true,
		allowLoopback: false,
		connector: ["Bezier", { stub: [0, 0], gap: 10, cornerRadius: 5, alwaysRespectStubs: true }],
		connectorStyle: this.connectorPaintStyle,
		hoverPaintStyle: this.endpointHoverStyle,
		dragOptions: { zIndex: 2001 },
		maxConnections: -1,
		overlays: [
			["Label", {
				location: [0.5, 1.5],
				label: "Drag",
				cssClass: "endpointSourceLabel",
				visible: false
			}]
		]
	};
	targetEndpoint: any = {
		endpoint: "Dot",
		paintStyle: { stroke: "#7F8081", radius: 5, fill: "transparent" },
		hoverPaintStyle: this.endpointHoverStyle,
		maxConnections: 1,
		dropOptions: { hoverClass: "hover", activeClass: "active" },
		isTarget: true,
		allowLoopback: false,
		overlays: [
			["Label", { location: [0.5, 5.5], label: "Drop", cssClass: "endpointTargetLabel", visible: false }]
		]
	};

	// nodeinstance icon config
	iconConfig: any = {
		'cn.com.bsfit.sl.workflow.service.node.ReadTableNode': 'icon-barchart',
		'cn.com.bsfit.sl.workflow.service.node.SqlScriptNode': 'icon-sql',
		'cn.com.bsfit.sl.workflow.service.node.DecisionTreeBinaryClassifierNode': 'icon-calculate',
		'cn.com.bsfit.sl.workflow.service.node.LRBinaryClassifierNode': 'icon-calculate',
		'cn.com.bsfit.sl.workflow.service.node.RFBinaryClassifierNode': 'icon-calculate',
		'cn.com.bsfit.sl.workflow.service.node.GBDTBinaryClassifierNode': 'icon-calculate',
		'cn.com.bsfit.sl.workflow.service.node.MLPBinaryClassifierNode': 'icon-calculate',
		'cn.com.bsfit.sl.workflow.service.node.FeatureConfigNode': 'icon-feature',
		'cn.com.bsfit.sl.workflow.service.node.SplitNode': 'icon-split',
		'cn.com.bsfit.sl.workflow.service.node.MultilayerSampleNode': 'icon-shiyan',
		'cn.com.bsfit.sl.workflow.service.node.RandomSampleNode': 'icon-shiyan'
	};

	nodeListConfig: any = [
		{
			folderName: '数据源',
			isShow: true,
			nodeList: [{
				name: '读数据表',
				icon: 'icon-barchart',
				state: 1,
				id: 'ReadTableNode'
			}]
		}, {
			folderName: '数据预处理',
			isShow: true,
			nodeList: [{
				folderName: '采样',
				isShow: false,
				nodeList: [{
					name: '随机采样',
					icon: 'icon-shiyan',
					state: '1',
					id: 'RandomSample'
				}, {
					name: '分层采样',
					icon: 'icon-shiyan',
					state: '1',
					id: 'MultilayerSample'
				}]
			}, {
				name: '拆分',
				icon: 'icon-split',
				state: 1,
				id: 'SplitNode'
			}, {
				name: '异常值替换',
				icon: 'icon-code',
				state: 1,
				id: ''
			}, {
				name: '类型转换',
				icon: 'icon-code',
				state: 1,
				id: ''
			}]
		}, {
			folderName: '特征工程',
			isShow: false,
			nodeList: [{
				folderName: '特征生成',
				isShow: false,
				nodeList: [{
					name: '特征配置',
					icon: 'icon-feature',
					state: 1,
					id: 'FeatureConfigNode'
				}]
			}, {
				folderName: '特征重要性评估',
				isShow: false,
				nodeList: [{
					name: '随机森林特征重要性评估',
					icon: 'icon-code',
					state: 1,
					id: ''
				}]
			}]
		}, {
			folderName: '统计分析',
			isShow: false,
			nodeList: [{
				name: '离散值分析',
				icon: 'icon-code',
				state: 1,
				id: ''
			}, {
				name: '连续值分析',
				icon: 'icon-code',
				state: 1,
				id: ''
			}]
		}, {
			folderName: '机器学习',
			isShow: false,
			nodeList: [{
				folderName: '二分类',
				isShow: false,
				nodeList: [{
					name: '决策树二分类',
					icon: 'icon-calculate',
					state: 1,
					id: 'DecisionTreeBinaryClassifierNode'
				}, {
					name: '逻辑回归二分类',
					icon: 'icon-calculate',
					state: 1,
					id: 'LRBinaryClassifierNode'
				}, {
					name: '随机森林二分类',
					icon: 'icon-calculate',
					state: 1,
					id: 'RFBinaryClassifierNode'
				}, {
					name: 'GBDT二分类',
					icon: 'icon-calculate',
					state: 1,
					id: 'GBDTBinaryClassifierNode'
				}, {
					name: '多层感知器二分类',
					icon: 'icon-calculate',
					state: 1,
					id: 'MLPBinaryClassifierNode'
				}, {
					name: '朴素贝叶斯二分类',
					icon: 'icon-calculate',
					state: 1,
					id: 'NaiveBayesBinaryClassifierNode'
				}]
			}, {
				folderName: '评估',
				isShow: false,
				nodeList: [{
					name: '二分类评估',
					icon: 'icon-feature',
					state: 1,
					id: 'BinaryClassifierEvalNode'
				}]
			}, {
				name: '预测',
				icon: 'icon-calculate',
				state: 1,
				id: 'ModelPred'
			}]
		}, {
			folderName: '工具',
			isShow: false,
			nodeList: [{
				name: 'SQL脚本',
				icon: 'icon-sql',
				state: 1,
				id: 'SqlScriptNode'
			}]
		}

	];
	// dataType: 0: file 1: model 2: table
	// exclusion 字段表示互斥字段，即exclusion字段选中的schema无法选择
	nodeDetailList: any = {
		ReadTableNode: {
			nodeName: '读数据表',
			className: 'cn.com.bsfit.sl.workflow.service.node.ReadTableNode',
			inputPortDes: [],
			outputPortDes: ['读数据表的输出'],
			inputScope: [],
			outputScope: [{ dataType: '2', format: '0' }],
			dataType: '2',
			format: '0',
			config: { tableId: '' },
			msg: '参数配置不正确',
			configList: [{
				tabName: '字段设置',
				config: [{ type: 'autocomplete', name: '表名', configKey: 'tableId' }]
			},
			{
				tabName: '字段信息',
				config: [{ type: 'table', name: '源表字段信息' }]
			}]
		},
		SqlScriptNode: {
			nodeName: 'SQL',
			className: 'cn.com.bsfit.sl.workflow.service.node.SqlScriptNode',
			inputPortDes: ['SQL脚本的输入t1', 'SQL脚本的输入t2', 'SQL脚本的输入t3', 'SQL脚本的输入t4', 'SQL脚本的输入t5', 'SQL脚本的输入t6'],
			outputPortDes: ['SQL脚本的输出'],
			inputScope: [
				{ dataType: '2', format: '0' },
				{ dataType: '2', format: '0' },
				{ dataType: '2', format: '0' },
				{ dataType: '2', format: '0' },
				{ dataType: '2', format: '0' },
				{ dataType: '2', format: '0' }
			],
			outputScope: [{ dataType: '2', format: '0' }],
			dataType: '2',
			format: '0',
			config: {
				'sql': '',
				'spark.driver.cores': '1',
				'spark.driver.memory': '2',
				'spark.driver.maxResultSize': '2',
				'spark.executor.instances': '2',
				'spark.executor.cores': '2',
				'spark.executor.memory': '2',
				'spark.executor.extraJavaOptions': '-XX:MetaspaceSize=64m -XX:MaxMetaspaceSize=128m'
			},
			msg: '参数配置不正确',
			configList: [{
				tabName: '字段设置',
				config: [{ type: 'sql', name: 'sql脚本', configKey: 'sql' }]
			},
			{
				tabName: '执行调优',
				config: [
					{ type: 'int', name: 'driverCores-驱动器核数', configKey: 'spark.driver.cores', min: '1', max: '65535', step: '1' },
					{ type: 'int', name: 'driverMemory-驱动器内存', configKey: 'spark.driver.memory', company: 'G' },
					{ type: 'int', name: 'driverMaxResultSize-驱动器最大结果大小', configKey: 'spark.driver.maxResultSize', company: 'G' },
					{ type: 'int', name: 'executorInstances-执行器个数', configKey: 'spark.executor.instances' },
					{ type: 'int', name: 'executorCores-执行器核数', configKey: 'spark.executor.cores', min: '1', max: '65535', step: '1' },
					{ type: 'int', name: 'executorMemory-执行器内存', configKey: 'spark.executor.memory', company: 'G' },
					{ type: 'textarea', name: 'extraJavaOptions-JVM配置', configKey: 'spark.executor.extraJavaOptions' }
				]
			}]
		},
		DecisionTreeBinaryClassifierNode: {
			nodeName: '决策树二分类',
			className: 'cn.com.bsfit.sl.workflow.service.node.DecisionTreeBinaryClassifierNode',
			inputPortDes: ['决策树的输入'],
			outputPortDes: ['决策树的输出'],
			inputScope: [{ dataType: '2', format: '0' }],
			outputScope: [{ dataType: '1', format: '0' }],
			dataType: '1',
			format: '0',
			algoName: '决策树',
			algoCategory: 0,
			config: {
				'labelColumnName': '',
				'featureColumnNames': [],
				'maxDepth': '5',
				'maxBins': '32',
				'minInstancesPerNode': '100',
				'minInfoGain': '0',
				'seed': '0',
				'Impurity': 'gini',
				'spark.driver.cores': '1',
				'spark.driver.memory': '2',
				'spark.driver.maxResultSize': '2',
				'spark.executor.instances': '2',
				'spark.executor.cores': '2',
				'spark.executor.memory': '2',
				'spark.executor.extraJavaOptions': '-XX:MetaspaceSize=64m -XX:MaxMetaspaceSize=128m'
			},
			msg: '参数配置不正确',
			configList: [{
				tabName: '字段设置',
				config: [
					{ type: 'selectSchema', name: '标签列列名', configKey: 'labelColumnName', schemaType: 'radio', exclusion: 'featureColumnNames' },
					{ type: 'selectSchema', name: '特征列列名', configKey: 'featureColumnNames', schemaType: 'checkbox', exclusion: 'labelColumnName' }
				]
			}, {
				tabName: '参数设置',
				config: [
					{ type: 'int', name: '树的最大深度', configKey: 'maxDepth', min: '1', max: '65535', step: '1' },
					{ type: 'int', name: '最大分组数', configKey: 'maxBins', min: '2', max: '65535', step: '1' },
					{ type: 'int', name: '叶节点最小样本数', configKey: 'minInstancesPerNode', min: '2', max: '65535', step: '1' },
					{ type: 'input', name: '最小信息增益', configKey: 'minInfoGain', min: '0'},
					{ type: 'select', name: '信息增益计算的准则', configKey: 'Impurity', options: [{name: 'gini', value: 'gini'}, {name:'entropy', value: 'entropy'}] },
					{ type: 'int', name: '随机种子', configKey: 'seed', min: '-65535', max: '65535' }
				]
			}, {
				tabName: '执行调优',
				config: [
					{ type: 'int', name: 'driverCores-驱动器核数', configKey: 'spark.driver.cores', min: '1', max: '65535', step: '1' },
					{ type: 'int', name: 'driverMemory-驱动器内存', configKey: 'spark.driver.memory', company: 'G' },
					{ type: 'int', name: 'driverMaxResultSize-驱动器最大结果大小', configKey: 'spark.driver.maxResultSize', company: 'G' },
					{ type: 'int', name: 'executorInstances-执行器个数', configKey: 'spark.executor.instances' },
					{ type: 'int', name: 'executorCores-执行器核数', configKey: 'spark.executor.cores', min: '1', max: '65535', step: '1' },
					{ type: 'int', name: 'executorMemory-执行器内存', configKey: 'spark.executor.memory', company: 'G' },
					{ type: 'textarea', name: 'extraJavaOptions-JVM配置', configKey: 'spark.executor.extraJavaOptions' }
				]
			}]
		},
		ModelPred: {
			nodeName: '预测',
			className: 'cn.com.bsfit.sl.workflow.service.node.ModelPred',
			inputPortDes: ['预测的输入m1', '预测的输入t1'],
			outputPortDes: ['预测的输出'],
			inputScope: [{ dataType: '1', format: '0' }, { dataType: '2', format: '0' }],
			outputScope: [{ dataType: '2', format: '0' }],
			dataType: '2',
			format: '0',
			config: {
				'features': [],
				'columnName': 'predictScoreColumnName',
				'spark.driver.cores': '1',
				'spark.driver.memory': '2',
				'spark.driver.maxResultSize': '2',
				'spark.executor.instances': '2',
				'spark.executor.cores': '2',
				'spark.executor.memory': '2',
				'spark.executor.extraJavaOptions': '-XX:MetaspaceSize=64m -XX:MaxMetaspaceSize=128m'
			},
			configList: [{
				tabName: '参数设置',
				config: [{ type: 'input', name: '预测分数输出列列名', configKey: 'columnName' },
				{ type: 'selectSchema', name: '保留列列名列表', configKey: 'features', schemaType: 'checkbox' }]
			}, {
				tabName: '执行调优',
				config: [
					{ type: 'int', name: 'driverCores-驱动器核数', configKey: 'spark.driver.cores', min: '1', max: '65535', step: '1' },
					{ type: 'int', name: 'driverMemory-驱动器内存', configKey: 'spark.driver.memory', company: 'G' },
					{ type: 'int', name: 'driverMaxResultSize-驱动器最大结果大小', configKey: 'spark.driver.maxResultSize' },
					{ type: 'int', name: 'executorInstances-执行器个数', configKey: 'spark.executor.instances', company: 'G' },
					{ type: 'int', name: 'executorCores-执行器核数', configKey: 'spark.executor.cores', min: '1', max: '65535', step: '1' },
					{ type: 'int', name: 'executorMemory-执行器内存', configKey: 'spark.executor.memory', company: 'G' },
					{ type: 'textarea', name: 'extraJavaOptions-JVM配置', configKey: 'spark.executor.extraJavaOptions' }
				]
			}]
		},
		FeatureConfigNode: {
			nodeName: '特征',
			className: 'cn.com.bsfit.sl.workflow.service.node.FeatureConfigNode',
			inputPortDes: ['特征的输入t1'],
			outputPortDes: ['特征的输出'],
			inputScope: [{ dataType: '2', format: '0' }],
			outputScope: [{ dataType: '2', format: '0' }],
			dataType: '2',
			format: '0',
			config: {
				'featureConfig': {
					'Manifest-Version': 1.0,
					'variables': [],
					'feature': {
						'expression': {
							'inputs': ['#'],
							'function': ''
						},
						'flowId': '',
						'tableName': ''
					}
				},
				'name': '无',
				'alias': '无',
				'createOper': '',
				'createTime': '',
				'spark.driver.cores': '1',
				'spark.driver.memory': '2',
				'spark.driver.maxResultSize': '2',
				'spark.executor.instances': '2',
				'spark.executor.cores': '2',
				'spark.executor.memory': '2',
				'spark.executor.extraJavaOptions': '-XX:MetaspaceSize=64m -XX:MaxMetaspaceSize=128m'
			},
			configList: [{
				tabName: '参数设置',
				config: [
					{ type: 'openModel', name: '配置', configKey: 'feature', errMsg: '特征配置填写不完整' },
					{ type: 'string', name: '特征名称', configKey: 'name' },
					{ type: 'string', name: '特征代码', configKey: 'alias' },
					{ type: 'string', name: '创建者', configKey: 'createOper' },
					{ type: 'date', name: '创建时间', configKey: 'createTime' },
				]
			}, {
				tabName: '执行调优',
				config: [
					{ type: 'int', name: 'driverCores-驱动器核数', configKey: 'spark.driver.cores', min: '1', max: '65535', step: '1' },
					{ type: 'int', name: 'driverMemory-驱动器内存', configKey: 'spark.driver.memory', company: 'G' },
					{ type: 'int', name: 'driverMaxResultSize-驱动器最大结果大小', configKey: 'spark.driver.maxResultSize', company: 'G' },
					{ type: 'int', name: 'executorInstances-执行器个数', configKey: 'spark.executor.instances' },
					{ type: 'int', name: 'executorCores-执行器核数', configKey: 'spark.executor.cores', min: '1', max: '65535', step: '1' },
					{ type: 'int', name: 'executorMemory-执行器内存', configKey: 'spark.executor.memory', company: 'G' },
					{ type: 'textarea', name: 'extraJavaOptions-JVM配置', configKey: 'spark.executor.extraJavaOptions' }
				]
			}]
		},
		BinaryClassifierEvalNode: {
			nodeName: '二分类评估',
			className: 'cn.com.bsfit.sl.workflow.service.node.BinaryClassifierEvalNode',
			inputPortDes: ['二分类评估的输入'],
			outputPortDes: [''],
			outputHiddenNumber: 1,
			inputScope: [{ dataType: '2', format: '0' }],
			outputScope: [{ dataType: '0', format: '0' }],
			dataType: '0',
			format: '0',
			config: {
				'label': '',
				'predictScoreColumnName': '',
				'spark.driver.cores': '1',
				'spark.driver.memory': '2',
				'spark.driver.maxResultSize': '2',
				'spark.executor.instances': '2',
				'spark.executor.cores': '2',
				'spark.executor.memory': '2',
				'spark.executor.extraJavaOptions': '-XX:MetaspaceSize=64m -XX:MaxMetaspaceSize=128m'
			},
			configList: [{
				tabName: '参数设置',
				config: [
					{ type: 'selectSchema', name: '标签列列名', configKey: 'label', schemaType: 'radio', exclusion: 'predictScoreColumnName' },
					{ type: 'selectSchema', name: '预测分数输出列列名', configKey: 'predictScoreColumnName', schemaType: 'radio', exclusion: 'label' },
				]
			}, {
				tabName: '执行调优',
				config: [
					{ type: 'int', name: 'driverCores-驱动器核数', configKey: 'spark.driver.cores', min: '1', max: '65535', step: '1' },
					{ type: 'int', name: 'driverMemory-驱动器内存', configKey: 'spark.driver.memory', company: 'G' },
					{ type: 'int', name: 'driverMaxResultSize-驱动器最大结果大小', configKey: 'spark.driver.maxResultSize', company: 'G' },
					{ type: 'int', name: 'executorInstances-执行器个数', configKey: 'spark.executor.instances' },
					{ type: 'int', name: 'executorCores-执行器核数', configKey: 'spark.executor.cores', min: '1', max: '65535', step: '1' },
					{ type: 'int', name: 'executorMemory-执行器内存', configKey: 'spark.executor.memory', company: 'G' },
					{ type: 'textarea', name: 'extraJavaOptions-JVM配置', configKey: 'spark.executor.extraJavaOptions' }
				]
			}]
		},
		SplitNode: {
			nodeName: '拆分',
			className: 'cn.com.bsfit.sl.workflow.service.node.SplitNode',
			inputPortDes: ['拆分的输入'],
			outputPortDes: ['拆分的输出1', '拆分的输出2'],
			inputScope: [{ dataType: '2', format: '0' }],
			outputScope: [{ dataType: '2', format: '0' }, { dataType: '2', format: '0' }],
			dataType: '2',
			format: '0',
			config: {
				'executionMethod': '0',
				'threshold': '',
				'splitRate': '',
				'seed': '0',
				'thresholdColumnName': '',
				'spark.driver.cores': '1',
				'spark.driver.memory': '2',
				'spark.driver.maxResultSize': '2',
				'spark.executor.instances': '2',
				'spark.executor.cores': '2',
				'spark.executor.memory': '2',
				'spark.executor.extraJavaOptions': '-XX:MetaspaceSize=64m -XX:MaxMetaspaceSize=128m'
			},
			configList: [{
				tabName: '参数设置',
				config: [
					{ type: 'inputRadio', name: '随机拆分', configKey: 'executionMethod', radioName: 'SplitNode', check: '0' },
					{ type: 'int', name: '拆分比率', configKey: 'splitRate', company: '%', min: '1', max: '100', availableKey: 'executionMethod', availableValue: '0', inputDes: '左端输出数据与原数据的占比' },
					{ type: 'int', name: '随机数种子', configKey: 'seed', availableKey: 'executionMethod', availableValue: '0', min: '0' },
					{ type: 'inputRadio', name: '阈值拆分', configKey: 'executionMethod', radioName: 'SplitNode', check: '1' },
					{ type: 'selectSchema', name: '阈值列', configKey: 'thresholdColumnName', schemaType: 'radio', availableKey: 'executionMethod', availableValue: '1' },
					{ type: 'int', name: '阈值', configKey: 'threshold', availableKey: 'executionMethod', availableValue: '1', inputDes: '左端输出小于等于该阈值的数据' }
				]
			}, {
				tabName: '执行调优',
				config: [
					{ type: 'int', name: 'driverCores-驱动器核数', configKey: 'spark.driver.cores', min: '1', max: '65535', step: '1' },
					{ type: 'int', name: 'driverMemory-驱动器内存', configKey: 'spark.driver.memory', company: 'G' },
					{ type: 'int', name: 'driverMaxResultSize-驱动器最大结果大小', configKey: 'spark.driver.maxResultSize', company: 'G' },
					{ type: 'int', name: 'executorInstances-执行器个数', configKey: 'spark.executor.instances' },
					{ type: 'int', name: 'executorCores-执行器核数', configKey: 'spark.executor.cores', min: '1', max: '65535', step: '1' },
					{ type: 'int', name: 'executorMemory-执行器内存', configKey: 'spark.executor.memory', company: 'G' },
					{ type: 'textarea', name: 'extraJavaOptions-JVM配置', configKey: 'spark.executor.extraJavaOptions' }
				]
			}]
		},
		MultilayerSample: {
			nodeName: '分层抽样',
			className: 'cn.com.bsfit.sl.workflow.service.node.MultilayerSampleNode',
			inputPortDes: ['分层抽样的输入'],
			outputPortDes: ['分层抽样的输出'],
			inputScope: [{ dataType: '2', format: '0' }],
			outputScope: [{ dataType: '2', format: '0' }],
			dataType: '2',
			format: '0',
			config: {
				'executionMethod': '0',
				'featureColumnName': '',
				'sampleSize': '',
				'seed': '0',
				'sampleExample': '',
				'spark.driver.cores': '1',
				'spark.driver.memory': '2',
				'spark.driver.maxResultSize': '2',
				'spark.executor.instances': '2',
				'spark.executor.cores': '2',
				'spark.executor.memory': '2',
				'spark.executor.extraJavaOptions': '-XX:MetaspaceSize=64m -XX:MaxMetaspaceSize=128m'
			},
			configList: [{
				tabName: '字段设置',
				config: [{ type: 'selectSchema', name: '分组列', configKey: 'featureColumnName', schemaType: 'radio', inputDes: '根据此列进行层级划分' }]
			}, {
				tabName: '参数设置',
				config: [
					{ type: 'inputRadio', name: '抽样总数', configKey: 'executionMethod', radioName: 'MultilayerSample', check: '0' },
					{ type: 'int', name: '', configKey: 'sampleSize', availableKey: 'executionMethod', availableValue: '0', inputDes: '输出的数据总量' },
					{ type: 'inputRadio', name: '抽样比率', configKey: 'executionMethod', radioName: 'MultilayerSample', check: '1' },
					{ type: 'int', name: '', configKey: 'sampleFraction', min: '1', max: '100', step: '1', company: '%', availableKey: 'executionMethod', availableValue: '1', inputDes: '对各层数据进行抽样的占比' },
					{ type: 'inputRadio', name: '自定义抽样', configKey: 'executionMethod', radioName: 'MultilayerSample', check: '2' },
					{ type: 'input', name: '', configKey: 'sampleExample', availableKey: 'executionMethod', availableValue: '2', inputDes: '格式为A:30,B:15,表示A抽取30个,B抽取15个' },
					{ type: 'int', name: '随机数种子', configKey: 'seed', min: '0' }
				]
			}, {
				tabName: '执行调优',
				config: [
					{ type: 'int', name: 'driverCores-驱动器核数', configKey: 'spark.driver.cores', min: '1', max: '65535', step: '1' },
					{ type: 'int', name: 'driverMemory-驱动器内存', configKey: 'spark.driver.memory', company: 'G' },
					{ type: 'int', name: 'driverMaxResultSize-驱动器最大结果大小', configKey: 'spark.driver.maxResultSize', company: 'G' },
					{ type: 'int', name: 'executorInstances-执行器个数', configKey: 'spark.executor.instances' },
					{ type: 'int', name: 'executorCores-执行器核数', configKey: 'spark.executor.cores', min: '1', max: '65535', step: '1' },
					{ type: 'int', name: 'executorMemory-执行器内存', configKey: 'spark.executor.memory', company: 'G' },
					{ type: 'textarea', name: 'extraJavaOptions-JVM配置', configKey: 'spark.executor.extraJavaOptions' }
				]
			}]
		},
		RandomSample: {
			nodeName: '随机抽样',
			className: 'cn.com.bsfit.sl.workflow.service.node.RandomSampleNode',
			inputPortDes: ['随机抽样的输入'],
			outputPortDes: ['随机抽样的输出'],
			inputScope: [{ dataType: '2', format: '0' }],
			outputScope: [{ dataType: '2', format: '0' }],
			dataType: '2',
			format: '0',
			config: {
				'isReplacement': false,
				'executionMethod': '0',
				'sampleSize': '',
				'sampleFraction': '',
				'seed': '0',
				'spark.driver.cores': '1',
				'spark.driver.memory': '2',
				'spark.driver.maxResultSize': '2',
				'spark.executor.instances': '2',
				'spark.executor.cores': '2',
				'spark.executor.memory': '2',
				'spark.executor.extraJavaOptions': '-XX:MetaspaceSize=64m -XX:MaxMetaspaceSize=128m'
			},
			configList: [{
				tabName: '参数设置',
				config: [
					{ type: 'inputRadio', name: '抽样总数', configKey: 'executionMethod', radioName: 'RandomSample', check: '0' },
					{ type: 'int', name: '', configKey: 'sampleSize', availableKey: 'executionMethod', availableValue: '0', inputDes: '输出的数据总量' },
					{ type: 'inputRadio', name: '抽样比率', configKey: 'executionMethod', radioName: 'RandomSample', check: '1' },
					{ type: 'int', name: '', configKey: 'sampleFraction', min: '1', max: '100', step: '1', company: '%', availableKey: 'executionMethod', availableValue: '1', inputDes: '输出数据与原数据占比' },
					{ type: 'checkbox', name: '放回抽样', configKey: 'isReplacement', inputDes: '(勾选后抽样数据可能出现重复)' },
					{ type: 'int', name: '随机数种子', configKey: 'seed', min: '0' }
				]
			}, {
				tabName: '执行调优',
				config: [
					{ type: 'int', name: 'driverCores-驱动器核数', configKey: 'spark.driver.cores', min: '1', max: '65535', step: '1' },
					{ type: 'int', name: 'driverMemory-驱动器内存', configKey: 'spark.driver.memory', company: 'G' },
					{ type: 'int', name: 'driverMaxResultSize-驱动器最大结果大小', configKey: 'spark.driver.maxResultSize', company: 'G' },
					{ type: 'int', name: 'executorInstances-执行器个数', configKey: 'spark.executor.instances' },
					{ type: 'int', name: 'executorCores-执行器核数', configKey: 'spark.executor.cores', min: '1', max: '65535', step: '1' },
					{ type: 'int', name: 'executorMemory-执行器内存', configKey: 'spark.executor.memory', company: 'G' },
					{ type: 'textarea', name: 'extraJavaOptions-JVM配置', configKey: 'spark.executor.extraJavaOptions' }
				]
			}]
		},
		RFBinaryClassifierNode: {
			nodeName: '随机森林二分类',
			className: 'cn.com.bsfit.sl.workflow.service.node.RFBinaryClassifierNode',
			inputPortDes: ['随机森林的输入'],
			outputPortDes: ['随机森林的输出'],
			inputScope: [{ dataType: '2', format: '0' }],
			outputScope: [{ dataType: '1', format: '0' }],
			dataType: '1',
			format: '0',
			algoName: "随机森林",
		    algoCategory: 0,
			config: {
				'numTrees': '100',
				'featureSubsetStrategy': 'auto',
				'maxDepth': '5',
				'maxBins': '32',
				'impurity': 'gini',
				'seed': '0',
				'minInfoGain': '0',
				'subSamplingRate': '1',
				'minInstancesPerNode': '100',
				'labelColumnName': '',
				'featureColumnNames': [],
				'spark.driver.cores': '1',
				'spark.driver.memory': '2',
				'spark.driver.maxResultSize': '2',
				'spark.executor.instances': '2',
				'spark.executor.cores': '2',
				'spark.executor.memory': '2',
				'spark.executor.extraJavaOptions': '-XX:MetaspaceSize=64m -XX:MaxMetaspaceSize=128m'
			},
			configList: [{
				tabName: '字段设置',
				config: [
					{ type: 'selectSchema', name: '标签列列名', configKey: 'labelColumnName', schemaType: 'radio', exclusion: 'featureColumnNames' },
					{ type: 'selectSchema', name: '特征列列名', configKey: 'featureColumnNames', schemaType: 'checkbox', exclusion: 'labelColumnName' }
				]
			}, {
				tabName: '参数设置',
				config: [
					{ type: 'int', name: '树的棵数', configKey: 'numTrees' },
					{ type: 'input', name: '单棵树随机特征数', configKey: 'featureSubsetStrategy' },
					{ type: 'int', name: '每棵树随机样本比例', configKey: 'subSamplingRate' },
					{ type: 'int', name: '树的最大深度', configKey: 'maxDepth' },
					{ type: 'int', name: '最大分组数', configKey: 'maxBins', min: '2' },
					{ type: 'int', name: '叶节点最小样本数', configKey: 'minInstancesPerNode', min: '2' },
					{ type: 'select', name: '信息增益计算的准则', configKey: 'impurity', options: [{name: 'gini', value: 'gini'}, {name:'entropy', value: 'entropy'}] },
					{ type: 'input', name: '最小信息增益', configKey: 'minInfoGain' },
					{ type: 'input', name: '随机数种子', configKey: 'seed' }
				]
			}, {
				tabName: '执行调优',
				config: [
					{ type: 'int', name: 'driverCores-驱动器核数', configKey: 'spark.driver.cores', min: '1', max: '65535', step: '1' },
					{ type: 'int', name: 'driverMemory-驱动器内存', configKey: 'spark.driver.memory', company: 'G' },
					{ type: 'int', name: 'driverMaxResultSize-驱动器最大结果大小', configKey: 'spark.driver.maxResultSize', company: 'G' },
					{ type: 'int', name: 'executorInstances-执行器个数', configKey: 'spark.executor.instances' },
					{ type: 'int', name: 'executorCores-执行器核数', configKey: 'spark.executor.cores', min: '1', max: '65535', step: '1' },
					{ type: 'int', name: 'executorMemory-执行器内存', configKey: 'spark.executor.memory', company: 'G' },
					{ type: 'textarea', name: 'extraJavaOptions-JVM配置', configKey: 'spark.executor.extraJavaOptions' }
				]
			}]
		},
		LRBinaryClassifierNode: {
			nodeName: '逻辑回归二分类',
			className: 'cn.com.bsfit.sl.workflow.service.node.LRBinaryClassifierNode',
			inputPortDes: ['逻辑回归的输入'],
			outputPortDes: ['逻辑回归的输出'],
			inputScope: [{ dataType: '2', format: '0' }],
			outputScope: [{ dataType: '1', format: '0' }],
			dataType: '1',
			format: '0',
			algoName: "逻辑回归",
		    algoCategory: 0,
		    config: {
		    	'maxIter': '100',
		    	'tol': '0.000001',
		    	'labelColumnName': '',
		    	'featureColumnNames': [],
		    	'elasticNetParam': '',
		    	'regParam': '0',
		    	'standardization': true,
		    	'spark.driver.cores': '1',
				'spark.driver.memory': '2',
				'spark.driver.maxResultSize': '2',
				'spark.executor.instances': '2',
				'spark.executor.cores': '2',
				'spark.executor.memory': '2',
				'spark.executor.extraJavaOptions': '-XX:MetaspaceSize=64m -XX:MaxMetaspaceSize=128m'
		    },
		    configList: [{
				tabName: '字段设置',
				config: [
					{ type: 'selectSchema', name: '标签列列名', configKey: 'labelColumnName', schemaType: 'radio', exclusion: 'featureColumnNames' },
					{ type: 'selectSchema', name: '特征列列名', configKey: 'featureColumnNames', schemaType: 'checkbox', exclusion: 'labelColumnName' },
					{ type: 'checkbox', name: '启用标准化', configKey: 'standardization' }
				]
			}, {
				tabName: '参数设置',
				config: [
					{ type: 'int', name: '最大迭代次数', configKey: 'maxIter', min: '1', max: '65535' },
					{ type: 'input', name: '最小收敛误差', configKey: 'tol' },
					{ type: 'select', name: '正则项', configKey: 'elasticNetParam', options: [{name: 'none', value: ''}, {name: 'L1', value: '1'}, {name: 'L2', value: '0'}] },
					{ type: 'int', name: '正则系数', configKey: 'regParam' }
				]
			}, {
				tabName: '执行调优',
				config: [
					{ type: 'int', name: 'driverCores-驱动器核数', configKey: 'spark.driver.cores', min: '1', max: '65535', step: '1' },
					{ type: 'int', name: 'driverMemory-驱动器内存', configKey: 'spark.driver.memory', company: 'G' },
					{ type: 'int', name: 'driverMaxResultSize-驱动器最大结果大小', configKey: 'spark.driver.maxResultSize', company: 'G' },
					{ type: 'int', name: 'executorInstances-执行器个数', configKey: 'spark.executor.instances' },
					{ type: 'int', name: 'executorCores-执行器核数', configKey: 'spark.executor.cores', min: '1', max: '65535', step: '1' },
					{ type: 'int', name: 'executorMemory-执行器内存', configKey: 'spark.executor.memory', company: 'G' },
					{ type: 'textarea', name: 'extraJavaOptions-JVM配置', configKey: 'spark.executor.extraJavaOptions' }
				]
			}]
		}
	};

	statisticFuncList = [
		{ name: '和', value: 'sum' },
		{ name: '平均值', value: 'avg' },
		{ name: '最大值', value: 'max' },
		{ name: '最小值', value: 'min' },
		{ name: '标准差', value: 'vars' },
		{ name: '方差', value: 'varp' },
		{ name: '计数', value: 'count' },
		{ name: '3阶中心距', value: 'cenmon3' },
		{ name: '4阶中心距', value: 'cenmon4' },
		{ name: '最近一次值', value: 'replaced' },
		{ name: '第一次值', value: 'occupied' },
		{ name: '去重计数', value: 'distinctCount' },
		{ name: '列表', value: 'arrayList' },
		{ name: '递增次数', value: 'increaseCount' },
		{ name: '递减次数', value: 'decreaseCount' },
		{ name: '最大递增次数', value: 'maxIncreaseCount' },
		{ name: '最大递减次数', value: 'maxDecreaseCount' },
		{ name: '最大连续次数', value: 'maxContinuousCount' }
	];

	// codemirror config
	codemirrorOptions = {
		lineNumbers: true,
		mode: { name: "text/x-sql" },
		hintOptions: { tables: {} },
		extraKeys: {
			"'a'": this.completeAfter,
			"'b'": this.completeAfter,
			"'c'": this.completeAfter,
			"'d'": this.completeAfter,
			"'e'": this.completeAfter,
			"'f'": this.completeAfter,
			"'g'": this.completeAfter,
			"'h'": this.completeAfter,
			"'i'": this.completeAfter,
			"'j'": this.completeAfter,
			"'k'": this.completeAfter,
			"'l'": this.completeAfter,
			"'m'": this.completeAfter,
			"'n'": this.completeAfter,
			"'o'": this.completeAfter,
			"'p'": this.completeAfter,
			"'q'": this.completeAfter,
			"'r'": this.completeAfter,
			"'s'": this.completeAfter,
			"'t'": this.completeAfter,
			"'u'": this.completeAfter,
			"'v'": this.completeAfter,
			"'w'": this.completeAfter,
			"'x'": this.completeAfter,
			"'y'": this.completeAfter,
			"'z'": this.completeAfter,
			"'.'": this.completeAfter,
			"'A'": this.completeAfter,
			"'B'": this.completeAfter,
			"'C'": this.completeAfter,
			"'D'": this.completeAfter,
			"'E'": this.completeAfter,
			"'F'": this.completeAfter,
			"'G'": this.completeAfter,
			"'H'": this.completeAfter,
			"'I'": this.completeAfter,
			"'J'": this.completeAfter,
			"'K'": this.completeAfter,
			"'L'": this.completeAfter,
			"'M'": this.completeAfter,
			"'N'": this.completeAfter,
			"'O'": this.completeAfter,
			"'P'": this.completeAfter,
			"'Q'": this.completeAfter,
			"'R'": this.completeAfter,
			"'S'": this.completeAfter,
			"'T'": this.completeAfter,
			"'U'": this.completeAfter,
			"'V'": this.completeAfter,
			"'W'": this.completeAfter,
			"'X'": this.completeAfter,
			"'Y'": this.completeAfter,
			"'Z'": this.completeAfter,
			// "'='": this.completeIfInTag,
			"Ctrl-Q": "autocomplete",
			Tab: function(cm) {
				var spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
				cm.replaceSelection(spaces);
			}
		}

	};
	codemirrorReadOnly = {
		readOnly: true,
		lineNumbers: false,
		autoRefresh: true,
		mode: { name: 'text/x-sql' }
	};

	completeAfter(cm: any, pred: any) {
		var cur = cm.getCursor();
		cm.showHint({
			completeSingle: false
		});
		return CodeMirror.Pass;
	}

}
