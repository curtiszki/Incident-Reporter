import {Component, Output, EventEmitter} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { MatFormFieldModule} from "@angular/material/form-field";
import {FormBuilder, FormControl, FormGroup,FormsModule,ReactiveFormsModule,Validators} from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { NgIf } from "@angular/common";
import {Md5} from "ts-md5";
// delete dialogue popup
@Component({
    selector: 'delete-dialog',
    templateUrl: 'deleteddialog.component.html',
    standalone: true,
    imports: [MatButtonModule, 
        MatDialogActions, 
        MatDialogClose, MatDialogTitle, MatDialogContent, MatFormFieldModule, FormsModule, ReactiveFormsModule, MatInputModule, NgIf]
})
export class deleteDialog {
    form !: FormGroup;
    public invalidPassword: boolean = false;
    public validated = false;

    @Output() valid : EventEmitter<boolean>= new EventEmitter<boolean>();
    
    validPassword(s: string) {
        let validMD5 : string = "fcab0453879a2b2281bc5073e3f5fe54";
        let pw : string = s.trim();
        let hash : string = Md5.hashStr(pw);
        if (validMD5 === hash) {
            return true;
        }
        this.invalidPassword = true;
        this.form.controls['password'].setErrors({invalid: true});
        return false;
    }
    constructor(public dialogRef : MatDialogRef<deleteDialog>, private formBuilder : FormBuilder){
    }
    
    ngOnInit() : void {
        this.form = this.formBuilder.group({
            password: ['', [
                Validators.required,
            ]]
        })
    }

    onSubmit(): void {
        let value = this.form.get('password')?.value.toString();
        if (this.validPassword(value)) {
            this.valid.emit(true);
            this.validated = true;
            this.dialogRef.close(this.validated);
        }
    }
}