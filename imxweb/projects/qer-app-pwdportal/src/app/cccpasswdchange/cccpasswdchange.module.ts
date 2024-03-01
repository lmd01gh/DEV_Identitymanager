import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CccpasswdchangeComponent } from './cccpasswdchange.component';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule, } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';

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
  ]
})

export class CccpasswdchangeModule {}
