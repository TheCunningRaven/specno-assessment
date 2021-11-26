import { Component, OnInit, TemplateRef } from '@angular/core';
import { IOffice } from '../../interfaces/offices';
import { IEmployee } from '../../interfaces/employees';
import { ApiService } from 'src/app/services/api.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-office',
  templateUrl: './office.component.html',
  styleUrls: ['./office.component.scss']
})
export class OfficeComponent implements OnInit {

  //General Variabls
  offices: IOffice[];
  officeForm: FormGroup;

  //Modal Variables
  modalRef?: BsModalRef;

  constructor(
    private apiService: ApiService,
    private service: SharedService,
    private modalService: BsModalService,
    private router: Router,
    private formBuilder: FormBuilder
    ) { }

  ngOnInit(): void {
    this.getOffices();
    this.officeForm = this.formBuilder.group({
      name: ['', [
        Validators.required,
        Validators.minLength(5)
      ]],
      address: ['', [
        Validators.required,
        Validators.minLength(5)
      ]],
      phoneNumber: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
      ]],
      emailAddress: ['', [
        Validators.email,
        Validators.required,
        Validators.minLength(5)
      ]],
      capacity: ['', [
        Validators.required,
        Validators.minLength(1)
      ]],
    })
  }
  goToOfficeView(office: IOffice) {
    this.service.setCurrentOffice(office)
    this.router.navigate(['/office-view']);
  }
  deleteOffice(officeId:number){
    this.apiService.deleteOffice(officeId).subscribe(response => {
      this.getOffices();
      console.log(this.offices);
    }, error => {
      console.log(error);
    });
  }

  getOffices() {
    this.apiService.getOffices().subscribe(response => {
      this.offices = response;
      // console.log(this.offices);
    }, error => {
      console.log(error);
    });
  }

  addNewOffice() {
    const newOffice =  this.officeForm.value
    console.log(newOffice);
    this.apiService.addOffice(newOffice).subscribe(response => {
      this.getOffices();
      this.modalRef?.hide();
      this.officeForm.reset();
    }, error => {
      console.log(error);
    });
  }

  openModal(OfficeSheet: TemplateRef<any>) {
    this.modalRef = this.modalService.show(OfficeSheet);
  }
  openEdit(){

  }
}
