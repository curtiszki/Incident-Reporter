import { AfterViewInit, Component, ViewEncapsulation } from '@angular/core';
import * as L from 'leaflet';
import {Injectable} from '@angular/core';
import { ListComponent } from '../list.component';
import { ReportTableItem } from '../report-table-datasource';
import { Icon } from 'leaflet';
import { keyframes } from '@angular/animations';
interface marked {
  count: number,
  latitude : number,
  longitude: number
}

@Component({
  selector: 'map-root',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  standalone: true,
  encapsulation: ViewEncapsulation.None
})

export class MapComponent {
  private centre: L.LatLngTuple = [49.2771, -122.9236];
  private zoom: number = 11;
  // it complains otherwise
  public map: any = L.map;
  public increment: number = 0;
  private markerMap: Map<string, marked> = new Map<string, marked>();
  private markerSet : L.Marker[] = [];
  private marker = new Icon({
    iconUrl: 'assets/marker-icon.png',
    iconRetinaUrl: 'assets/marker-icon.png',
    iconSize:    [21, 36],
    iconAnchor:  [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'assets/marker-shadow.png',
    shadowSize:  [21, 21]
  })
  constructor() { }

  public mapInit():void {
    document.querySelectorAll('.map').forEach(element => {
      var newMap = document.createElement('div');
      newMap.id='map-'+this.increment;
      newMap.classList.add('map-frame');
      element.appendChild(newMap);
      this.map = L.map('map-'+this.increment, {
        center: this.centre,
        zoom: this.zoom,
        maxZoom: 19
      })
  
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(this.map);

    });
    this.increment++;
  }

  public appendMarkers(locations : ReportTableItem[]): void {  
    while (this.markerSet.length > 0) {
      this.markerSet.pop()?.remove();
    }
    for (let i = 0; i < locations.length; i++) {
      let location = locations[i].location;
      if (this.markerMap.has(location)) {
        let map = this.markerMap.get(location);
        if (map) {
          map.count += 1;
        }
      }
      else {
        let marked : marked = {
            count : 1,
            latitude: locations[i].latitude,
            longitude: locations[i].longitude
          }
          this.markerMap.set(location, marked);
      }
    }
    this.markerMap.forEach((entry, key) => {
      const marker = L.marker([entry.latitude, entry.longitude], {
        icon: this.marker,
        title: key
      })
      this.markerSet.push(marker);
      if (entry.count > 1) {
        marker.bindPopup(`
          <div class="popup">
            <h5>${key}</h5>
            <p>${entry.count} nuisance reports.</p>
          </div>
        `);
      }
      else {
        marker.bindPopup(`
          <div class="popup">
            <h5>${key}</h5>
            <p>${entry.count} nuisance report.</p>
          </div>
        `);
      }
      marker.addTo(this.map);
    })

    this.markerMap.clear();
  }

  public addMarker(latitude: number, longitude: number, location: string, count: number): void {
  }
  /*
  ngAfterViewInit(): void {
    this.mapInit();
  }
  */

}