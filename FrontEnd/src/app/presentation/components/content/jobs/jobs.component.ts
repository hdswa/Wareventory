import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OnInit } from '@angular/core';
import { WareVentoryUseCase } from 'src/app/features/application/wareventory.usecase';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

const TRANSLATIONS=[
  'TEXT.JOB_ID',
  'TEXT.SUPPLIER',
  'TEXT.DESCRIPTION',
  'TEXT.SIZE',
]
@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
})
export class JobsComponent implements OnInit{

  private translations:{[key:string]:string}={};
  public cols: any[] = [];
  constructor(public layoutService: LayoutService,private wareventoryUC:WareVentoryUseCase,private messageService:MessageService,private translateService:TranslateService) { }
  async ngOnInit(): Promise<void> {
    this.translateService.use(sessionStorage.getItem('language'));
    await this.initTranslations();
    this.initCols();
    
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
  public jobFormGroup=new FormGroup({
    jobId: new FormControl(''),
    supplier: new FormControl(''),
    pg: new FormControl(''),
    sku: new FormControl(''),
    
   
  });
  public dataArray: any[] = [];
  public gotData: boolean = false;

  initCols(){
    this.cols=[
      
      { field: 'jobId', header: this.translations['TEXT.JOB_ID'] },
      { field: 'jobSupplier', header: this.translations['TEXT.SUPPLIER'] },
      { field: 'jobComment', header: this.translations['TEXT.DESCRIPTION'] },
      { field: 'jobSize', header: this.translations['TEXT.SIZE'] }
      
    ]
  }
  public processInventoryForm(){
    this.wareventoryUC.getJobs(this.jobFormGroup.value).subscribe(
      (data) => {
          this.dataArray = data;
          this.gotData = true;
          // console.log(data)
          
          this.toastMessage('success', 'Success', this.translateService.instant('MESSAGE.GENERIC_SUCCESS_MESSAGE'));
      },
      (error) => {
          console.log(error);
      }
  );
  }
  toastMessage(severity: string, summary: string, detail: string) {
    this.messageService.add({severity:severity, summary: summary, detail: detail});
  }
}
