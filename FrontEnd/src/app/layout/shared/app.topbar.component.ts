import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "../service/app.layout.service";
import { MessageService } from 'primeng/api';
@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent implements OnInit{

    items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;
    public existToken:boolean=false;
    constructor(public layoutService: LayoutService,private messageService:MessageService) { 
        
    }
    ngOnInit(): void {
        this.existToken=false;
        this.getToken();    
    }
    getToken(){
        console.log("getToken")
        console.log("valor de token",sessionStorage.getItem('token'))
        if(sessionStorage.getItem('token')!=null){
            this.existToken=true;
        }
        else{
            this.existToken=false;
        }
    }
    logout(){
        console.log("logout")
        if(sessionStorage.getItem('token')!=null){
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('role');
        this.existToken=false;
        this.toastMessage('success', 'Logout', 'You have been logged out');
        }
        else{
            this.toastMessage('error', 'Logout', 'You are not logged in');
        }
    }

    toastMessage(severity: string, summary: string, detail: string) {
        this.messageService.add({severity:severity, summary: summary, detail: detail});
    }
}
