import { Component, OnInit } from '@angular/core';
import { WareVentoryUseCase } from 'src/app/features/application/wareventory.usecase';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-delete-job',
  templateUrl: './delete-job.component.html',

})
export class DeleteJobComponent implements OnInit{

  constructor(private wareventoryUC: WareVentoryUseCase,private router:Router,private messageService:MessageService) { }
  public jobList: any[]= [];
 
  ngOnInit() {
    this.getJobs();
  }


  getJobs(){
    this.wareventoryUC.getJobs({"all":true}).subscribe(
      data => {
        this.jobList = data;
        console.log(data);
      },
      error => {
        console.log(error);
      }
    );
  }

  jobDetail(code: any){
    console.log("valor de code", code);
    //http://localhost:4500/#/content/jobDetail/ICES127528129
    this.router.navigate(['/content/jobDetail', code]);
  }

  deleteJob(code: any,event:Event){
    event.stopPropagation();
    if (window.confirm("Are you sure you want to delete this job: " + code + "?")) {
      
      this.wareventoryUC.deleteJob(code).subscribe(
        data => {
          console.log(data);
          this.getJobs();
          this.toastMessage('success', 'Job deleted', 'Job deleted successfully');
        
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  closeJob(code: any,event:Event){
    if (window.confirm("Are you sure you want to close this job: " + code + "?")) {
      event.stopPropagation();
      this.wareventoryUC.closeJob(code).subscribe(
        data => {
          console.log(data);
          this.getJobs();
          this.toastMessage('success', 'Job closed', 'Job status changed successfully');
        },
        error => {
          console.log(error);
        }
      );
    }
  }
  toastMessage(severity: string, summary: string, detail: string) {
    this.messageService.add({severity:severity, summary: summary, detail: detail});
  }
}
