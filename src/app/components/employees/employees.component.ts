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
  modalRef?: BsModalRef;
  modalAction = '';
  employeeForm: FormGroup;
  employees: IEmployee[];
  employeeObj = {
    id:0,
    officeId: '',
    firstName: '',
    lastName: '',
  };
  errorMsg= '';
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
    this.employeeForm = this.formBuilder.group({
      officeId: [0],
      firstName: ['',[
        Validators.required,
        Validators.minLength(2)
      ]],
      lastName: ['',[
        Validators.required,
        Validators.minLength(2)
      ]],
    })
    // this.employeeForm.valueChanges.subscribe(console.log);
  }
  openModal(employee: any, action: string) {
    this.employeeForm.reset();
    this.modalRef = this.modalService.show(this.EmployeeSheet);
    this.modalAction = action;
    if (action == 'Update')
      this.onEdit(employee);
  }
  getEmployees() {
    this.apiService.getEmployeesByOfficeId(this.selectedOffice.id).subscribe(response => {
      this.employees = response;
    }, error => {
      console.log(error);
    });
  }
  addNewEmployee() {
    this.employeeObj.id =0;
    this.employeeObj.officeId = this.selectedOffice.id;
    this.apiService.addEmployee(this.employeeObj).subscribe(response => {
      this.getEmployees();
      this.modalRef?.hide();
      this.employeeForm.reset();
    }, error => {
      console.log(error);
    });
  }


  onEdit(employee: any) {
    this.employeeObj.id = employee.id;
    this.employeeObj.firstName = employee.firstName;
    this.employeeObj.lastName = employee.lastName;
    this.employeeForm.controls['lastName'].setValue(employee.lastName)

    this.employeeObj.officeId = this.selectedOffice.id;
    // this.employeeObj.firstName = this.employeeForm.value.firstName;
    // this.employeeObj.lastName = this.employeeForm.value.lastName;
  }
  updateEmployee(){

    this.apiService.updateEmployee(this.employeeObj.id, this.employeeObj).subscribe(response => {
      this.getEmployees();
      this.modalRef?.hide()
      this.employeeForm.reset();
    }, error => {
      console.log(error);
      this.errorMsg = 'Failed to update employee';
    });
  }
  deleteEmployee(employeeId) {
    this.apiService.deleteEmployee(employeeId).subscribe(response => {
      this.getEmployees(); //Ideally the repsonse from the API would help me update the dom with a nice message
    }, error => {
      console.log(error);
    });
  }

}
