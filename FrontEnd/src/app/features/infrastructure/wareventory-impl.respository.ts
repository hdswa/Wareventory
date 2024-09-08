import { Injectable } from "@angular/core";
import { WareventoryRepository } from "../domain/wareventory.repository";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { EMPTY, Observable } from "rxjs";


@Injectable({
    providedIn: 'root',
})
export class WareventoryImplRepository extends WareventoryRepository {
  
    headers:any;
    apiUrl:string='http://localhost:5000';
    constructor(private http: HttpClient) {
        super();
    }

    getJobs(params: any): any {
        console.log("valor de params", params);
        const token = sessionStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        const options = {
            headers: headers,
            params:params
        };
        return this.http.get(this.apiUrl+'/jobs',options);
    }

    getJobPackages(params: any): any {
        const token = sessionStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        const options = {
            headers: headers,
            params:params
        };
        return this.http.get(this.apiUrl+'/packages',options);
    }

    getLocationItems(params: any): any {
        
        const token = sessionStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        const options = {
            headers: headers,
            params:params
        };
        return this.http.get(this.apiUrl+'/location',options);
    }


    
    getSKUlocations(params: any): any {
        const token = sessionStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        const options = {
            headers: headers,
            params:params
        };
        return this.http.get(this.apiUrl+'/itemSKU',options);
    }
    getLog(limit: number, action: string): any {
        const token = sessionStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        const options = {
            headers: headers,
            params: { limit, action }
        };
        console.log(options)
        return this.http.get(this.apiUrl+'//log', options);
    }
    getJobCodesByPG(params: any): any {
        const token = sessionStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        const options = {
            headers: headers,
            params: params 
        };
        console.log(options)
        return this.http.get(this.apiUrl+'/jobs',options);
    }

    getJobPackagesByJobIdandPG(params: any): any {
        const token = sessionStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        const options = {
            headers: headers,
            params:params
        };
        return this.http.get(this.apiUrl+'/packages',options);
    }

    postReception(params: any): any {
        const token = sessionStorage.getItem('token');

        if (!token) {
            console.error('No token found in sessionStorage');
            return;
        }
    
        console.log("valor de token", token);
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        const options = {
            headers: headers,
        };
    
        console.log("valor de options", options);
        return this.http.post(this.apiUrl+'/reception', params, { headers });   
        
    }

    getReceptionBascketBySKU(params: any): any {
        const token = sessionStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        const options = {
            headers: headers,
            params:params
        };
        return this.http.get(this.apiUrl+'/reception_bascket',options);
    }
    postPlacement(params: any): any {
        const token = sessionStorage.getItem('token');
        
        if (!token) {
            console.error('No token found in sessionStorage');
            return;
        }
    
        console.log("valor de token", token);
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        const options = {
            headers: headers
        };
    
        console.log("valor de options", options);
        return this.http.post(this.apiUrl+'/placement', params, options);
    }

    postTransfer(params: any): any {
        const token = sessionStorage.getItem('token');
        
        if (!token) {
            console.error('No token found in sessionStorage');
            return;
        }
    
        console.log("valor de token", token);
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        const options = {
            headers: headers
        };
    
        return this.http.post(this.apiUrl+'/transfer', params,options);
    }

    postLogin(params: any): any {
       
        return this.http.post(this.apiUrl+'/login', params);
    }

    getPicking(params: any): any {
        const token = sessionStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        const options = {
            headers: headers,
            params:params
        };
        return this.http.get(this.apiUrl+'/picking',options);
    }

    postPicking(params: any): any {
        const token = sessionStorage.getItem('token');
        
        if (!token) {
            console.error('No token found in sessionStorage');
            return;
        }
    
        console.log("valor de token", token);
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        const options = {
            headers: headers
        };
    
        return this.http.post(this.apiUrl+'/picking', params,options);
    }

    getShipping(param: any): any {
        const token = sessionStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        const options = {
            headers: headers,
            params: param
        };
        return this.http.get(this.apiUrl+'/shipping',options);
    }

    getStats(params: any): any {
        const token = sessionStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        const options = {
            headers: headers,
            params:params
        };
        return this.http.get(this.apiUrl+'/stat',options);
    }
    override postShipping(params: any): any {
        const token = sessionStorage.getItem('token');
        
        if (!token) {
            console.error('No token found in sessionStorage');
            return;
        }
    
        console.log("valor de token", token);
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        const options = {
            headers: headers
        };
        console.log("valor de params", params)
        return this.http.post(this.apiUrl+'/shipping', params,options);
    }

    override postRegister(params: any):any{
        const token = sessionStorage.getItem('token');
        
        if (!token) {
            console.error('No token found in sessionStorage');
            return;
        }
    
        console.log("valor de token", token);
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        const options = {
            headers: headers
        };
    
        return this.http.post(this.apiUrl+'/users', params,options);
    }

    getUsers(): any {
        const token = sessionStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        const options = {
            headers: headers
        };
        return this.http.get(this.apiUrl+'/users',options);
    }
    
    override deleteUser(code: any): Observable<any> {
        const token = sessionStorage.getItem('token');
        const headers = new HttpHeaders()
            .set('Authorization', `Bearer ${token}`)
            .set('Content-Type', 'application/json'); // Ensure Content-Type is set
    
        const options = {
            headers: headers,
            params: { "code": code },
        };
        console.log("valor de op   ", options)
        return this.http.delete(`http://localhost:5000/users`, options);
    }
    
    override deleteJob(code: any): Observable<any> {
        const token = sessionStorage.getItem('token');
        const headers = new HttpHeaders()
            .set('Authorization', `Bearer ${token}`)
            .set('Content-Type', 'application/json'); // Ensure Content-Type is set
    
        const options = {
            headers: headers,
            params: { "jobId": code },
        };
        console.log("valor de op   ", options)
    
        return this.http.delete(`http://localhost:5000/jobDelete`, options);
    }

    override closeJob(code: any): Observable<any> {
        const token = sessionStorage.getItem('token');
        const headers = new HttpHeaders()
            .set('Authorization', `Bearer ${token}`)
            .set('Content-Type', 'application/json'); // Ensure Content-Type is set
    
        const options = {
            headers: headers,
            params: { "jobId": code },
        };
       
    
        return this.http.put(`http://localhost:5000/jobClose`,{"jobId":code}, options);
    }   


    addJob(params: any): any {
        const token = sessionStorage.getItem('token');
        
        if (!token) {
            console.error('No token found in sessionStorage');
            return;
        }
    
        console.log("valor de token", token);
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        const options = {
            headers: headers
        };
    
        return this.http.post(this.apiUrl+'/jobs', params,options);
    }

    addJobPackage(params: any):any {
        const token = sessionStorage.getItem('token');
        
        if (!token) {
            console.error('No token found in sessionStorage');
            return;
        }
    
        console.log("valor de token", token);
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        const options = {
            headers: headers
        };
    
        return this.http.post(this.apiUrl+'/packages', params,options);
        
    }

    postNewShippingList(params: any): any {
        const token = sessionStorage.getItem('token');
        
        if (!token) {
            console.error('No token found in sessionStorage');
            return;
        }
    
        console.log("valor de token", token);
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        const options = {
            headers: headers
        };
        
        console.log("valor de params", params);
        return this.http.post(this.apiUrl+'/new_picking_list', params,options);
    }

    deleteLocation(params: any): any {
        const token = sessionStorage.getItem('token');
        
        if (!token) {
            console.error('No token found in sessionStorage');
            return;
        }
    
        console.log("valor de token", token);
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        const options = {
            headers: headers,
            params:params
        };
    
        return this.http.delete(this.apiUrl+'/location',options);
    }

    override putLocation(params: any): any {
        const token = sessionStorage.getItem('token');
        
        if (!token) {
            console.error('No token found in sessionStorage');
            return;
        }
    
        console.log("valor de token", token);
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        const options = {
            headers: headers
        };
    
        return this.http.put(this.apiUrl+'/location', params,options);
    }
}
