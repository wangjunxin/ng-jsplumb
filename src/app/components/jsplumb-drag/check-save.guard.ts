import { CanDeactivate } from "@angular/router";
import { JsplumbDragComponent } from "./jsplumb-drag.component";

export class checkSaveGuard implements CanDeactivate<JsplumbDragComponent>{
    canDeactivate(component: JsplumbDragComponent){
    	if (component.dagSaveSign) {
	    	component && component.instance && component.instance.deleteEveryEndpoint();
    		return true;
    	} else {
    		var comfirm = window.confirm('你还没有保存，确定要离开吗？');
    		if (comfirm) {
    			component && component.instance && component.instance.deleteEveryEndpoint();
    		}
	    	return comfirm;
    	}
    }
}