import { Component, OnInit } from '@angular/core';
import { PlatformLocation} from '@angular/common';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
declare var jsPlumb: any;
declare var $: any;

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

	constructor(private location: PlatformLocation,
				private cookieService: CookieService,
				private router: Router
				) { }
	tabIndex: string = '0';
	isShowMenu: boolean = false;
	userName: string;
	authorities: any;

	changeTheMenu() {
		this.isShowMenu = !this.isShowMenu;
	}

	turnUrl(id:any) {

	}

	fetchUserName() {

	}

	logout() {

	}

	ngOnInit() {
		this.fetchUserName()
	}

	ngDoCheck() {

	}
}


