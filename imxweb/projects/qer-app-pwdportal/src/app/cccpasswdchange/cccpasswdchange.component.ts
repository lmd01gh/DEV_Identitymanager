import { Component, OnInit,ViewChild} from '@angular/core';
import {  SplashService  } from 'qbm';
import { CaptchaService, AppConfigService } from 'qbm';

import {  UntypedFormGroup, UntypedFormControl } from '@angular/forms';

import {FormBuilder, Validators} from '@angular/forms';
import { OverlayRef } from '@angular/cdk/overlay';

import { V2Client} from 'imx-api-ccc';
import { MatStepper } from '@angular/material/stepper';
import {cccvisorrequisitosComponent} from "./cccvisorrequisitos.component";
import {cccvisorpasswdokComponent} from "./cccvisorpasswd-ok.component";

import {  imx_SessionService, UserMessageService } from 'qbm';
import { EuiLoadingService } from "@elemental-ui/core";
import { MatDialog } from '@angular/material/dialog';
import { PolicyValidationResult } from 'imx-api-qer';

import { PasswordService } from '../../../../qer/src/lib/password/password.service';



@Component({
  selector: 'imx-cccpasswdchange',
  styleUrls: ['./cccpasswdchange.component.scss'],
  templateUrl: './cccpasswdchange.component.html'
})
export class CccpasswdchangeComponent implements OnInit {
  
  public readonly profileForm: UntypedFormGroup;
  public readonly formGroup: UntypedFormGroup;
  public  _v3Client: V2Client;
  public showPageContent = true;
  public isLoggedIn = false;
  
  
   @ViewChild('stepper') public stepper: MatStepper;
  

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  ThirdFormGroup = this._formBuilder.group({
    ThirdFormCtrl: ['', Validators.required],
    FourFormCtrl: ['', Validators.required],
  });
 
  
  
  
  
  PinTemporal: string;
  ConPinTemporal=false;
  UIDPerson="";
  Login="";
  //Guarda el valor que introduce el usuario para que se le envie el pin
  Pin="";
  //Guarda el pin que introduce el usuario después de recibirlo
  PinAcceso="";
  //Guarda la nueva password introducida por el usuario
  NuevaPasswd="";
  //Guarda la nueva password introducda por el usuario (la repite)
  RepetirPasswd="";
  errorPascode=false;
  errorPasswd=false;
  errorCheckPasswd=false;
  errorCaptcha=false;
   
  


  constructor(
    private _formBuilder: FormBuilder,
    private readonly splash: SplashService,
    public readonly captchaSvc: CaptchaService,
    private readonly config: AppConfigService,
		private readonly session: imx_SessionService,
		private readonly busyService: EuiLoadingService,
		private readonly messageSvc: UserMessageService, 
    private passwordSvc: PasswordService,
    private dialogService:MatDialog,

    )

    {
      
      this.formGroup = new UntypedFormGroup({
        answer: new UntypedFormControl('', { updateOn: 'blur', validators: [Validators.required] }),  
      });     
  
    }
    
 
    
  ngOnInit(): void {
   
  const schemaProvider = this.config.client;
  this._v3Client = new V2Client(this.config.apiClient,schemaProvider);
  
  this.splash.close();
  
  }
 



public async EnviarPin() {
  
 this.messageSvc.subject.next(undefined);
 let overlayRef: OverlayRef;
 setTimeout(() => overlayRef = this.busyService.show()); 
 const LoginTemp=this.Login;
 //console.log(LoginTemp);
 let respuesta2= await this._v3Client.Customeprinsa_ccc_SolicitudOTP_get({OTP_Usuario:this.Login ,OTP_EnviarA:this.Pin})
 if (respuesta2 == "-1") 
  {
    //Error no me envia el pin por error en los datos. Llamo a la pantalla modal para mostrar error
    this.dialogService.open(cccvisorpasswdokComponent, {
      data: {Login: "No se puede encontrar una combinación de cuenta y datos de recuperación aportados.",
         TipoError: 'EnvioDatos'
      },
      panelClass: 'imx-messageDialog',
      disableClose: true
   });
   setTimeout(() => this.busyService.hide(overlayRef));
    
  }
  else{
    this.dialogService.open(cccvisorpasswdokComponent, {
      data: {Login: "En unos momentos recibirá un PIN para el reinicio de contraseña. Revise su cuenta o dispositivo.",
         TipoError: 'EnvioDatosOK'
      },
      panelClass: 'imx-messageDialog',
      disableClose: true
    });
    setTimeout(() => this.busyService.hide(overlayRef));
    this.ConPinTemporal=true;
    }

}




  
  async VerificarAcceso()
    {
  
      this.messageSvc.subject.next(undefined);
      let overlayRef: OverlayRef;
      setTimeout(() => overlayRef = this.busyService.show());
      const resp = this.captchaSvc.Response;
      var resp1= await this._v3Client.Customeprinsa_ccc_CompruebaCaptcha_get({Codigo:resp})
      if (resp1 == "0" )
      {
        //captcha incorrecto
        this.captchaSvc.ReinitCaptcha();  
        this.errorCaptcha=true;
        setTimeout(() => this.busyService.hide(overlayRef));
      }

      else{
   
        //si nos devuelve un 1 el captcha es correcto
          this.messageSvc.subject.next(undefined);
          let overlayRef: OverlayRef;
          setTimeout(() => overlayRef = this.busyService.show());
          try {
            //console.log(this.PinAcceso);
            const newSession = await this.session.login({
              __Product: "PasswordReset",
              Module: "Passcode",
              User: this.Login,
              Passcode: this.PinAcceso
            });
          
            if (newSession) {
              setTimeout(() => this.busyService.hide(overlayRef));
              this.errorPascode=false;
              this.UIDPerson=newSession.UserUid;
            
              //console.log(newSession.IsLoggedIn);
              //console.log(newSession.UserUid);
              //console.log(newSession.Username);
              //console.log(newSession);    
              //console.log(this.PinAcceso);
              //console.log(this.Login);
              //Tengo que mostrar datos para cambio de contraseña
              // console.log("Error PassCode " + this.errorPascode);
              //console.log("Tercer Paso  " + this.tercerPaso);
              //this.stepper.next();
              this.stepper.next();
            }
            else {
            this.errorPascode=true;
            setTimeout(() => this.busyService.hide(overlayRef));
          }
        }catch {
          setTimeout(() => this.busyService.hide(overlayRef));
          this.errorPascode=true;
          //console.log("Error pascode" + this.errorPascode)
        }
      }
      setTimeout(() => this.busyService.hide(overlayRef));
    }
    
    

    async CambiarPasswd()
    {
      this.errorPasswd=false;
      this.errorCheckPasswd=false;
      //Si las claves son diferentes, mostramos mensaje de error
      if (this.NuevaPasswd != this.RepetirPasswd)
        {
          this.errorPasswd=true;
        }
      else{
        //Las claves son iguales. Obtenemos la longitud minima de la password que debe cumplir por política
        const resp4=await this._v3Client.Customeprinsa_ccc_PoliticaPassword_columnas_get({})  
        const Longitud=(resp4.Entities[0].Columns.MinLen.Value);
        if ((this.NuevaPasswd.length)< Longitud) 
          {
          //si la longitud de la password introducida es menor a la exigida por política, mostramos mensaje de error
          this.errorCheckPasswd=true;
          }
        else{
            //Todo correcto. Grabo la nueva password comprobando previamente la política
            let overlayRef: OverlayRef;
            setTimeout(() => overlayRef = this.busyService.show());
        
            let results: PolicyValidationResult[];
            try {
              results = await this.passwordSvc.postOrCheckPassword({
                NewPassword: this.NuevaPasswd,
                CheckOnly: false,
                Ids: ["<Key><T>Person</T><P>" + this.UIDPerson + "</P></Key>.CentralPassword"]
              }, "");
            } finally {
              setTimeout(() => this.busyService.hide(overlayRef));
            }
        
            if (results.length === 0) 
              {
                  //Todo correcto. La clave se almacena correctamente
                  this.NuevaPasswd="";
                  this.RepetirPasswd="";
                  this.ThirdFormGroup.invalid;
                  this.dialogService.open(cccvisorpasswdokComponent, {
                    data: {Login: this.Login,
                      TipoError: 'CambioPasswd'
                    },
                    panelClass: 'imx-messageDialog',
                    disableClose: true
                });  
                this.stepper.reset();
                this.ConPinTemporal=false;
              } 
              else {
                //Si la contraseña no cumple la política mostramos mensaje de error
                this.errorCheckPasswd=true;
              }
            }
          }

        }


     
  
    

ModificaOpcionSeleccionada() : void{
  //Tenemos que limpiar todos los campos de los formularios
  this.Pin="";
  this.PinAcceso="";
  this.NuevaPasswd="";
  this.RepetirPasswd="";
  this.captchaSvc.Response="";
}


public LimpiarErrorPaswd():void
{
  this.errorPasswd=false;  
  this.errorCheckPasswd=false;
}


public Anterior():void {
  this.errorPascode=false;
  this.errorCaptcha=false;
}


public ReinciciarCaptcha():void{
this.captchaSvc.ReinitCaptcha();
}


async RequisitosPasswd()
{
  let overlayRef: OverlayRef;
  setTimeout(() => overlayRef = this.busyService.show());
  try{
  const resp3=await this._v3Client.Customeprinsa_ccc_PoliticaPassword_columnas_get({})  
  this.dialogService.open(cccvisorrequisitosComponent, {
        data: {Title: resp3.Entities[0].Columns.DisplayName.Value,
        HistoryLen: resp3.Entities[0].Columns.HistoryLen.Value,
        MaxLen: resp3.Entities[0].Columns.MaxLen.Value,
        MinLen: resp3.Entities[0].Columns.MinLen.Value,
        SpecialCharsDenied: resp3.Entities[0].Columns.SpecialCharsDenied.Value
        },
        panelClass: 'imx-messageDialog',
        disableClose: true
    });
  
} finally {
  setTimeout(() => this.busyService.hide(overlayRef));
}
setTimeout(() => this.busyService.hide(overlayRef));
}

}