import {Component, Output, EventEmitter, OnInit, Optional, Inject} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogActions, MAT_DIALOG_DATA, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { MatFormFieldModule} from "@angular/material/form-field";
import {FormBuilder, FormGroupDirective,FormControl, FormGroup,FormsModule,ReactiveFormsModule,Validators} from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { NgIf } from "@angular/common";
import { HttpClient, HttpHeaders} from "@angular/common/http";
import { firstValueFrom } from "rxjs";

interface location {
    location : string,
    latitude : number,
    longitude: number
}

// delete dialogue popup
@Component({
    selector: 'location',
    templateUrl: 'locationmodal.component.html',
    styleUrl : 'locationmodal.component.css',
    standalone: true,
    imports: [MatButtonModule, 
        MatDialogActions, 
        MatDialogClose, 
        MatDialogTitle, 
        MatDialogContent, 
        MatFormFieldModule, 
        FormsModule, 
        ReactiveFormsModule, 
        MatInputModule, 
        NgIf]
})

export class locationModal implements OnInit {
    public locationForm !: FormGroup;
    public errMsg : string = "";

    constructor(private formBuilder: FormBuilder,
        private dialogRef : MatDialogRef<locationModal>,
        private http: HttpClient,
        @Inject (MAT_DIALOG_DATA) public data : any ) {}

    latitudeBoundsValidation(s: FormControl) {
        if (s.value == null) {
            return null;
        }
        var value : number = s.value;
        if (value >90 || value < -90) {
            return {invalidValue: value};
        }
        return null;
    }
    longitudeBoundsValidation(s: FormControl) {
        if (s.value == null) {
            return null;
        }
        var value : number = s.value;
        if (value > 180 || value <  -180) {
            return {invalidValue: value};
        }
        return null;
    }

    ngOnInit() : void {
        this.locationForm = this.formBuilder.group({
            name: ['', [
                Validators.required
            ]],
            latitude: ['', [
                Validators.required,
                this.latitudeBoundsValidation
            ]],
            longitude: ['', [
                Validators.required,
                this.longitudeBoundsValidation
            ]]
        })
    }

    newLocation() : void {
        if (!this.locationForm.valid) {
            return;
        } 
        const url = "https://272.selfip.net/apps/pztgtsjgTS/collections/locations/documents/locationSet";
        let ls : location[] = <location[]>this.data.locationSet;
        const name : string = this.name?.value;
        for (let i = 0; i < ls.length; i++) {
            if (ls[i].location.toLowerCase() == name.toLowerCase()) {
                this.errMsg = "";
                return;
            }
        }
        let new_l : location =  {
            location: name,
            latitude: this.latitude?.value,
            longitude: this.longitude?.value
        }
        ls.push(new_l);
        const headers = {
            headers: new HttpHeaders({'Content-Type': 'application/json'})
        }
        const push = {
            key: "locationSet",
            data: ls
        }
        const promise = firstValueFrom(this.http.put(url,push, headers));
        promise.then(
            () => {
                this.dialogRef.close();
            }
        );
    } 

    get name() {
        return this.locationForm.get("name");
    }

    get latitude() {
        return this.locationForm.get("latitude");
    }

    get longitude() {
        return this.locationForm.get("longitude");
    }

}