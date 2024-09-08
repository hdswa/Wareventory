import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';

import { WareVentoryUseCase } from 'src/app/features/application/wareventory.usecase';

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',

})
export class DeleteUserComponent implements OnInit {
  constructor(private wareventoryUC: WareVentoryUseCase,private messageService:MessageService,private translateService:TranslateService) {
    this.translateService.use(sessionStorage.getItem('language'));
   }

  public usersList: any[]= [];
  public filterText: string = '';
  public filteredUsersList: any[]= [];
  ngOnInit() {
    this.getUsers();
  }


  getUsers(){
    this.wareventoryUC.getUsers().subscribe(
      data => {
        console.log(data);
        this.usersList = data.sort((a, b) => a.code.localeCompare(b.code));
        this.filteredUsersList = this.usersList;
      },
      error => {
        console.log(error);
      }
    );
  }

  deleteUser(code: any){
    if (window.confirm("Are you sure you want to delete this user: " + code + "?")) {
      this.wareventoryUC.deleteUser(code).subscribe(
        data => {
          console.log(data);
          this.getUsers();
          this.toastMessage('success', 'User deleted', 'User deleted successfully');

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

  applyFilter(){
   
    if(this.filterText==''){
      this.getUsers();
      return;
    }
    this.filteredUsersList=this.usersList.filter((location)=>{
      return location.code.toLowerCase().includes(this.filterText.toLowerCase());
    });
  }
}
