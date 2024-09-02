import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReceptionComponent } from './reception.component';
import { ReceptionRoutingModule } from './reception-routing.module';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { DataModule } from 'src/app/features/data-module';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
@NgModule({
    imports: [
        CommonModule,
        ReceptionRoutingModule,
        ButtonModule,
        CheckboxModule,
        InputTextModule,
        FormsModule,
        PasswordModule,
        ReactiveFormsModule,
        DataModule,
        TableModule,
        ToastModule
        
    ],
    declarations: [ReceptionComponent],
    providers: [MessageService]
})
export class ReceptionModule { }
