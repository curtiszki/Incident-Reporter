import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { FormBuilder, FormGroup, FormControl, NgForm, FormGroupDirective } from "@angular/forms";
import {FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { NgIf } from "@angular/common";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { MatOptionModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { MatDialog } from "@angular/material/dialog";
import { locationModal } from "./locationmodal/locationmodal.component";
import { firstValueFrom } from "rxjs";

interface location {
    location : string,
    latitude : number,
    longitude: number
}
interface keySet {
    key: string,
    data: location[]
}

@Component({
    selector: 'form-root',
    templateUrl: 'informationform.component.html',
    styleUrl: 'informationform.component.css',
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatButtonModule,
        NgIf,
        MatOptionModule,
        MatSelectModule
    ]
})

export class InformationFormComponent implements OnInit {
    nuisanceForm !: FormGroup;
    private baseURL = "https://272.selfip.net/apps/pztgtsjgTS/";
    public setLatitude : number = 0;
    public setLongitude : number = 0;
    public invalidForm : boolean = false;
    protected locationSet :location[] = [];
    constructor(private formBuilder: FormBuilder, 
        private http : HttpClient,
        private dialog: MatDialog
        ) {}

    @Output() submitValid : EventEmitter<any> = new EventEmitter<any>();
    
    stringNotEmpty(s: FormControl) {
        if (s.value == null) {
            return null;
        }
        var trimmed : string = <string>s.value;
        if (trimmed.trim().length == 0)
            return {invalidString: trimmed}
        return null;
    }
    revealForm(thisForm: HTMLFormElement) : void {
        if(thisForm.classList.contains("hidden")) {
            thisForm.classList.remove("hidden");
        }
    }
    hideForm(thisForm:HTMLFormElement, formDir: FormGroupDirective) {
        thisForm.classList.add("hidden");
        formDir.resetForm();
        window.scrollTo(thisForm.scrollLeft, thisForm.scrollTop);
    }
    ngOnInit(): void {
        
        this.nuisanceForm =this.formBuilder.group({
            name: ['',[
                Validators.required,
                this.stringNotEmpty,
                Validators.pattern('^[A-Za-z\_\\s\\-]+$')
            ]],
            phone: ['',[
                Validators.required,
                Validators.pattern('^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$')
            ]],
            troublemakerName: ['', [
                Validators.required,
                this.stringNotEmpty,
                Validators.pattern('^[A-Za-z\_\\s\\-]+$')
            ]],
            location: ['', [
                Validators.required,
                this.stringNotEmpty,
                Validators.pattern('^[A-Za-z\_\\s\\-]+$')
            ]],
            latitude: ['', [
                //Validators.required,
                //this.latitudeBoundsValidation
            ]],
            longitude: ['', [
                //Validators.required,
                //this.longitudeBoundsValidation
            ]],
            picture: ['', [
            ]],
            extraInfo: ['', [
                
            ]]
        });
        this.tryLocationUpdate();
    }
    updateLocation(location: location) {
        this.setLongitude = location.longitude;
        this.setLatitude = location.latitude;
    }
    tryLocationUpdate(): void {
        // get the location values
        firstValueFrom(this.http.get(this.baseURL+"collections/locations/documents/locationSet"))
            .then(
                (result) => {
                    const data = <keySet>result;
                    const string = JSON.stringify(data.data);
                    this.locationSet = JSON.parse(string);

                },
                async (error) => {
                    await this.delay(1500);
                    this.tryLocationUpdate();
                }
            )
    }

    async delay(time : number) {
        return new Promise(resolve => {
            setTimeout(resolve, time);
        })
    }
    get name() {
        return this.nuisanceForm.get('name');
    }
    get troublemakerName() {
        return this.nuisanceForm.get('troublemakerName');
    }
    get phone() {
        return this.nuisanceForm.get('phone');
    }
    get longitude() {
        return this.nuisanceForm.get('longitude');
    }
    get latitude() {
        return this.nuisanceForm.get('latitude');
    }

    get location() {
        return this.nuisanceForm.get('location');
    }
    onSubmit(thisForm : FormGroupDirective):void {
        if (!this.nuisanceForm.valid) {
            this.invalidForm = true;
            return;
        }
        if(this.nuisanceForm.valid) {
        this.invalidForm = false;
        var shorthand = this.nuisanceForm;
        var key = 0;

        this.http.get(this.baseURL+"collections/records/documents/").subscribe(data=> {
            var c = <[]>data;
            const date = new Date();
            key = date.getTime();
            var obj : Object = {
                key : key,
                name : shorthand.get('name')?.value.trim(),
                phone: shorthand.get('phone')?.value,
                troublemakerName: shorthand.get('troublemakerName')?.value.trim(),
                location: shorthand.get('location')?.value.trim(),
                latitude: this.setLatitude,
                longitude: this.setLongitude,
                url: shorthand.get('picture')?.value?.trim(),
                extra: shorthand.get('extraInfo')?.value?.trim(),
                formattedTime: date.toLocaleString(),
                open: true
            }

            // sort by troublemaker name

            // see if the troublemaker exists
            var postObj = {
                "key": key,
                "data": obj
            }
            const headers = {
                headers: new HttpHeaders({'Content-Type': 'application/json'})
            }
            const promise = this.http.post(this.baseURL+"collections/records/documents/", JSON.stringify(postObj), headers)
                .toPromise();
            promise.then(
                (r) => {
                    this.submitValid.emit(key);
                }
            )                
            
            thisForm.resetForm();
            })
        }

    };

    addNewLocation(): void {
        const ref = this.dialog.open(locationModal, {
            maxWidth: 800,
            data: {
                locationSet : this.locationSet
            }
        });
        
    }
}
