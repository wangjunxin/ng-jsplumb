import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JsplumbDragComponent } from './components/jsplumb-drag/jsplumb-drag.component';
var routes = [
    { path: '', redirectTo: 'drag', pathMatch: 'full' },
    { path: 'drag', component: JsplumbDragComponent }
];
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule.decorators = [
        { type: NgModule, args: [{
                    imports: [RouterModule.forRoot(routes)],
                    exports: [RouterModule]
                },] },
    ];
    return AppRoutingModule;
}());
export { AppRoutingModule };
//# sourceMappingURL=app-routing.module.js.map