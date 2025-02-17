import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CccpasswdchangeComponent } from './cccpasswdchange.component';
import { AppRoutingModule } from './../app-routing.module';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule, } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
//import { cccvisorpasswdokComponent } from './cccvisorpasswd-ok.component';

@NgModule({
  declarations: [
    CccpasswdchangeComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatButtonModule,
    MatRadioModule,
    MatListModule,
    MatFormFieldModule,
    AppRoutingModule,
  ]
})

export class CccpasswdchangeModule {}
