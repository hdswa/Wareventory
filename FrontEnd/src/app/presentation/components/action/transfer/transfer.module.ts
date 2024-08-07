import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransferComponent } from './transfer.component';
import { TransferRoutingModule } from './transfer-routing.module';

import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { DataModule } from 'src/app/features/data-module';
import { TableModule } from 'primeng/table';
@NgModule({
    imports: [
        CommonModule,
        TransferRoutingModule,
        ButtonModule,
        CheckboxModule,
        InputTextModule,
        FormsModule,
        PasswordModule,
        ReactiveFormsModule,
        DataModule,
        TableModule
        
    ],
    declarations: [TransferComponent]
})
export class TransferModule { }
