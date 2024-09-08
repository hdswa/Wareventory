import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
// import { Product } from '../../api/product';
// import { ProductService } from '../../service/product.service';
import { Subscription, debounceTime } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

import { WareVentoryUseCase } from 'src/app/features/application/wareventory.usecase';
import { TranslateService } from '@ngx-translate/core';
@Component({
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {

    ngOnInit(): void {
        this.initVariables()
    }

    constructor(private wareventoryUC:WareVentoryUseCase,private translate: TranslateService) {
        console.log("lengauage",sessionStorage.getItem("language"))
        this.translate.use(sessionStorage.getItem("language"))
        
    }
    

    public totalItems:number = 0;
    public totalUsers:number = 0;
    public totalLocations:number = 0;
    public totalPendingRequests:number = 0;
    public logs=[]
    initVariables(){
        this.getObjectsNumber()
        this.getUsersNumber()
        this.getLocationsNumber()
        this.getPendingRequestsNumber()
        this.getLogs()
    }


    getObjectsNumber(){
        this.wareventoryUC.getStats({"action":"totalObjects"}).subscribe(
            (data) => {
                this.totalItems = data.quantity
            },
            (error) => {
                console.log(error);
            }
          );
    }

    getUsersNumber(){
        this.wareventoryUC.getStats({"action":"totalUsers"}).subscribe(
            (data) => {
                this.totalUsers = data.quantity
                console.log(data)
            },
            (error) => {
                console.log(error);
            }
          );
    }
    getLocationsNumber(){
        this.wareventoryUC.getStats({"action":"totalLocations"}).subscribe(
            (data) => {
                this.totalLocations = data.quantity
            },
            (error) => {
                console.log(error);
            }
          );
    }
    getPendingRequestsNumber(){ 
        this.wareventoryUC.getStats({"action":"pendingRequests"}).subscribe(
            (data) => {
                this.totalPendingRequests = data.quantity
            },
            (error) => {
                console.log(error);
            }
          );
    }

    getLogs(){
        this.wareventoryUC.getLog(15,"all").subscribe(
            (data) => {
                this.logs = data
                console.log(data)
            },
            (error) => {
                console.log(error);
            }
          );
    }


   
}
