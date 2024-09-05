import { Component, Input, AfterViewInit, OnChanges, OnInit, SimpleChanges, ViewChild } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { MatTable, MatTableModule } from "@angular/material/table";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { ReportTableDataSource, ReportTableItem } from "./report-table-datasource";
import { NgIf } from "@angular/common";
import { deleteDialog } from "./dialog/deleteddialog.component";
import { moreInfo } from "./moreinfo/moreinfo.component";
import { MatDialog } from "@angular/material/dialog";
import { firstValueFrom } from "rxjs";
import { MapComponent } from "./map/map.component";
interface format {
    key : string,
    data : Object
}

@Component({
    selector: 'list-root',
    templateUrl: 'list.component.html',
    styleUrl: 'list.component.css',
    standalone: true,
    imports: [MapComponent,
        MatTableModule, 
        MatSortModule, 
        NgIf, 
        deleteDialog,
        moreInfo],
})

export class ListComponent implements OnChanges {
    private url : string = "https://272.selfip.net/";
    private records : string = "apps/pztgtsjgTS/collections/records/documents/";
    private md5: string = "fcab0453879a2b2281bc5073e3f5fe54";
    public data: Array<format> = [];
    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild(MatTable) table!: MatTable<ReportTableItem>;
    private dataSource : ReportTableDataSource | undefined;
    private map : MapComponent = new MapComponent();

    @Input() public event : any;

    constructor(private http : HttpClient, 
        private dialog: MatDialog) {
    }

    // ????
    /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
    displayedColumns = ['name', 'location', 'time', 'status', 'info', 'close'];
    private updateTable() {
        this.http.get(this.url+this.records).subscribe(
            data => {
            this.data = <format[]>data;
            var tableArr = [];
            for (var i in this.data) {
                tableArr.push(this.data[i].data);
            }
            this.dataSource = new ReportTableDataSource(<ReportTableItem[]>tableArr);
            this.dataSource.sort = this.sort;
            this.table.dataSource = this.dataSource;
            this.map.appendMarkers(<ReportTableItem[]>tableArr);
        },
        error => {});    
        
    }

    public generateInfoModal(id: number) {
        
        firstValueFrom(this.http.get("https://272.selfip.net/apps/pztgtsjgTS/collections/records/documents/"+id.toString()))
        .then( (result) => {
            var formatted = <format>result;
            var item = <ReportTableItem>formatted.data
            const ref = this.dialog.open(moreInfo, {
                maxWidth: 800,
                data: {
                    key : id,
                    name: item.name,
                    phone: item.phone,
                    troublemakerName: item.troublemakerName,
                    location: item.location,
                    latitude: item.latitude,
                    longitude: item.longitude,
                    url : item.url,
                    extra: item.extra,
                    formattedTime: item.formattedTime,
                    open: item.open
                }
            })

            ref.afterClosed().subscribe(() => {
                this.updateTable();
            });

        })
    }

    public handleDelete(id : number) {
        const ref = this.dialog.open(deleteDialog);
        ref.afterClosed().subscribe(
            r => {
                if (r) {
                    const promise = this.http.delete(this.url + this.records + id).toPromise();
                    promise.then(
                        () => {
                            this.updateTable();
                        }
                    )
                }
            }
        );
    }
    ngOnChanges(changes: SimpleChanges): void {
        this.updateTable();
    }

    ngAfterViewInit() : void {
        this.updateTable();
        this.map.mapInit();
    }


};