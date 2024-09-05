import { Component, OnInit } from "@angular/core";
import { InformationFormComponent } from "./informationform/informationform.component";
import { ListComponent } from "./list/list.component";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
@Component({
    selector: 'information',
    templateUrl: './information.component.html',
    styleUrls: ['./information.component.css'],
    standalone: true,
    imports: [
        ListComponent,
        InformationFormComponent,
    ]
  })
export class InformationComponent implements OnInit{
  private baseURL = " https://272.selfip.net/apps/pztgtsjgTS/";
  private recordCol = "records/";
  public event: any;
  constructor(private http: HttpClient){}

  public caught(event: any): void {
    this.event = event;
  }

  ngOnInit(): void {
        this.http.get(this.baseURL+"collections/"+this.recordCol, {observe: 'response'})
        .subscribe({
          error : (e) => {
            var obj = {
              "key": "records",
              "readers": null,
              "writers": null
            }
            firstValueFrom(
            this.http.post(this.baseURL+"collections/", obj)
            )
            .then(
              () => {
                var obj = {
                  "key": "locations",
                  "readers": null,
                  "writers": null
                }
                firstValueFrom(this.http.post(this.baseURL+"collections/", obj))
                .then(
                  ()=> {
                  // intialize a locationSet record to contain records
                  // easier than processing in memory
                  var annacis = {
                    location: "Annacis Island",
                    latitude: "49.170367",
                    longitude: "-122.947659"
                  }
                  var westham = {
                    location: "Westham Island",
                    latitude: "49.085226",
                    longitude: "-123.160688"
                  }
                  var locationSet = {
                    key: "locationSet",
                    data: [
                      annacis,
                      westham
                    ]
                  }
                  this.http.post(this.baseURL+"collections/locations/documents/", locationSet).subscribe(
                  );
                  })
              }
            )
          }
        })
    }
}