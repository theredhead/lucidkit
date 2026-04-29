import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import {
  UIAvatar,
  UIBadge,
  UIButton,
  UICard,
  UICardBody,
  UICardFooter,
  UIIcon,
} from "@theredhead/lucid-kit";

interface CommunicationSuiteMeetingCardModel {
  readonly title: string;
  readonly organizer: string;
  readonly date: string;
  readonly startTime: string;
  readonly endTime: string;
  readonly type: "virtual" | "in-person" | "hybrid";
  readonly room: string;
  readonly link: string;
  readonly attendees: readonly string[];
  readonly status: "confirmed" | "tentative" | "cancelled";
  readonly recurring: boolean;
  readonly recurrence: string;
}

interface CommunicationSuiteMeetingCardIcons {
  readonly clock: string;
  readonly user: string;
  readonly mapPin: string;
  readonly link: string;
  readonly calendarDays: string;
  readonly video: string;
}

@Component({
  selector: "ui-communication-suite-meeting-card",
  standalone: true,
  imports: [
    UIAvatar,
    UIBadge,
    UIButton,
    UICard,
    UICardBody,
    UICardFooter,
    UIIcon,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./communication-suite-meeting-card.component.html",
  styleUrl: "./communication-suite-meeting-card.component.scss",
})
export class UICommunicationSuiteMeetingCard {
  /**
   * The meeting record to render.
   */
  public readonly meeting =
    input.required<CommunicationSuiteMeetingCardModel>();

  /**
   * The icon set used by the card.
   */
  public readonly icons = input.required<CommunicationSuiteMeetingCardIcons>();

  /**
   * The badge color for the meeting type.
   */
  public readonly typeColor = input.required<string>();

  /**
   * The badge color for the meeting status.
   */
  public readonly statusColor = input.required<string>();
}
