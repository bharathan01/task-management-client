import { Component, HostListener, ViewChild } from '@angular/core';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { RouterOutlet } from '@angular/router';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, HeaderComponent, MatSidenavModule],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css',
})
export class AdminLayoutComponent {
  @ViewChild('drawer') drawer!: MatSidenav;

  collapsed = false;

  isMobile = window.innerWidth < 768;

  mobileOpened = false;
 //handle the auto resize of the layout
  @HostListener('window:resize')
  onResize() {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth < 768;

    if (this.isMobile) {
      this.collapsed = false;
      this.mobileOpened = false;
      if (this.drawer) {
        this.drawer.close();
      }
    } else if (wasMobile && !this.isMobile) {
      if (this.drawer) {
        this.drawer.open();
      }
    }
  }

  toggleSidebar(drawer: MatSidenav) {
    if (this.isMobile) {
      this.mobileOpened = !this.mobileOpened;
      drawer.toggle();
    } else {
      this.collapsed = !this.collapsed;
    }
  }
}
