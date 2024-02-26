import { Component, OnInit,  Inject } from '@angular/core';
import { EuiLoadingService, EuiSidesheetRef, EuiSidesheetService, EUI_SIDESHEET_DATA } from '@elemental-ui/core';
import {  SplashService } from 'qbm';
import { BaseCdr, ColumnDependentReference, ConfirmationService, SnackBarService, CdrFactoryService } from 'qbm';
import { IdentitiesService } from 'qer';
import { PortalPersonReports, QerProjectConfig } from 'imx-api-qer';
import {  UntypedFormGroup } from '@angular/forms';



@Component({
  selector: 'imx-cccpasswdchange',
  styleUrls: ['./cccpasswdchange.component.scss'],
  templateUrl: './cccpasswdchange.component.html'
})
export class CccpasswdchangeComponent implements OnInit {
  
  public identityForm = new UntypedFormGroup({});
  public PinTemporal=false;
  public cdrListPersonal: ColumnDependentReference[] = [];
  
  private readonly identityService: IdentitiesService;
  public accountIsOff = 0;

  constructor(
    //@Inject(EUI_SIDESHEET_DATA) public data: {
    //  selectedIdentity: PortalPersonReports,
     // projectConfig: QerProjectConfig,
    //},
    private readonly splash: SplashService
 
    
   
  ) {  
    
  }

  ngOnInit(): void {
    console.log("llego")
    this.splash.close()
  
  }
  

  //public async checkValues(name: string): Promise<void> {
   // switch (name) {
    //  case 'Login':
    //    this.accountIsOff = (await this.identityService.getDuplicates(
    //      {
    //        filter: this.identityService.buildFilterForduplicates(
    //          {
    //            centralAccount: this.data.selectedIdentity.GetEntity().GetColumn('CentralAccount').GetValue()
     //         }
     //       ), PageSize: -1
     //     }
     //   )).totalCount;
      //  break;
      
    //}
//  }




  
  }

