import { Component } from '@angular/core';
import { Router,ActivatedRoute} from '@angular/router';
import { WareVentoryUseCase } from 'src/app/features/application/wareventory.usecase';

@Component({
  selector: 'app-job-detail',
  templateUrl: './job-detail.component.html',
})
export class JobDetailComponent {


  public jobId: string;
  public supplier:string;
  public jobSize: number;
  public jobDescription: string;
  public jobObject: any[] = [];

  jobPackages:any[] = [];
  public cols=[
    { field: 'PG', header: 'PG' },
    { field: 'itemSKU', header: 'SKU' },
    { field: 'expectedQuantity', header: 'Expected Quantity' },
    { field: 'receivedQuantity', header: 'Received Quantity' },
    { field: 'locatedQuantity', header: 'Located Quantity' },
  ]
  constructor(private router: Router, private activatedRoute: ActivatedRoute,private wareventoryUC:WareVentoryUseCase) {
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
