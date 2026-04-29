import { Component, ChangeDetectionStrategy } from "@angular/core";
import { UIAvatar } from "../../avatar.component";

@Component({
  selector: "ui-avatar-demo",
  standalone: true,
  imports: [UIAvatar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./default.story.html",
})
export class AvatarDemo {}
