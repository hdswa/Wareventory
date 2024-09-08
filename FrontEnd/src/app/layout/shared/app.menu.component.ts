import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from '../service/app.layout.service';
import { WareVentoryUseCase } from 'src/app/features/application/wareventory.usecase';
import { WareventoryTranslateService } from '../service/translate.service';
import { TranslateService } from '@ngx-translate/core';


const TRANSLATIONS=[
    'MENU.MENU',
    'MENU.DASHBOARD',
    'MENU.INVENTORY',
    'MENU.LOCATION',
    'MENU.RECEIVE',
    'MENU.PLACE',
    'MENU.TRANSFER',
    'MENU.PICKING',
    'MENU.SHIPPING',
    'MENU.NEW_USER',
    'MENU.NEW_JOB',
    'MENU.DELETE_USER',
    'MENU.ADMIN_JOB',
    'MENU.ADMIN_SHIPPING',
    'MENU.ADMIN_LOCATION',
]

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})


export class AppMenuComponent implements OnInit {

    model: any[] = [];
    private translations:{[key:string]:string}={};

   
    constructor(public layoutService: LayoutService,
                private WVtranslate:WareventoryTranslateService,
                private translateService:TranslateService,) { 
                    this.initTranslations();
    }

    async ngOnInit() {
        await this.initTranslations();
        this.model = [
            {
                label: this.translations["MENU.MENU"],
                items: [
                    { label: this.translations["MENU.DASHBOARD"], icon: 'pi pi-fw pi-home', routerLink: ['/'] },
                    { label: this.translations["MENU.INVENTORY"], icon: 'pi pi-fw pi-th-large', routerLink: ['/content/jobs'] },
                    { label: this.translations["MENU.LOCATION"], icon: 'pi pi-fw pi-map-marker', routerLink: ['/content/location'] },
                    { label: this.translations["MENU.RECEIVE"], icon: 'pi pi-fw pi-download', routerLink: ['/action/reception'] },
                    { label: this.translations["MENU.PLACE"], icon: 'pi pi-fw pi-box', routerLink: ['/action/placement'] },
                    { label: this.translations["MENU.TRANSFER"], icon: 'pi pi-fw pi-sort-alt', routerLink: ['/action/transfer'] },
                    { label: this.translations["MENU.PICKING"], icon: 'pi pi-fw pi-shopping-cart', routerLink: ['/action/picking'] },
                    { label: this.translations["MENU.SHIPPING"], icon: 'pi pi-fw pi-truck',routerLink:['/action/shipping']},
                   
                ]
            },
            
        ];
        if(sessionStorage.getItem('role')=='admin'){
            this.model.push({
                label: 'Admin',
                items: [
                    { label: this.translations["MENU.NEW_USER"], icon: 'pi pi-fw pi-user-plus', routerLink: ['/admin/register'] },
                    { label: this.translations["MENU.DELETE_USER"], icon: 'pi pi-fw pi-user-minus', routerLink: ['/admin/delete-user'] },
                    { label: this.translations["MENU.NEW_JOB"], icon: 'pi pi-fw pi-plus-circle', routerLink: ['/admin/new-job'] },
                    { label: this.translations["MENU.ADMIN_JOB"], icon: 'pi pi-fw pi-minus-circle', routerLink: ['/admin/delete-job'] },
                    { label: this.translations["MENU.ADMIN_SHIPPING"], icon: 'pi pi-fw pi-minus-circle', routerLink: ['/admin/admin-shipping-list'] },
                    { label: this.translations["MENU.ADMIN_LOCATION"], icon: 'pi pi-fw pi-minus-circle', routerLink: ['/admin/admin-location'] }
                ]
            });
        }
            
        
    }

    initTranslations():Promise<void>{
        return new Promise((resolve,reject)=>{
            
            this.translateService.get(TRANSLATIONS).subscribe(translations => {
                this.translations = translations;
                resolve();
            },
            error=>{
                reject(error);
            });
        });
    }
}
