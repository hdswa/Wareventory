import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeleteJobComponent } from './delete-job.component';
import { DeleteJobRoutingModule } from './delete-job-routing';

import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { DataModule } from 'src/app/features/data-module';
import { TableModule } from 'primeng/table';
import { DataViewModule } from 'primeng/dataview';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
@NgModule({
    imports: [
        CommonModule,
        DeleteJobRoutingModule,
        ButtonModule,
        CheckboxModule,
        InputTextModule,
        FormsModule,
        PasswordModule,
        ReactiveFormsModule,
        DataModule,
        TableModule,
        DataViewModule,
        ToastModule
    ],
    declarations: [DeleteJobComponent],
    providers: [MessageService]
})
export class DeleteJobModule { }
