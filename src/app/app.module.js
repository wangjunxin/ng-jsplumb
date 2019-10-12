import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCheckboxModule } from '@angular/material';
import { AppComponent } from './app.component';
import { JsplumbDragComponent } from './components/jsplumb-drag/jsplumb-drag.component';
import { AppRoutingModule } from './/app-routing.module';
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [
                        AppComponent,
                        JsplumbDragComponent
                    ],
                    imports: [
                        BrowserModule,
                        BrowserAnimationsModule,
                        MatButtonModule,
                        MatCheckboxModule,
                        AppRoutingModule
                    ],
                    providers: [],
                    bootstrap: [AppComponent]
                },] },
    ];
    return AppModule;
}());
export { AppModule };
//# sourceMappingURL=app.module.js.map