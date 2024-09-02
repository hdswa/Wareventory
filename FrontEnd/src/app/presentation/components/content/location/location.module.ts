import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { locationRoutingModule } from './location-routing.module';
import { LocationComponent } from './location.component';
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
        locationRoutingModule,
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
    declarations: [LocationComponent],
    providers: [MessageService]
})
export class LocationModule { }
