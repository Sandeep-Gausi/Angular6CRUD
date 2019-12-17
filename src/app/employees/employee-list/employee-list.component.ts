import { Component, OnInit, ViewChild } from '@angular/core';
import { EmployeeService } from 'src/app/shared/employee.service';
import {DepartmentService} from 'src/app/shared/department.service';
import { MatTableDataSource , MatSort, MatPaginator , MatDialog, MatDialogConfig } from '@angular/material';
import { EmployeeComponent } from '../employee/employee.component';
import { NotificationService } from 'src/app/shared/notification.service';
import { DialogService } from 'src/app/shared/dialog.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {

  constructor( private service : EmployeeService,
    private departmentService : DepartmentService,
    private dialog : MatDialog,
    private notificationService : NotificationService,
    private dialogService: DialogService) { }

  listData: MatTableDataSource<any>;
  displayedColumns:string[] = ['fullName','email','mobile','city','actions'];
  @ViewChild(MatSort) sort:MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchKey:string;

  ngOnInit() {
    this.service.getEmployees().subscribe(
      list => {
        let array = list.map(item => {
          let departmentName = this.departmentService.getDepartmentName(item.payload.val()['department']);
          return {
            $key:item.key,
            departmentName,
            ...item.payload.val()
          };
        });
        this.listData = new MatTableDataSource(array);
        this.listData.sort = this.sort;
        this.listData.paginator = this.paginator;
      });
  }

  onSearchClear(){
    this.searchKey = "";
    this.applyFilter();
  }

  applyFilter(){
    this.listData.filter = this.searchKey.trim().toLowerCase();
  }

  onCreate(){
    this.service.InitializeFormGroup();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width="60%";
    this.dialog.open(EmployeeComponent,dialogConfig);
  }

  onEdit(row){
    this.service.populateForm(row);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width="60%";
    this.dialog.open(EmployeeComponent,dialogConfig);
  }

  onDelete($key){
    // if(confirm("Are you sure to delete the record ?"))
    // {
    //   this.service.deleteEmployee($key);
    //   this.notificationService.warn("! Deleted Succussfully");
    // }

    this.dialogService.openConfirmDialog('Are you sure to delete the record ?')
    .afterClosed().subscribe(res => {
    console.log(res);
    if (res) {
      this.service.deleteEmployee($key);
      this.notificationService.warn('! Deleted Successfully');
    }
    });
  }
}
