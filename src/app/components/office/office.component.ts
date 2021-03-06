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
  //Select office sheet from template
  @ViewChild('OfficeSheet') public OfficeSheet;

  //Office Variabls
  offices: IOffice[];
  officeForm: FormGroup;
  officePayload: IOffice = {
    id: 0,
    name: '',
    address: '',
    emailAddress: '',
    phoneNumber: 0,
    capacity: 0,
    colour: '',
    employees: []
  }

  //General Variables
  modalAction = '';
  modalRef?: BsModalRef;
  colours = [
    'red',
    'green',
    'yellow',
    'orange',
    'blue',
    'violet'
  ]

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
    if (this.offices.length < 5) {
      this.apiService.addOffice(this.officeForm.value).subscribe(() => {
        this.getOffices();
        this.modalRef?.hide();
        this.officeForm.reset();
      }, error => {
        console.log(error);
        alert('Failed to add office');
      });
    } else {
      this.modalRef?.hide();
      alert('Please raise more capital');
    }
  }

  getOffices() {
    this.apiService.getOffices().subscribe(response => {
      this.offices = response;
    }, error => {
      console.log(error);
      alert('Failed to get offices')
    });
  }

  updateOffice() {
    this.apiService.updateOffice(this.officePayload.id, this.officeForm.value).subscribe(() => {
      this.getOffices();
      this.modalRef?.hide();
      this.officeForm.reset();
    }, error => {
      console.log(error);
      alert('Failed to update office');
    });
  }

  deleteOffice() {
    this.apiService.deleteOffice(this.officePayload.id).subscribe(() => {
      this.getOffices();
    }, error => {
      console.log(error);
      alert('Failed to delete office');
    });
    this.modalRef?.hide();
  }

  goToOfficeView(office: IOffice) {
    this.service.setCurrentOffice(office)
    this.router.navigate(['/office-view']);
  }

  openModal(officeDataFromTemplate: any, action: string) {
    this.modalAction = action;
    this.modalRef = this.modalService.show(this.OfficeSheet);
    //Assign required fields for office payload
    this.officePayload.id = officeDataFromTemplate.id;
    this.officePayload.name = officeDataFromTemplate.name;
    this.officePayload.address = officeDataFromTemplate.address;
    this.officePayload.emailAddress = officeDataFromTemplate.emailAddress;
    this.officePayload.phoneNumber = officeDataFromTemplate.phoneNumber;
    this.officePayload.capacity = officeDataFromTemplate.capacity;
    this.officePayload.colour = officeDataFromTemplate.colour;
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
        Validators.minLength(1),
        Validators.max(5)
      ]],
      colour: ['', [
        Validators.required
      ]]
    })
  }
}
