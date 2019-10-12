import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule
} from '@angular/material';
import { NgxEchartsModule } from 'ngx-echarts';
import { CookieService } from 'ngx-cookie-service';
import { OverlayContainer, FullscreenOverlayContainer } from '@angular/cdk/overlay';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { DagConfigService } from "./services/dag-config.service";

import { JsplumbDragComponent, nodeRenameDialog, NodeInstanceLogDialog, exportProjectTableDialog } from './components/jsplumb-drag/jsplumb-drag.component';
import { ContextMenuComponent } from './components/context-menu/context-menu.component';
import { NodeListComponent } from './components/node-list/node-list.component';
import { NodeConfigComponent, SqlEditDialog, featureEditDialog, SelectSchemaDialog} from './components/node-config/node-config.component';

import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { checkSaveGuard } from './components/jsplumb-drag/check-save.guard';
import { SubMenuComponent } from './components/sub-menu/sub-menu.component';
import { CodemirrorNgxComponent } from './components/codemirror-ngx/codemirror-ngx.component';

@NgModule({
    declarations: [
        AppComponent,
        JsplumbDragComponent,
        ContextMenuComponent,
        NodeListComponent,
        NodeConfigComponent,
        nodeRenameDialog,
        featureEditDialog,
        SelectSchemaDialog,
        NodeInstanceLogDialog,
        exportProjectTableDialog,
        SubMenuComponent,
        CodemirrorNgxComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule,
        CodemirrorModule,
        ReactiveFormsModule,
        NgxEchartsModule,
        MatAutocompleteModule,
        MatBadgeModule,
        MatBottomSheetModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatCardModule,
        MatCheckboxModule,
        MatChipsModule,
        MatDatepickerModule,
        MatDialogModule,
        MatDividerModule,
        MatExpansionModule,
        MatGridListModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatNativeDateModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        MatRippleModule,
        MatSelectModule,
        MatSidenavModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatSortModule,
        MatStepperModule,
        MatTableModule,
        MatTabsModule,
        MatToolbarModule,
        MatTooltipModule,
        MatTreeModule
    ],
    providers: [
        DagConfigService,
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        { provide: OverlayContainer, useClass: FullscreenOverlayContainer}
    ],
    entryComponents: [
        NodeConfigComponent,
        nodeRenameDialog,
        featureEditDialog,
        SelectSchemaDialog,
        NodeInstanceLogDialog,
        exportProjectTableDialog],
    bootstrap: [AppComponent]
})
export class AppModule { }
