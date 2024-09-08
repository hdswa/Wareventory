import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class WareventoryTranslateService {
  constructor(private translate: TranslateService) {
    // Set the default language
    this.translate.setDefaultLang('es');
    if (sessionStorage.getItem('language')!=null){
        this.translate.use(sessionStorage.getItem('language'));
        }
        else{
        this.translate.use('es');
        }
  }

  // Use this method to change the language
  useLanguage(language: string) {
    this.translate.use(language);
  }

  // Use this method to get the translated value
  getTranslation(key: string) {
    return this.translate.instant(key);
  }

  get(keys: string[]):{[key:string]:string} {
    let result:{[key:string]:string}={};
    keys.forEach((key)=>{
        result[key]=this.getTranslation(key);
    });
    return result;
  }
}