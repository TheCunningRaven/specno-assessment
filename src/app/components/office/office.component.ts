import { Component, OnInit, ViewChild } from '@angular/core';
import { IOffice } from '../../interfaces/offices';
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

  @ViewChild('OfficeSheet') public OfficeSheet;
  
  //Modal Variables
  modalAction = '';
  modalRef?: BsModalRef;
  
  //General Variabls
  offices: IOffice[];
  officeForm: FormGroup;
  officePayload:IOffice = {
    id: 0,
    name: '',
    address: '',
    emailAddress: '',
    phoneNumber: 0,
    capacity: 0,
  }
  errorMsg = '';


  constructor(
    private apiService: ApiService,
    private service: SharedService,
    private modalService: BsModalService,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.getOffices();
    this.initialiseForm();
  }

  addNewOffice() {
    this.apiService.addOffice(this.officeForm.value).subscribe(response => {
      this.getOffices();
      this.modalRef?.hide();
      this.officeForm.reset();
    }, error => {
      console.log(error);
    });
  }

  getOffices() {
    this.apiService.getOffices().subscribe(response => {
      this.offices = response;
    }, error => {
      console.log(error);
    });
  }
  updateOffice() {
    this.apiService.updateOffice(this.officePayload.id, this.officeForm.value).subscribe(response => {
      this.getOffices();
      this.modalRef?.hide();
      this.officeForm.reset();
    }, error => {
      console.log(error);
      this.errorMsg = 'Failed to update employee';
    });
  }

  deleteOffice() {
    this.apiService.deleteOffice(this.officePayload.id).subscribe(response => {
      this.getOffices();
    }, error => {
      console.log(error);
    });
    this.modalRef?.hide();
  }

  goToOfficeView(office: IOffice) {
    this.service.setCurrentOffice(office)
    this.router.navigate(['/office-view']);
  }

  onSubmit(officeData: any, action: string) {
    if (action == 'Add')
      this.addNewOffice();
    if (action == 'Update')
      this.updateOffice();
    else {
      this.deleteOffice();
    }
  }

  openModal(officeDataFromTemplate: any, action: string) {
    this.modalAction = action;
    this.modalRef = this.modalService.show(this.OfficeSheet);

    if (action == 'Update')
      this.officePayload.id = officeDataFromTemplate.id;
    this.officePayload.name = officeDataFromTemplate.name;
    this.officePayload.address = officeDataFromTemplate.address;
    this.officePayload.emailAddress = officeDataFromTemplate.emailAddress;
    this.officePayload.phoneNumber = officeDataFromTemplate.phoneNumber;
    this.officePayload.capacity = officeDataFromTemplate.capacity;
    if (action == 'Delete')
      this.officePayload.id = officeDataFromTemplate.id;
  }
  initialiseForm() {
    //just made this method to remove this mess from the ngOnInit...
    this.officeForm = this.formBuilder.group({
      name: ['', [
        Validators.required,
        Validators.minLength(5)
      ]],
      address: ['', [
        Validators.required,
        Validators.minLength(5)
      ]],
      emailAddress: ['', [
        Validators.email,
        Validators.required,
        Validators.minLength(5)
      ]],
      phoneNumber: [0, [
        Validators.required,
        Validators.pattern("[0-9]{10}")
      ]],
      capacity: [0, [
        Validators.required,
        Validators.minLength(1)
      ]],
    })
  }
}
