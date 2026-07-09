import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

import { SettingsService } from '../../core/services/settings.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
  settingsForm!: FormGroup;
  isLoading = false;
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private settingsService: SettingsService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.settingsForm = this.fb.group({
      dailySpLimit: [8, [Validators.required, Validators.min(1)]],
      weeklySpLimit: [40, [Validators.required, Validators.min(1)]]
    });

    this.loadSettings();
  }

  async loadSettings() {
    this.isLoading = true;
    try {
      const response = await this.settingsService.getSettings();
      if (response.status && response.data) {
        this.settingsForm.patchValue({
          dailySpLimit: response.data.dailySpLimit,
          weeklySpLimit: response.data.weeklySpLimit
        });
      }
    } catch (error) {
      console.error('Failed to load settings', error);
      this.snackBar.open('Failed to load settings', 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
    } finally {
      this.isLoading = false;
    }
  }

  async saveSettings(): Promise<void> {
    if (this.settingsForm.invalid) {
      return;
    }

    this.isSaving = true;
    try {
      const response = await this.settingsService.updateSettings(this.settingsForm.value);
      if (response.status) {
        this.snackBar.open('Settings updated successfully', 'Close', { 
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      }
    } catch (error) {
      console.error('Failed to save settings', error);
      this.snackBar.open('Failed to save settings', 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
    } finally {
      this.isSaving = false;
    }
  }
}
