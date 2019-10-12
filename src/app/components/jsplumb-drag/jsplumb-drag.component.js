import { Component, ChangeDetectorRef } from '@angular/core';
var JsplumbDragComponent = /** @class */ (function () {
    function JsplumbDragComponent(changeDetectorRef) {
        this.changeDetectorRef = changeDetectorRef;
        this.example3Color = "#316b31";
        this.connectorPaintStyle = {
            strokeWidth: 2,
            stroke: "#ff894a",
            joinstyle: "round"
        };
        this.connectorHoverStyle = {
            strokeWidth: 3,
            stroke: "#ff894a",
            outlineWidth: 5,
            outlineStroke: "white"
        };
        this.endpointHoverStyle = {
            fill: "#ff894a",
            stroke: "#ff894a",
            zIndex: 200
        };
        this.exampleEndpoint2 = {
            endpoint: "Dot",
            paintStyle: {
                stroke: "#ff894a",
                fill: "transparent",
                radius: 5,
                strokeWidth: 1
            },
            isSource: true,
            connector: ["Bezier", { stub: [0, 0], gap: 10, cornerRadius: 5, alwaysRespectStubs: true }],
            connectorStyle: this.connectorPaintStyle,
            hoverPaintStyle: this.endpointHoverStyle,
            dragOptions: { zIndex: 2001 },
            overlays: [
                ["Label", {
                        location: [0.5, 1.5],
                        label: "Drag",
                        cssClass: "endpointSourceLabel",
                        visible: false
                    }]
            ]
        };
        this.exampleEndpoint = {
            endpoint: "Dot",
            paintStyle: { fill: "#ff894a", radius: 5 },
            hoverPaintStyle: this.endpointHoverStyle,
            maxConnections: -1,
            dropOptions: { hoverClass: "hover", activeClass: "active" },
            isTarget: true,
            overlays: [
                ["Label", { location: [0.5, 5.5], label: "Drop", cssClass: "endpointTargetLabel", visible: false }]
            ],
            onMaxConnections: function (info) {
                alert("Cannot drop connection " + info.connection.id + " : maxConnections has been reached on Endpoint " + info.endpoint.id);
            }
        };
        this.chartData = [
            { left: 100, top: 80, name: 'test1', id: 1, enterPointNum: 1, endPointNum: 3 },
            { left: 107, top: 90, name: 'test2', id: 2, enterPointNum: 2, endPointNum: 3 },
            { left: 80, top: 100, name: 'test3', id: 3, enterPointNum: 4, endPointNum: 3 },
            { left: 100, top: 320, name: 'test4', id: 4, enterPointNum: 1, endPointNum: 3 },
            { left: 150, top: 290, name: 'test5', id: 5, enterPointNum: 1, endPointNum: 3 }
        ];
        this.linkList = [
            { startpoint: 1, endpoint: 2 },
            { startpoint: 2, endpoint: 4 },
            { startpoint: 3, endpoint: 5 },
            { startpoint: 5, endpoint: 1 }
        ];
    }
    JsplumbDragComponent.prototype.newNode = function (name, left, top) {
        var id = this.chartData[this.chartData.length - 1].id + 1;
        this.chartData.push({ left: left, top: top, name: name, id: id });
        this.changeDetectorRef.markForCheck();
        this.changeDetectorRef.detectChanges();
        this.instance.addEndpoint("test" + id, { anchor: [0.25, 0, -1, 0], uuid: id + "-top" }, this.exampleEndpoint);
        this.instance.addEndpoint("test" + id, { anchor: [0.5, 0, -1, 0], uuid: id + "-top" }, this.exampleEndpoint);
        this.instance.addEndpoint("test" + id, { anchor: [0.75, 0, -1, 0], uuid: id + "-top" }, this.exampleEndpoint);
        this.instance.addEndpoint("test" + id, { anchor: "Bottom", uuid: id + "-bottom" }, this.exampleEndpoint2);
        this.instance.draggable(jsPlumb.getSelector("#test" + id));
    };
    JsplumbDragComponent.prototype.initNode = function () {
        for (var i = 0; i < this.chartData.length; i++) {
            this.instance.addEndpoint("test" + this.chartData[i].id, { anchor: "Top", uuid: this.chartData[i].id + "-top" }, this.exampleEndpoint);
            this.instance.addEndpoint("test" + this.chartData[i].id, { anchor: "Bottom", uuid: this.chartData[i].id + "-bottom" }, this.exampleEndpoint2);
        }
        this.initConnection();
    };
    JsplumbDragComponent.prototype.clickTheNode = function (item) {
        console.log(item);
    };
    JsplumbDragComponent.prototype.initConnection = function () {
        var _this = this;
        this.linkList.forEach(function (item) {
            _this.instance.connect({ uuids: [item.startpoint + "-bottom", item.endpoint + "-top"] });
        });
    };
    JsplumbDragComponent.prototype.ngOnInit = function () {
        var global = this;
        jsPlumb.ready(function () {
            global.instance = jsPlumb.getInstance({
                Connector: "Bezier",
                ConnectionOverlays: [
                    ["Arrow", {
                            location: 1,
                            visible: true,
                            width: 11,
                            length: 11,
                            id: "ARROW",
                            events: {
                                click: function () {
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
                                click: function () { }
                            }
                        }]
                ],
                Container: "canvas"
            });
            global.instance.batch(function () {
                global.instance.bind("connection", function (info, originalEvent) {
                    console.log(info, originalEvent);
                });
                global.instance.bind("connectionDetached", function (info, originalEvent) {
                    console.log(info, originalEvent);
                });
                global.instance.bind("connectionMoved", function (info, originalEvent) {
                    console.log(info, originalEvent);
                });
                global.instance.bind("click", function (info, originalEvent) {
                    alert("click!");
                });
                global.initNode();
                global.instance.draggable(jsPlumb.getSelector(".flowchart-demo .window"));
            });
            jsPlumb.fire("jsPlumbDemoLoaded", global.instance);
        });
    };
    JsplumbDragComponent.prototype.ngAfterViewInit = function () {
        var gloabl = this;
        $(".newNodeId").draggable({
            helper: function (event) {
                console.log(event.currentTarget.innerHTML);
                return $("<div class='add-item'>" + event.currentTarget.innerHTML + "</div>");
            },
            stop: function (event, ui) {
                gloabl.newNode(event.target.innerHTML, parseInt(ui.offset.left), parseInt(ui.offset.top));
            }
        });
    };
    JsplumbDragComponent.decorators = [
        { type: Component, args: [{
                    selector: 'app-jsplumb-drag',
                    templateUrl: './jsplumb-drag.component.html',
                    styleUrls: ['./jsplumb-drag.component.css']
                },] },
    ];
    /** @nocollapse */
    JsplumbDragComponent.ctorParameters = function () { return [
        { type: ChangeDetectorRef }
    ]; };
    return JsplumbDragComponent;
}());
export { JsplumbDragComponent };
//# sourceMappingURL=jsplumb-drag.component.js.map