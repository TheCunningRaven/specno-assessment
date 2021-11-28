import { Injectable } from '@angular/core';
import { IOffice } from '../interfaces/offices';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  public currentOffice = {};

  constructor() {}

  setCurrentOffice(office:IOffice){
    this.currentOffice = office;
    //Using session storage for persistant data, otherwise reloading resets data
    sessionStorage.setItem('currentOffice', JSON.stringify(office))
  }
  getCurrentOffice(){
    return JSON.parse(sessionStorage.currentOffice);
  }
  
}
