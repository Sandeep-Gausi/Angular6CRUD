import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../shared/employee.service';
import {DepartmentService} from '../../shared/department.service';
import {NotificationService} from '../../shared/notification.service';
import { MatDialogRef } from '@angular/material';
@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {

  constructor(private service: EmployeeService,
    private departmentService: DepartmentService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<EmployeeComponent>) { }

  ngOnInit() {
    this.service.getEmployees();
  }

  onClear()
  {
    this.service.form.reset();
    this.service.InitializeFormGroup();
  }

  onSubmit(){
    if(this.service.form.valid){
      if(!this.service.form.get('$key').value)
        this.service.insertEmployee(this.service.form.value);
        else
        this.service.updateEmployee(this.service.form.value);
      this.service.form.reset();
      this.service.InitializeFormGroup();
      this.notificationService.success(":: Submitted Succcessfully");
      this.onClose();
    }
  }

  onClose(){
    this.service.form.reset();
    this.service.InitializeFormGroup();
    this.dialogRef.close();
  }

}
