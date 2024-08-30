import { Injectable } from "@angular/core";
import { WareventoryRepository } from "../domain/wareventory.repository";
import { HttpClient } from "@angular/common/http";
import { EMPTY, Observable } from "rxjs";


@Injectable({
    providedIn: 'root',
})
export class WareventoryImplRepository extends WareventoryRepository {
  

    constructor(private http: HttpClient) {
        super();
    }

    getJobs(params: any): any {
        // console.log(params);
        return this.http.get('http://localhost:5000/jobs',{params});
    }

    getJobPackages(params: any): any {
        // console.log(params);
        return this.http.get('http://localhost:5000/packages',{params});
    }

    getLocationItems(params: any): any {
        // console.log(params);
        return this.http.get('http://localhost:5000/location',{params});
    }
    
    getSKUlocations(params: any): any {
        return this.http.get('http://localhost:5000/itemSKU',{params});
    }
    getLog(limit: number, action: string): any {
        return this.http.get('http://localhost:5000/log',{params: {limit, action}});
    }
    getJobCodesByPG(params: any): any {
        return this.http.get('http://localhost:5000/jobs',{params});
    }

    getJobPackagesByJobIdandPG(params: any): any {
        return this.http.get('http://localhost:5000/packages',{params});
    }

    postReception(params: any): any {
        return this.http.post('http://localhost:5000/reception', params);
    }

    getReceptionBascketBySKU(params: any): any {
        console.log("valor de params:",params)
        return this.http.get('http://localhost:5000/reception_bascket',{params});
    }
    postPlacement(params: any): any {
        return this.http.post('http://localhost:5000/placement', params);
    }

    postTransfer(params: any): any {
        return this.http.post('http://localhost:5000/transfer', params);
    }

    postLogin(params: any): any {
        // console.log(this.http.post('http://localhost:5000/login', params).subscribe( data => { console.log(data); }));
        console.log(params)
        return this.http.post('http://localhost:5000/login', params);
    }

    getPicking(params: any): any {
        return this.http.get('http://localhost:5000/picking',{params});
    }

    override postPicking(param: any): Observable<any> {
        return this.http.post('http://localhost:5000/picking', param);
    }
}
