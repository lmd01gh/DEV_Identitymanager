import { Component, OnInit } from '@angular/core';
import {  SplashService } from 'qbm';


@Component({
  selector: 'imx-cccpasswdchange',
  templateUrl: './cccpasswdchange.component.html'
})
export class CccpasswdchangeComponent implements OnInit {

  constructor(
    private readonly splash: SplashService,
  ) { }

  ngOnInit(): void {
    
    console.log("llego")
    this.splash.close()

  }
  
  
  }

