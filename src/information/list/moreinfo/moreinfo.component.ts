import {Component, Output, EventEmitter, OnInit, Optional, Inject} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogActions, MAT_DIALOG_DATA, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { MatFormFieldModule} from "@angular/material/form-field";
import {FormBuilder, FormControl, FormGroup,FormsModule,ReactiveFormsModule,Validators} from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { NgIf } from "@angular/common";
import {Md5} from "ts-md5";
import { HttpClient, HttpHeaderResponse, HttpHeaders } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
// delete dialogue popup
@Component({
    selector: 'more-info',
    templateUrl: 'moreinfo.component.html',
    styleUrl: 'moreinfo.component.css',
    standalone: true,
    imports: [MatButtonModule, 
        MatDialogActions, 
        MatDialogClose, MatDialogTitle, MatDialogContent, MatFormFieldModule, FormsModule, ReactiveFormsModule, MatInputModule, NgIf]
})
export class moreInfo implements OnInit {
    public src : string = '../../../assets/default.jpg';
    public caption: string = "No Image Uploaded";
    public hasExtra: boolean;
    public passwordPrompt: boolean = false;
    public password = "";
    public invalidAttempt = false;
    public url = "https://272.selfip.net/apps/pztgtsjgTS/collections/records/documents/";
    private validMD5 : string = "fcab0453879a2b2281bc5073e3f5fe54";
    public updated = false;

    constructor(public dialogRef: MatDialogRef<moreInfo>, 
        private http: HttpClient,
        @Inject (MAT_DIALOG_DATA) public data : any ) {
            this.hasExtra = false;
        }
    
    
    ngOnInit() : void {
        if (this.data.url != null && this.data.url.toString().length > 0) {
            this.src = this.data.url;
            this.caption = "";

        }
        if (this.data.extra != null && this.data.extra.toString().length > 0) {
            this.hasExtra = true;
        }
    }

    handlePassword() : void {
        if (this.passwordPrompt) {
            let hash : string = Md5.hashStr(this.password.trim());
            if (this.validMD5 === hash) {
                this.invalidAttempt = false;
                // update the row
                this.data.open = !this.data.open;
                let post = {
                            "key": this.data.key,
                            "data": this.data
                        }
                const headers = {
                    headers: new HttpHeaders({'Content-Type': 'application/json'})
                }
                const promise = firstValueFrom(this.http.put(this.url+ this.data.key, post, headers));
                promise.then(() => {
                    this.updated = true;
                    this.invalidAttempt = false;
                })
                
            }
            else {
                this.invalidAttempt = true;
                this.updated = false;
            }
        }
        else {
            this.passwordPrompt = true;
            this.updated = false;
        }
    }

}