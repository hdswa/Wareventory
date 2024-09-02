import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from '../service/app.layout.service';
import { WareVentoryUseCase } from 'src/app/features/application/wareventory.usecase';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService,private wareventoryUC:WareVentoryUseCase) { }

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
                    { label: 'Inventario', icon: 'pi pi-fw pi-th-large', routerLink: ['/content/jobs'] },
                    { label: 'Ubicacion', icon: 'pi pi-fw pi-map-marker', routerLink: ['/content/location'] },
                    { label: 'Recibir', icon: 'pi pi-fw pi-download', routerLink: ['/action/reception'] },
                    { label: 'Ubicar', icon: 'pi pi-fw pi-box', routerLink: ['/action/placement'] },
                    { label: 'Transferir', icon: 'pi pi-fw pi-sort-alt', routerLink: ['/action/transfer'] },
                    { label: 'Picking', icon: 'pi pi-fw pi-shopping-cart', routerLink: ['/action/picking'] },
                    { label: 'Shipping', icon: 'pi pi-fw pi-truck',routerLink:['/action/shipping']},
                   
                ]
            },
            
        ];
       
        
        if(sessionStorage.getItem('role')=='admin'){
            this.model.push({
                label: 'Admin',
                items: [
                    { label: 'Registrar', icon: 'pi pi-fw pi-user-plus', routerLink: ['/admin/register'] },
                    { label: 'Eliminar Usuario', icon: 'pi pi-fw pi-user-minus', routerLink: ['/admin/delete-user'] },
                    { label: 'Eliminar Trabajo', icon: 'pi pi-fw pi-minus-circle', routerLink: ['/admin/delete-job'] }
                ]
            });
        }
            
        
    }
}
