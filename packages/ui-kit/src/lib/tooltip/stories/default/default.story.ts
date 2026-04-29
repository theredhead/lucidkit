import { Component } from '@angular/core';
import { UITooltip } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-tooltip-demo',
  standalone: true,
  imports: [UITooltip],
  templateUrl: './tooltip-demo.component.html',
  styleUrl: './tooltip-demo.component.scss',
})
export class TooltipDemoComponent {}
