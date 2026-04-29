import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { UIAnalogClock } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-world-clocks',
  standalone: true,
  imports: [UIAnalogClock],
  template: \`…\`,
})
export class WorldClocksComponent implements OnInit, OnDestroy {
  zones = [
    { label: 'London',   offset:  0, time: signal(this.offset(0)) },
    { label: 'New York', offset: -5, time: signal(this.offset(-5)) },
    { label: 'Tokyo',    offset:  9, time: signal(this.offset(9)) },
    { label: 'Sydney',   offset: 11, time: signal(this.offset(11)) },
  ];

  private id: ReturnType<typeof setInterval> | null = null;

  ngOnInit() {
    this.id = setInterval(() => {
      for (const z of this.zones) z.time.set(this.offset(z.offset));
    }, 1000);
  }

  ngOnDestroy() {
    if (this.id) clearInterval(this.id);
  }

  private offset(h: number): Date {
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60_000;
    return new Date(utc + h * 3_600_000);
  }
}
