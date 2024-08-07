import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContentRoutingModule } from './content-routing.module';
@NgModule({
    
    imports: [
        CommonModule,
        ContentRoutingModule,
        ReactiveFormsModule,
        FormsModule
    ]
})
export class ContentModule { }
