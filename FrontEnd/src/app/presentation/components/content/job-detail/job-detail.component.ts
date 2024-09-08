import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute} from '@angular/router';
import { WareVentoryUseCase } from 'src/app/features/application/wareventory.usecase';
import { TranslateService } from '@ngx-translate/core';

const TRANSLATIONS=[
  'TEXT.PG',
  'TEXT.SKU',
  'TEXT.EXPECTED_QUANTITY',
  'TEXT.RECEIVED_QUANTITY',
  'TEXT.LOCATED_QUANTITY',
]

@Component({
  selector: 'app-job-detail',
  templateUrl: './job-detail.component.html',
})
export class JobDetailComponent implements OnInit {
  public cols: any[] = [];
  public translations:{[key:string]:string}={};
  async ngOnInit(): Promise<void> {
    await this.initTranslations();
    this.initCols();
  }
  initTranslations():Promise<void>{
    return new Promise((resolve,reject)=>{
        
        this.translateService.get(TRANSLATIONS).subscribe(translations => {
            this.translations = translations;
            console.log("valor de trans",this.translations)
            resolve();
        },
        error=>{
            reject(error);
        });
    });
  }

  public jobId: string;
  public supplier:string;
  public jobSize: number;
  public jobDescription: string;
  public jobObject: any[] = [];
  

  jobPackages:any[] = [];

  initCols(){
    this.cols=[
      { field: 'PG', header: this.translations['TEXT.PG'] },
      { field: 'itemSKU', header: this.translations['TEXT.SKU'] },
      { field: 'expectedQuantity', header: this.translations['TEXT.EXPECTED_QUANTITY'] },
      { field: 'receivedQuantity', header: this.translations['TEXT.RECEIVED_QUANTITY'] },
      { field: 'locatedQuantity', header: this.translations['TEXT.LOCATED_QUANTITY'] },
    ]
  }
  constructor(private router: Router, private activatedRoute: ActivatedRoute,private wareventoryUC:WareVentoryUseCase
    ,private translateService:TranslateService) 
   {
    this.translateService.use(sessionStorage.getItem('language'));
    this.jobId = this.activatedRoute.snapshot.paramMap.get('jobId');
    var jobIdParam={'jobId':this.jobId}

    this.wareventoryUC.getJobs(jobIdParam).subscribe(
      (data) => {
          this.jobObject = data;
          this.jobId=this.jobObject[0].jobId;
          this.supplier=this.jobObject[0].jobSupplier;
          this.jobDescription=this.jobObject[0].jobComment;
          this.jobSize=this.jobObject[0].jobSize;
          // console.log(data)
      },
      (error) => {
          console.log(error);
      }
    )

   
    this.wareventoryUC.getJobPackages(jobIdParam).subscribe(
      (data) => {
          this.jobPackages=data;
          
          console.log(data)
          this.initVariable();
      },
      (error) => {
          console.log(error);
      }

    )
   

  }

  public receivedQuantity:number=0;
  public locatedQuantity:number=0;
  public totalJobs:number=0;
  getReceivedJobs() {
    this.receivedQuantity = this.jobPackages.filter(obj => Number(obj.receivedQuantity) === Number(obj.expectedQuantity)).length;
  }
  getTotalJobs(){
    this.totalJobs = this.jobPackages.length;
  }
  getCompletedJobs(){
    this.locatedQuantity = this.jobPackages.filter(obj => Number(obj.locatedQuantity) === Number(obj.expectedQuantity)).length;
  }

  initVariable(){
    this.receivedQuantity=0;
    this.locatedQuantity=0;
    this.totalJobs=0;
    this.getCompletedJobs();
    this.getReceivedJobs();
    this.getTotalJobs();
    console.log(this.receivedQuantity)
    console.log(this.locatedQuantity)
    console.log(this.totalJobs)
  }
  
}
