/*
 * ONE IDENTITY LLC. PROPRIETARY INFORMATION
 *
 * This software is confidential.  One Identity, LLC. or one of its affiliates or
 * subsidiaries, has supplied this software to you under terms of a
 * license agreement, nondisclosure agreement or both.
 *
 * You may not copy, disclose, or use this software except in accordance with
 * those terms.
 *
 *
 * Copyright 2023 One Identity LLC.
 * ALL RIGHTS RESERVED.
 *
 * ONE IDENTITY LLC. MAKES NO REPRESENTATIONS OR
 * WARRANTIES ABOUT THE SUITABILITY OF THE SOFTWARE,
 * EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
 * TO THE IMPLIED WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE, OR
 * NON-INFRINGEMENT.  ONE IDENTITY LLC. SHALL NOT BE
 * LIABLE FOR ANY DAMAGES SUFFERED BY LICENSEE
 * AS A RESULT OF USING, MODIFYING OR DISTRIBUTING
 * THIS SOFTWARE OR ITS DERIVATIVES.
 *
 */
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef  } from '@angular/material/dialog';




export interface visorPasswordOK {
   Login: string;
   TipoError : string;
}


@Component({
  selector: 'imx-cccvisorpasswd-ok',
  templateUrl: './cccvisorpasswd-ok.component.html',
  styleUrls: ['./cccvisorpasswd-ok.component.scss']
})

export class cccvisorpasswdokComponent {
  
  public _envioDatos = false;
  public _envioDatosOK= false;

  constructor(private dialogRef: MatDialogRef <cccvisorpasswdokComponent>, @Inject(MAT_DIALOG_DATA) public _visorPasswordOK: visorPasswordOK,
  ) { 
    dialogRef.disableClose=true;
  
    if (_visorPasswordOK.TipoError=="EnvioDatos")
      {this._envioDatos=true;
    this._envioDatosOK=false;
      }
    else if (_visorPasswordOK.TipoError=="CambioPasswd")
      {
        this._envioDatos=false;
      }
    else if (_visorPasswordOK.TipoError=="EnvioDatosOK")
     {
      this._envioDatos=true;
      this._envioDatosOK=true;
     }  
  }

  public LdsExplanation = '#LDS#The passcode could not be created. No manager could be found for this identity. Please assign a manager to the identity or deactivate the two-person principle of passcode assignment and try again.';
}


