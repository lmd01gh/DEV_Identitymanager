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




export interface visorRequisitos {
   Title: string;
  HistoryLen: string;
  MaxLen: string;
  MinLen: string;
  SpecialCharsDenied: string;
}


@Component({
  selector: 'imx-cccvisorrequisitos',
  templateUrl: './cccvisorrequisitos.component.html',
  styleUrls: ['./cccvisorrequisitos.component.scss']
})

export class cccvisorrequisitosComponent {

  constructor(private dialogRef: MatDialogRef <cccvisorrequisitosComponent>, @Inject(MAT_DIALOG_DATA) public _visorRequisitos: visorRequisitos,
  ) { 
    dialogRef.disableClose=true;
  }

  public LdsExplanation = '#LDS#The passcode could not be created. No manager could be found for this identity. Please assign a manager to the identity or deactivate the two-person principle of passcode assignment and try again.';
}
