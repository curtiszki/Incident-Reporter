import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InformationComponent } from '../information/information.component';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { deleteDialog } from '../information/list/dialog/deleteddialog.component';
import { MapComponent } from '../information/list/map/map.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MapComponent,
    InformationComponent,
    HttpClientModule,
    MatDialogModule
  ],
  providers: [
    {
      provide: MatDialogRef,
      useValue: {}
    },
    deleteDialog
  ]
})
export class AppComponent {
  title = 'Troublemaker Reporting Service';
  description = 'Find information about, or report troublemakers here. Valid issues will be addressed by the Night Crusade Titans.'
}
