import { UIGauge } from "../../gauge.component";
import type { GaugeZone } from "../../gauge.types";
import { AnalogGaugeStrategy } from "../../strategies/analog-gauge.strategy";
import { VuMeterStrategy } from "../../strategies/vu-meter.strategy";
import { DigitalGaugeStrategy } from "../../strategies/digital-gauge.strategy";

import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  signal,
} from "@angular/core";

@Component({
  selector: "ui-interactive-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIGauge],
  templateUrl: "./interactive.story.html",
  styleUrl: "./interactive.story.scss",
})
export class InteractiveStorySource implements OnDestroy {
  protected readonly analog = new AnalogGaugeStrategy();
  protected readonly vu = new VuMeterStrategy();
  protected readonly digital = new DigitalGaugeStrategy();

  protected readonly speed = signal(72);
  protected readonly usingMic = signal(false);
  protected readonly micError = signal<string | null>(null);

  protected readonly zones: readonly GaugeZone[] = [
    { from: 0, to: 80, color: "#34a853", label: "Safe" },
    { from: 80, to: 140, color: "#fbbc04", label: "Caution" },
    { from: 140, to: 220, color: "#ea4335", label: "Danger" },
  ];

  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private micStream: MediaStream | null = null;
  private animFrameId: number | null = null;

  public ngOnDestroy(): void {
    this.stopMic();
  }

  protected onSliderChange(event: Event): void {
    this.speed.set(Number((event.target as HTMLInputElement).value));
  }

  protected async toggleMic(): Promise<void> {
    if (this.usingMic()) {
      this.stopMic();
      return;
    }
    try {
      this.micStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      this.audioCtx = new AudioContext();
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 256;
      this.audioCtx
        .createMediaStreamSource(this.micStream)
        .connect(this.analyser);
      this.micError.set(null);
      this.usingMic.set(true);
      this.pollMic();
    } catch {
      this.micError.set("Microphone access denied.");
    }
  }

  private pollMic(): void {
    if (!this.analyser) return;
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    const tick = (): void => {
      if (!this.analyser) return;
      this.analyser.getByteFrequencyData(data);
      const rms = Math.sqrt(data.reduce((s, v) => s + v * v, 0) / data.length);
      this.speed.set(Math.round((rms / 128) * 220));
      this.animFrameId = requestAnimationFrame(tick);
    };
    this.animFrameId = requestAnimationFrame(tick);
  }

  private stopMic(): void {
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    this.analyser = null;
    if (this.audioCtx) {
      void this.audioCtx.close();
      this.audioCtx = null;
    }
    this.micStream?.getTracks().forEach((t) => t.stop());
    this.micStream = null;
    this.usingMic.set(false);
  }
}
