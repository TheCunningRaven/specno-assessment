import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { IEmployee } from 'src/app/interfaces/employees';
import { ApiService } from 'src/app/services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {
  //Input office variable from parent component
  @Input() selectedOffice: any = {};
  //Select employee sheet from template
  @ViewChild('EmployeeSheet') public EmployeeSheet;

  //Employee Variables
  employeeForm: FormGroup;
  employees: IEmployee[];
  employeePayload: IEmployee = {
    id: 0,
    officeId: 0,
    firstName: '',
    lastName: '',
    avatarUrl: '',
  };

  // General Variables
  modalRef?: BsModalRef;
  modalAction = '';
  searchText = '';
  errorMsg = '';
  avatars = [
    'assets/images/avatar1.png',
    'assets/images/avatar2.png',
    'assets/images/avatar3.png',
    'assets/images/avatar4.png',
    'assets/images/avatar5.png',
    'assets/images/avatar6.png',
    'assets/images/avatar7.png',
  ]

  constructor(
    private modalService: BsModalService,
    private apiService: ApiService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.getEmployees();
    this.initialiseForm();
    // this.employeeForm.valueChanges.subscribe(console.log);
  }
  addNewEmployee() {
    if (this.employees.length < this.selectedOffice.capacity) {
      this.employeeForm.value.officeId = this.selectedOffice.id;
      this.apiService.addEmployee(this.employeeForm.value).subscribe(response => {
        this.getEmployees();
        this.modalRef?.hide();
        this.employeeForm.reset();
      }, error => {
        console.log(error);
      });
    }
    else {
      this.modalRef?.hide();
      alert('Office is at capacity');
    }
  }

  getEmployees() {
    this.apiService.getEmployeesByOfficeId(this.selectedOffice.id).subscribe(response => {
      this.employees = response;
    }, error => {
      console.log(error);
    });
  }

  updateEmployee() {
    this.apiService.updateEmployee(this.employeePayload.id, this.employeePayload).subscribe(response => {
      this.getEmployees();
      this.modalRef?.hide();
      this.employeeForm.reset();
    }, error => {
      console.log(error);
      this.errorMsg = 'Failed to update employee';
    });
  }

  deleteEmployee() {
    this.apiService.deleteEmployee(this.employeePayload.id).subscribe(response => {
      this.getEmployees(); //Ideally the repsonse from the API would help me update the dom with a nice message
    }, error => {
      console.log(error);
    });
    this.modalRef?.hide();
  }
  
  openModal(employeeDataFromTemplate: any, action: string) {
    this.modalAction = action;
    this.modalRef = this.modalService.show(this.EmployeeSheet);
    //Assign required fields for employee payload
    this.employeePayload.id = employeeDataFromTemplate.id;
    this.employeePayload.firstName = employeeDataFromTemplate.firstName;
    this.employeePayload.lastName = employeeDataFromTemplate.lastName;
    this.employeePayload.officeId = employeeDataFromTemplate.officeId;
    this.employeePayload.avatarUrl = employeeDataFromTemplate.avatarUrl;
  }

  initialiseForm() {
    this.employeeForm = this.formBuilder.group({
      officeId: 0,
      firstName: ['', [
        Validators.required,
        Validators.minLength(2)
      ]],
      lastName: ['', [
        Validators.required,
        Validators.minLength(2)
      ]],
      avatarUrl:['',[
        Validators.required
      ]]
    })
  }
}
