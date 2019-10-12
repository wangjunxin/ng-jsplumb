import { Component, OnInit, Input, Output, ChangeDetectorRef, EventEmitter } from '@angular/core';

declare var $: any;

@Component({
    selector: 'app-context-menu',
    templateUrl: './context-menu.component.html',
    styleUrls: ['./context-menu.component.css']
})
export class ContextMenuComponent implements OnInit {

    constructor(public changeDetectorRef: ChangeDetectorRef) { }
    @Input() position: any;
    @Input() contextMenuList: any;
    @Output() clickContextItem = new EventEmitter<number>();
    showContext: boolean = false;

    showContextMenu() {
        this.showContext = true
    }

    cilckTheItem(item: any) {
        if (!item.disabled) {
            this.clickContextItem.emit(item)
        }
    }

    ngOnInit() {
        var gloabl = this;
        $(document).bind('click', '.full-windows', function() {
            gloabl.showContext = false
            gloabl.changeDetectorRef.markForCheck();
            if (!gloabl.changeDetectorRef['destroyed']) {
                gloabl.changeDetectorRef.detectChanges();
            }
        })
    }

}
