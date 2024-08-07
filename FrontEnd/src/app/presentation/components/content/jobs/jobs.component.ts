import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OnInit } from '@angular/core';
import { WareVentoryUseCase } from 'src/app/features/application/wareventory.usecase';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
})
export class JobsComponent implements OnInit{

  constructor(public layoutService: LayoutService,private wareventoryUC:WareVentoryUseCase) { }
  ngOnInit(): void {

  }
  public jobFormGroup=new FormGroup({
    jobId: new FormControl(''),
    supplier: new FormControl(''),
    pg: new FormControl(''),
    sku: new FormControl(''),
    
   
  });
  public dataArray: any[] = [];
  public gotData: boolean = false;

  public cols=[
    { field: 'jobId', header: 'Job ID' },
    { field: 'jobSupplier', header: 'Supplier' },
    { field: 'jobComment', header: 'Description' },
    { field: 'jobSize', header: 'Size' },
    
  ]
  
  public processInventoryForm(){
    this.wareventoryUC.getJobs(this.jobFormGroup.value).subscribe(
      (data) => {
          this.dataArray = data;
          this.gotData = true;
          // console.log(data)
      },
      (error) => {
          console.log(error);
      }
  );
}
}