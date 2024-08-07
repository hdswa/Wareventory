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
}