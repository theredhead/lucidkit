import { Component, ChangeDetectionStrategy, signal } from "@angular/core";

import { type AvatarSizeName, UIAvatar } from "../../avatar.component";
import { UIInput } from "../../../input/input.component";

@Component({
  selector: "ui-avatar-demo",
  standalone: true,
  imports: [UIAvatar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./default.story.html",
})
export class AvatarDemo {}
