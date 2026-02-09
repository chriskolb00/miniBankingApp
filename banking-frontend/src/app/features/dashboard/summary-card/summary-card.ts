import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-summary-card',
  imports: [CommonModule, RouterModule],
  templateUrl: './summary-card.html',
  styleUrl: './summary-card.scss',
})
export class SummaryCardComponent {
  @Input() title: string = '';
  @Input() value: string = '';
  @Input() icon: string = '';
}
