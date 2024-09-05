import { DataSource } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';

// TODO: Replace this with your own data model type
export interface ReportTableItem {
  key : string,
  name : string,
  phone: string,
  troublemakerName: string,
  location: string,
  latitude: number,
  longitude: number,
  url: string,
  extra: string,
  formattedTime: string,
  open: boolean
}

/**
 * Data source for the ReportTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class ReportTableDataSource extends DataSource<ReportTableItem> {
  data: ReportTableItem[] = [];
  sort: MatSort | undefined;

  constructor(itemset: ReportTableItem[]) {
    super();
    this.data = itemset;
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<ReportTableItem[]> {
    if (this.sort) {
      // Combine everything that affects the rendered data into one update
      // stream for the data-table to consume.
      return merge(observableOf(this.data), this.sort.sortChange)
        .pipe(map(() => {
          return this.getSortedData([...this.data ]);
        }));
    } else {
      throw Error('Please set sort on the data source before connecting.');
    }
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect(): void {}

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: ReportTableItem[]): ReportTableItem[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';
      switch (this.sort?.active) {
        case 'name': return compareString(a.troublemakerName, b.troublemakerName, isAsc);
        case 'location': return compareString(a.location, b.location, isAsc);
        case 'time': return compareTime(a.formattedTime, b.formattedTime, isAsc);
        case 'status': return compareBoolean(a.open, isAsc);
        default: return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compareNumber(a: number, b: number, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

function compareBoolean(a: boolean, isAsc: boolean) {
  return (a ? -1 : 1) * (isAsc ? 1 : -1);
}
function compareString(a: string, b: string, isAsc: boolean): number {
  return a.toString().localeCompare(b.toString()) * (isAsc ? 1 : -1);
}
function compareTime(a: string, b: string, isAsc: boolean): number {
  return (new Date(b).getTime() - new Date(a).getTime()) * (isAsc ? 1 : -1);
}