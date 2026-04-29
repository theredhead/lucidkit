import { Component, ChangeDetectionStrategy, signal } from "@angular/core";
import { UIAvatar } from "../../avatar.component";
import { UIInput } from "../../../input/input.component";

@Component({
  selector: "ui-avatar-gravatar-demo",
  standalone: true,
  imports: [UIAvatar, UIInput],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./gravatar.story.html",
})
export class GravatarDemo {
  protected readonly email = signal("");
}
