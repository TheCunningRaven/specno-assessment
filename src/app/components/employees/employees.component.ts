import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
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
  @Input() selectedOffice: any = {};
  @ViewChild('EmployeeSheet') public EmployeeSheet;

  // Modal Variables
  modalRef?: BsModalRef;
  modalAction = '';

  //General Variables
  employeeForm: FormGroup;
  employees: IEmployee[];
  searchText = '';
  employeePayload:IEmployee = {
    id: 0,
    officeId: this.selectedOffice.id,
    firstName: '',
    lastName: '',
  };

  errorMsg = '';
  selected?: string;
  states: string[] = [
    'Alabama',
    'Alaska',
    'Arizona',
    'Arkansas',
    'California'
  ];

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
    this.apiService.addEmployee(this.employeeForm.value).subscribe(response => {
      this.getEmployees();
      this.modalRef?.hide();
      this.employeeForm.reset();
    }, error => {
      console.log(error);
    });
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
  onSubmit(employeeData: any, action: string) {
    if (action == 'Add')
      this.addNewEmployee();
    if (action == 'Update')
      this.updateEmployee();
    else {
      this.deleteEmployee();
    }
  }
  openModal(employeeDataFromTemplate: any, action: string) {
    this.modalAction = action;
    this.modalRef = this.modalService.show(this.EmployeeSheet);

    if (action == 'Update')
      this.employeePayload.id = employeeDataFromTemplate.id;
      this.employeePayload.firstName = employeeDataFromTemplate.firstName;
      this.employeePayload.lastName = employeeDataFromTemplate.lastName;
      this.employeePayload.officeId = employeeDataFromTemplate.officeId;
    if (action == 'Delete')
      this.employeePayload.id = employeeDataFromTemplate.id;
  }

  initialiseForm(){
    this.employeeForm = this.formBuilder.group({
      officeId: [this.selectedOffice.id],
      firstName: ['', [
        Validators.required,
        Validators.minLength(2)
      ]],
      lastName: ['', [
        Validators.required,
        Validators.minLength(2)
      ]],
    })
  }
}
