import { JsonPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, signal } from "@angular/core";

import { FormEngine } from "../../../engine/form-engine";
import type { FormSchema, FormValues } from "../../../types/form-schema.types";
import { UIForm } from "../../form.component";

const schema: FormSchema = {
  id: "vehicle-registration",
  title: "Vehicle Registration",
  description:
    "Complete this form to register your vehicle with the Department of Motor Vehicles.",
  groups: [
    {
      id: "vehicle",
      title: "Vehicle Information",
      description: "Provide details about the vehicle you are registering.",
      fields: [
        {
          id: "make",
          title: "Make",
          component: "select",
          options: [
            { label: "Audi", value: "audi" },
            { label: "BMW", value: "bmw" },
            { label: "Ford", value: "ford" },
            { label: "Honda", value: "honda" },
            { label: "Tesla", value: "tesla" },
            { label: "Toyota", value: "toyota" },
          ],
          validation: [
            { type: "required", message: "Vehicle make is required." },
          ],
        },
        {
          id: "model",
          title: "Model",
          component: "text",
          validation: [
            { type: "required", message: "Vehicle model is required." },
          ],
        },
        {
          id: "year",
          title: "Model Year",
          component: "text",
          defaultValue: "2024",
          config: { type: "number" },
          validation: [
            {
              type: "min",
              params: { min: 1980 },
              message: "Year must be 1980 or later.",
            },
            {
              type: "max",
              params: { max: 2026 },
              message: "Year cannot exceed 2026.",
            },
          ],
        },
        {
          id: "vin",
          title: "Vehicle Identification Number (VIN)",
          component: "text",
          description:
            "The 17-character VIN can be found on the dashboard or driver-side door jamb.",
          config: { textAdapter: "uppercase" },
          validation: [
            { type: "required", message: "VIN is required." },
            {
              type: "pattern",
              params: { pattern: "^[A-HJ-NPR-Z0-9]{17}$" },
              message:
                "VIN must be exactly 17 uppercase alphanumeric characters (no I, O, or Q).",
            },
          ],
        },
      ],
    },
    {
      id: "owner",
      title: "Owner Information",
      fields: [
        {
          id: "ownerFirstName",
          title: "First Name",
          component: "text",
          validation: [
            { type: "required", message: "First name is required." },
          ],
        },
        {
          id: "ownerLastName",
          title: "Last Name",
          component: "text",
          validation: [{ type: "required", message: "Last name is required." }],
        },
        {
          id: "ownerEmail",
          title: "E-mail Address",
          component: "text",
          config: { textAdapter: "email" },
          description:
            "We will send your registration confirmation to this address.",
          validation: [
            { type: "required", message: "E-mail is required." },
            { type: "email", message: "Please enter a valid e-mail address." },
          ],
        },
      ],
    },
    {
      id: "consent",
      title: "Declaration",
      fields: [
        {
          id: "agreeTerms",
          title: "I agree to the terms and conditions",
          component: "checkbox",
          validation: [
            {
              type: "required",
              message: "You must agree to the terms to continue.",
            },
          ],
        },
      ],
    },
  ],
};

@Component({
  selector: "ui-vehicle-registration-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIForm, JsonPipe],
  templateUrl: "./vehicle-registration.story.html",
  styleUrl: "./vehicle-registration.story.scss",
})
export class VehicleRegistrationStorySource {

  public readonly engine = new FormEngine(schema);

  public readonly submitted = signal<FormValues | null>(null);

  public onSubmit(values: FormValues): void {
    this.submitted.set(values);
  }
}
