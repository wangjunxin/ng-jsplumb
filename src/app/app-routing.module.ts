import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { JsplumbDragComponent } from './components/jsplumb-drag/jsplumb-drag.component';
import { checkSaveGuard } from './components/jsplumb-drag/check-save.guard';


const routes: Routes = [
	{ path: 'drag/:id/:planId', component: JsplumbDragComponent, canDeactivate: [checkSaveGuard] },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
