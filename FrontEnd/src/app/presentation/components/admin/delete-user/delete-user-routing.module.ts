import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DeleteUserComponent } from './delete-user.component';
@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: DeleteUserComponent }
    ])],
    exports: [RouterModule]
})
export class DeleteUserRoutingModule { }
