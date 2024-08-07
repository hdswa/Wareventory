import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    
    imports: [
        CommonModule,
        AuthRoutingModule,
        ReactiveFormsModule,
        FormsModule
    ]
})
export class AuthModule { }
