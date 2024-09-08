import { Component, OnInit } from '@angular/core';
import { WareVentoryUseCase } from 'src/app/features/application/wareventory.usecase';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-delete-job',
  templateUrl: './delete-job.component.html',

})
export class DeleteJobComponent implements OnInit{

  constructor(private wareventoryUC: WareVentoryUseCase,private router:Router,private messageService:MessageService,private translateService:TranslateService) {
    this.translateService.use(sessionStorage.getItem('language'));
   }
  public jobList: any[]= [];
  public filterText: string = '';
  public filteredJobList: any[]= [];
  ngOnInit() {
    this.getJobs();
  }


  getJobs(){
    this.wareventoryUC.getJobs({"all":true}).subscribe(
      data => {
        console.log(data);
        this.jobList = data.sort((a, b) => a.jobId.localeCompare(b.jobId));
        this.filteredJobList = this.jobList;
        
      },
      error => {
        console.log(error);
      }
    );
  }

  jobDetail(code: any){
    console.log("valor de code", code);
   
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
    else{
      event.stopPropagation();
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
    else{
      event.stopPropagation();
    }
  }
  toastMessage(severity: string, summary: string, detail: string) {
    this.messageService.add({severity:severity, summary: summary, detail: detail});
  }

  applyFilter(){
   
    if(this.filterText==''){
      this.getJobs();
      return;
    }
    this.filteredJobList=this.jobList.filter((location)=>{
      return location.jobId.toLowerCase().includes(this.filterText.toLowerCase());
    });
  }
}
