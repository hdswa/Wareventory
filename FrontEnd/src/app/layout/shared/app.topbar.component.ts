import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "../service/app.layout.service";
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
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
    constructor(public layoutService: LayoutService,private messageService:MessageService,private translateService:TranslateService) { 
        
    }
    public dropdownVisible: boolean = false;
    public languages: any[] = [
        { label: 'English', value: 'en' },
        { label: 'Español', value: 'es' },
        { label: 'Deutsch', value: 'de' },
        { label: '中文', value:'zh-cn'},

    ];
    public selectedLanguage:string;
    ngOnInit(): void {
        this.existToken=false;
        this.getToken();    
        if (sessionStorage.getItem('language') == null) {
            sessionStorage.setItem('language', 'es');
            this.translateService.use(sessionStorage.getItem('language'));
        }
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

    changeLanguage(language: string) {
        // this.translateService.useLanguage(language);
        sessionStorage.setItem('language',language);
        console.log("valor de language",language)
        this.translateService.use(language);
        window.location.reload();
        console.log("valor de language",language)
    }

    
    toggleDropdown() {
        this.dropdownVisible = !this.dropdownVisible;
    }
}
