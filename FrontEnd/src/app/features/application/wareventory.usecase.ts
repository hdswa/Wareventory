import { Observable } from "rxjs";
import { WareventoryRepository } from "../domain/wareventory.repository";
import { UseCase } from "./usecase";

export class WareVentoryUseCase implements UseCase<any, any> {
    constructor(private repository: WareventoryRepository) { }
    executeLogin(params: any): any {
        return this.repository.postLogin(params);
    }

    getJobs(params: any): any {
        return this.repository.getJobs(params);
    }

    getJobPackages(params: any): any {
        return this.repository.getJobPackages(params);
    }
    getLocationItems(params: any): Observable<any> {
        return this.repository.getLocationItems(params);
    }
    getSKUlocations(params: any): Observable<any> {
        return this.repository.getSKUlocations(params);
    }
    getLog(limit: number, action: string): Observable<any> {
        return this.repository.getLog(limit, action);
    }
    getJobCodesByPG(params: any): Observable<any> {
        return this.repository.getJobCodesByPG(params);
    }
    getJobPackagesByJobIdandPG(params: any): Observable<any> {
        return this.repository.getJobPackagesByJobIdandPG(params);
    }


    postReception(params: any): Observable<any> {
        return this.repository.postReception(params);
    }

    getReceptionBascketBySKU(params: any): Observable<any> {
        return this.repository.getReceptionBascketBySKU(params);
    }
    postPlacement(params: any): Observable<any> {
        return this.repository.postPlacement(params);
    }

    postTransfer(params: any): Observable<any> {
        return this.repository.postTransfer(params);
    }

    getPicking(params: any): Observable<any> {
        return this.repository.getPicking(params);
    }

    postPicking(param:any):Observable<any>{
        return this.repository.postPicking(param);
    }

    getShipping(param:any):Observable<any>{
        return this.repository.getShipping(param);
    }
    postShipping(param:any):Observable<any>{
        return this.repository.postShipping(param);
    }

    getStats(params:any):Observable<any>{
        return this.repository.getStats(params);
    }

    postRegister(params:any):Observable<any>{
        return this.repository.postRegister(params);
    }

    getUsers():Observable<any>{
        return this.repository.getUsers();
    }

    deleteUser(code: any): Observable<any> {
        return this.repository.deleteUser(code);
    }


    deleteJob(code: any): Observable<any> {
        return this.repository.deleteJob(code);
    }

    closeJob(code: any): Observable<any> {
        return this.repository.closeJob(code);
    }
    
    
}