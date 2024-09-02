import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';

import { WareVentoryUseCase } from 'src/app/features/application/wareventory.usecase';

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',

})
export class DeleteUserComponent implements OnInit {
  constructor(private wareventoryUC: WareVentoryUseCase,private messageService:MessageService) { }

  public usersList: any[]= [];
  ngOnInit() {
    this.getUsers();
  }


  getUsers(){
    this.wareventoryUC.getUsers().subscribe(
      data => {
        console.log(data);
        this.usersList = data;
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
}
