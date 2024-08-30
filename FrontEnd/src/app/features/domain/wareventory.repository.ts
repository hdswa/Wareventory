

import { Observable } from 'rxjs';
import { LoginResponse } from './wareventory.model';
export abstract class WareventoryRepository {
    abstract postLogin(params:any): Observable<LoginResponse>;
    abstract getJobs(params:any): Observable<any>;
    abstract getJobPackages(params:any): Observable<any>;
    abstract getLocationItems(params:any): Observable<any>;
    abstract getSKUlocations(params:any): Observable<any>;

    abstract getLog(limit:number,action:string): Observable<any>;
    abstract getJobCodesByPG(params:any): Observable<any>;
    abstract getJobPackagesByJobIdandPG(params:any): Observable<any>;


    abstract postReception(params:any): Observable<any>;
    abstract getReceptionBascketBySKU(params:any): Observable<any>;
    abstract postPlacement(params:any): Observable<any>;
    abstract postTransfer(params:any): Observable<any>;

    abstract getPicking(params:any): Observable<any>;
    abstract postPicking(param:any): Observable<any>;
}