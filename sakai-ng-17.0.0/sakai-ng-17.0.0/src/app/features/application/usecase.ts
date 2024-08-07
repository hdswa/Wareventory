import { Observable } from "rxjs";

export interface UseCase <S,T> {
    executeLogin(params:S): Observable<T>;
    getJobs(params:S): Observable<T>;
    getJobPackages(params:S): Observable<T>;
    getSKUlocations(params:S): Observable<T>;
    getLocationItems(params:S): Observable<T>;
}