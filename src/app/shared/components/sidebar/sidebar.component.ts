import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { SIDEBAR_MENU } from '../../../core/constants/sidebar-menu';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatListModule, MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  host: {
    '[class.collapsed]': 'collapsed',
  },
})
export class SidebarComponent {
  @Input()
  collapsed = false;

  menus = SIDEBAR_MENU;
}
