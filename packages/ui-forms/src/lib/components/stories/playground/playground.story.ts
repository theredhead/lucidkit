import { JsonPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, effect, input, signal } from "@angular/core";
import { UIForm } from "../../form.component";
import { FormEngine } from "../../../engine/form-engine";
import type { FormSchema, FormValues } from "../../../types/form-schema.types";

// ── Schemas ──────────────────────────────────────────────────────────

const contactSchema: FormSchema = {
  id: "contact",
  title: "Contact Form",
  description: "Fill in your details and we will get back to you.",
  groups: [
    {
      id: "personal",
      title: "Personal Information",
      fields: [
        {
          id: "firstName",
          title: "First Name",
          component: "text",
          validation: [{ type: "required" }],
        },
        {
          id: "lastName",
          title: "Last Name",
          component: "text",
          validation: [{ type: "required" }],
        },
        {
          id: "email",
          title: "E-mail",
          component: "text",
          description: "We'll never share your email with anyone.",
          config: { textAdapter: "email" },
          validation: [{ type: "required" }, { type: "email" }],
        },
      ],
    },
    {
      id: "message",
      title: "Your Message",
      fields: [
        {
          id: "subject",
          title: "Subject",
          component: "select",
          config: {
            options: [
              { label: "General inquiry", value: "general" },
              { label: "Bug report", value: "bug" },
              { label: "Feature request", value: "feature" },
            ],
          },
          validation: [{ type: "required" }],
        },
        {
          id: "body",
          title: "Message",
          component: "text",
          config: { multiline: true, rows: 4 },
          validation: [
            { type: "required" },
            { type: "minLength", params: { min: 10 } },
          ],
        },
      ],
    },
  ],
};

const conditionalSchema: FormSchema = {
  id: "conditional",
  title: "Conditional Fields Demo",
  description: "Fields appear and disappear based on your choices.",
  groups: [
    {
      id: "main",
      title: "Preferences",
      fields: [
        {
          id: "contactMethod",
          title: "Preferred Contact Method",
          component: "select",
          config: {
            options: [
              { label: "Email", value: "email" },
              { label: "Phone", value: "phone" },
              { label: "Post", value: "post" },
            ],
          },
          validation: [{ type: "required" }],
        },
        {
          id: "emailAddress",
          title: "E-mail Address",
          component: "text",
          config: { textAdapter: "email" },
          visibleWhen: {
            field: "contactMethod",
            operator: "equals",
            value: "email",
          },
          validation: [{ type: "required" }, { type: "email" }],
        },
        {
          id: "phone",
          title: "Phone Number",
          component: "text",
          config: { textAdapter: "phone" },
          visibleWhen: {
            field: "contactMethod",
            operator: "equals",
            value: "phone",
          },
          validation: [{ type: "required" }],
        },
        {
          id: "address",
          title: "Postal Address",
          component: "text",
          visibleWhen: {
            field: "contactMethod",
            operator: "equals",
            value: "post",
          },
          validation: [{ type: "required" }],
        },
        {
          id: "newsletter",
          title: "Subscribe to newsletter",
          component: "toggle",
        },
        {
          id: "frequency",
          title: "Newsletter frequency",
          component: "select",
          visibleWhen: {
            field: "newsletter",
            operator: "equals",
            value: true,
          },
          config: {
            options: [
              { label: "Daily", value: "daily" },
              { label: "Weekly", value: "weekly" },
              { label: "Monthly", value: "monthly" },
            ],
          },
        },
      ],
    },
  ],
};

const wizardSchema: FormSchema = {
  id: "wizard",
  title: "Account Setup Wizard",
  description: "Complete all steps to create your account.",
  groups: [
    {
      id: "account",
      title: "Account",
      description: "Choose a username and password.",
      fields: [
        {
          id: "username",
          title: "Username",
          component: "text",
          validation: [
            { type: "required" },
            {
              type: "minLength",
              params: { min: 3 },
              message: "Username must be at least 3 characters.",
            },
          ],
        },
        {
          id: "password",
          title: "Password",
          component: "text",
          config: { type: "password" },
          validation: [
            { type: "required" },
            {
              type: "minLength",
              params: { min: 8 },
              message: "Password must be at least 8 characters.",
            },
          ],
        },
      ],
    },
    {
      id: "profile",
      title: "Profile",
      description: "Tell us about yourself.",
      fields: [
        {
          id: "displayName",
          title: "Display Name",
          component: "text",
          validation: [{ type: "required" }],
        },
        {
          id: "favoriteColor",
          title: "Favorite Color",
          component: "color",
        },
      ],
    },
    {
      id: "notifications",
      title: "Notifications",
      description: "Configure how you want to be notified.",
      fields: [
        {
          id: "emailNotifs",
          title: "Email notifications",
          component: "toggle",
          defaultValue: true,
        },
        {
          id: "pushNotifs",
          title: "Push notifications",
          component: "toggle",
        },
        {
          id: "digestFrequency",
          title: "Digest Frequency",
          component: "select",
          config: {
            options: [
              { label: "Real-time", value: "realtime" },
              { label: "Hourly", value: "hourly" },
              { label: "Daily", value: "daily" },
            ],
          },
          defaultValue: "daily",
        },
      ],
    },
  ],
};

const validationSchema: FormSchema = {
  id: "validation",
  title: "Validation Demo",
  description: "Try submitting with empty fields to see validation messages.",
  groups: [
    {
      id: "main",
      title: "All Validators",
      fields: [
        {
          id: "required",
          title: "Required Field",
          component: "text",
          validation: [{ type: "required" }],
        },
        {
          id: "email",
          title: "Email (with custom message)",
          component: "text",
          config: { textAdapter: "email" },
          validation: [
            { type: "required" },
            {
              type: "email",
              message: "Please enter a valid email address.",
            },
          ],
        },
        {
          id: "minmax",
          title: "Text (3–20 chars)",
          component: "text",
          validation: [
            { type: "minLength", params: { min: 3 } },
            { type: "maxLength", params: { max: 20 } },
          ],
        },
        {
          id: "age",
          title: "Age (18–120)",
          component: "slider",
          defaultValue: 0,
          config: { min: 0, max: 150 },
          validation: [
            { type: "min", params: { min: 18 } },
            { type: "max", params: { max: 120 } },
          ],
        },
        {
          id: "pattern",
          title: "Uppercase only",
          component: "text",
          validation: [
            {
              type: "pattern",
              params: { pattern: "^[A-Z]+$" },
              message: "Only uppercase letters are allowed.",
            },
          ],
        },
      ],
    },
  ],
};

const vehicleRegistrationSchema: FormSchema = {
  id: "vehicle-registration",
  title: "Vehicle Registration",
  description:
    "Complete this form to register your vehicle with the Department of Motor Vehicles.",
  groups: [
    {
      id: "intro",
      title: "Welcome",
      fields: [
        {
          id: "intro-text",
          title: "",
          component: "flair:richtext",
          config: {
            content:
              "<h3>Vehicle Registration Application</h3>" +
              "<p>Please complete all sections of this form accurately. " +
              "Fields marked with an asterisk are mandatory. You will need your " +
              "Vehicle Identification Number (VIN), proof of insurance, and a valid " +
              "form of identification to complete this registration.</p>" +
              "<p><strong>Processing time:</strong> 5–10 business days after submission.</p>",
          },
        },
        {
          id: "intro-image",
          title: "",
          component: "flair:image",
          config: {
            src: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80",
            alt: "A vehicle on the road",
            width: 800,
            height: 240,
          },
        },
      ],
    },
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
            { label: "Chevrolet", value: "chevrolet" },
            { label: "Ford", value: "ford" },
            { label: "Honda", value: "honda" },
            { label: "Hyundai", value: "hyundai" },
            { label: "Mercedes-Benz", value: "mercedes" },
            { label: "Nissan", value: "nissan" },
            { label: "Tesla", value: "tesla" },
            { label: "Toyota", value: "toyota" },
            { label: "Volkswagen", value: "vw" },
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
          id: "bodyType",
          title: "Body Type",
          component: "radio",
          options: [
            { label: "Sedan", value: "sedan" },
            { label: "SUV", value: "suv" },
            { label: "Truck", value: "truck" },
            { label: "Coupe", value: "coupe" },
            { label: "Hatchback", value: "hatchback" },
            { label: "Convertible", value: "convertible" },
            { label: "Van", value: "van" },
          ],
          validation: [
            { type: "required", message: "Please select a body type." },
          ],
        },
        {
          id: "color",
          title: "Exterior Color",
          component: "color",
          defaultValue: "#1a1a2e",
          config: { initialMode: "named", availableModes: ["named"] },
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
        {
          id: "mileage",
          title: "Current Odometer Reading (km)",
          component: "text",
          config: { type: "number", textAdapter: "integer" },
          validation: [
            { type: "required", message: "Odometer reading is required." },
          ],
        },
      ],
    },
    {
      id: "owner",
      title: "Owner Information",
      description: "Provide details about the registered owner of the vehicle.",
      fields: [
        {
          id: "salutation",
          title: "Title",
          component: "select",
          options: [
            { label: "Mr.", value: "mr" },
            { label: "Mrs.", value: "mrs" },
            { label: "Ms.", value: "ms" },
            { label: "Dr.", value: "dr" },
            { label: "Prof.", value: "prof" },
          ],
        },
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
          id: "dateOfBirth",
          title: "Date of Birth",
          component: "date",
          validation: [
            { type: "required", message: "Date of birth is required." },
          ],
        },
        {
          id: "ownerEmail",
          title: "E-mail Address",
          component: "text",
          config: { type: "email", textAdapter: "email" },
          description:
            "We will send your registration confirmation to this address.",
          validation: [
            { type: "required", message: "E-mail is required." },
            { type: "email", message: "Please enter a valid e-mail address." },
          ],
        },
        {
          id: "ownerPhone",
          title: "Phone Number",
          component: "text",
          config: { type: "tel", textAdapter: "phone" },
          validation: [
            { type: "required", message: "Phone number is required." },
          ],
        },
        {
          id: "ownerAddress",
          title: "Street Address",
          component: "text",
          config: { multiline: true, rows: 3 },
          validation: [
            { type: "required", message: "Address is required." },
            {
              type: "minLength",
              params: { min: 10 },
              message: "Please provide a complete street address.",
            },
          ],
        },
      ],
    },
    {
      id: "registration",
      title: "Registration Details",
      fields: [
        {
          id: "registrationType",
          title: "Registration Type",
          component: "select",
          options: [
            { label: "New Registration", value: "new" },
            { label: "Renewal", value: "renewal" },
            { label: "Transfer of Ownership", value: "transfer" },
            { label: "Replacement (Lost/Stolen)", value: "replacement" },
          ],
          validation: [
            { type: "required", message: "Please select a registration type." },
          ],
        },
        {
          id: "previousPlate",
          title: "Previous Licence Plate Number",
          component: "text",
          description: "Required for renewals and transfers.",
          config: { textAdapter: "uppercase" },
          visibleWhen: {
            field: "registrationType",
            operator: "in",
            value: ["renewal", "transfer"],
          },
          validation: [
            { type: "required", message: "Previous plate number is required." },
          ],
        },
        {
          id: "startDate",
          title: "Registration Start Date",
          component: "date",
          validation: [
            { type: "required", message: "Start date is required." },
          ],
        },
        {
          id: "durationMonths",
          title: "Registration Duration (months)",
          component: "slider",
          defaultValue: 12,
          config: { min: 6, max: 60, step: 6 },
        },
        {
          id: "hasInsurance",
          title: "I have valid vehicle insurance",
          component: "toggle",
          defaultValue: false,
        },
        {
          id: "insuranceCompany",
          title: "Insurance Company",
          component: "text",
          visibleWhen: {
            field: "hasInsurance",
            operator: "equals",
            value: true,
          },
          validation: [
            {
              type: "required",
              message: "Insurance company name is required.",
            },
          ],
        },
        {
          id: "insurancePolicyNo",
          title: "Policy Number",
          component: "text",
          config: { textAdapter: "uppercase" },
          visibleWhen: {
            field: "hasInsurance",
            operator: "equals",
            value: true,
          },
          validation: [
            { type: "required", message: "Policy number is required." },
          ],
        },
        {
          id: "vanityPlate",
          title: "Request a personalised plate",
          component: "toggle",
          defaultValue: false,
        },
        {
          id: "vanityPlateText",
          title: "Desired Plate Text",
          component: "text",
          description:
            "2–7 characters, letters and numbers only. Subject to availability.",
          config: { textAdapter: "uppercase" },
          visibleWhen: {
            field: "vanityPlate",
            operator: "equals",
            value: true,
          },
          validation: [
            {
              type: "required",
              message: "Please enter your desired plate text.",
            },
            {
              type: "pattern",
              params: { pattern: "^[A-Z0-9]{2,7}$" },
              message: "Plate text must be 2–7 uppercase letters or digits.",
            },
          ],
        },
      ],
    },
    {
      id: "documents",
      title: "Supporting Documents",
      fields: [
        {
          id: "docs-info",
          title: "",
          component: "flair:richtext",
          config: {
            content:
              "<p>Upload scanned copies of the following documents:</p>" +
              "<ul>" +
              "<li>Proof of identity (passport or driving licence)</li>" +
              "<li>Proof of address (utility bill dated within the last 3 months)</li>" +
              "<li>Vehicle inspection certificate</li>" +
              "<li>Proof of insurance (if applicable)</li>" +
              "</ul>",
          },
        },
        {
          id: "documentUpload",
          title: "Upload Documents",
          component: "file",
          description: "Accepted formats: PDF, JPG, PNG. Max 10 MB per file.",
          config: { multiple: true },
        },
        {
          id: "additionalNotes",
          title: "Additional Notes",
          component: "richtext",
          description: "Any special circumstances or additional information.",
        },
      ],
    },
    {
      id: "consent",
      title: "Declaration & Consent",
      fields: [
        {
          id: "consent-notice",
          title: "",
          component: "flair:richtext",
          config: {
            content:
              "<p><em>By submitting this application, you declare that all information " +
              "provided is true and accurate to the best of your knowledge. False or " +
              "misleading information may result in the rejection of your application " +
              "and/or legal penalties.</em></p>",
          },
        },
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
        {
          id: "agreePrivacy",
          title: "I consent to the processing of my personal data",
          component: "checkbox",
          validation: [
            { type: "required", message: "Privacy consent is required." },
          ],
        },
        {
          id: "emailUpdates",
          title: "Send me registration status updates via e-mail",
          component: "toggle",
          defaultValue: true,
        },
      ],
    },
  ],
};

/** Lookup table for the Playground schema selector. */
const schemas: Record<string, FormSchema> = {
  contact: contactSchema,
  conditional: conditionalSchema,
  wizard: wizardSchema,
  validation: validationSchema,
  "vehicle-registration": vehicleRegistrationSchema,
};

/**
 * Playground wrapper — rebuilds the `FormEngine` reactively when
 * the schema selector changes and forwards all UIForm inputs.
 */
@Component({
  selector: "ui-story-playground",
  standalone: true,
  imports: [JsonPipe, UIForm],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./playground.story.html",
  styles: `
    :host {
      display: block;
      max-width: 640px;
    }
    .live-panel {
      margin-top: 20px;
      border-top: 1px dashed rgba(128, 128, 128, 0.3);
      padding-top: 12px;
    }
    .live-heading {
      margin: 0 0 4px;
      font-size: 0.8125rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      opacity: 0.6;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .live-badge {
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: none;
      letter-spacing: 0;
      padding: 1px 8px;
      border-radius: 10px;
      background: rgba(186, 26, 26, 0.15);
      color: #ba1a1a;
    }
    .live-badge--valid {
      background: rgba(56, 142, 60, 0.15);
      color: #388e3c;
    }
    .live-json {
      margin: 0;
      padding: 12px;
      border-radius: 8px;
      background: rgba(0, 0, 0, 0.15);
      color: #90caf9;
      font-size: 0.8125rem;
      overflow: auto;
      max-height: 300px;
    }
    .output-heading {
      margin: 16px 0 0;
      font-size: 0.8125rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      opacity: 0.5;
    }
    .output {
      margin-top: 4px;
      padding: 12px;
      border-radius: 8px;
      background: rgba(0, 0, 0, 0.3);
      color: #81c784;
      font-size: 0.8125rem;
      overflow: auto;
    }
  `,
})
export class StoryPlayground {
  public readonly schema = input<string>("contact");
  public readonly submitLabel = input<string>("Submit");
  public readonly showSubmit = input<boolean>(true);

  public readonly engine = computed(
    () => new FormEngine(schemas[this.schema()] ?? contactSchema),
  );

  public readonly liveOutput = computed(() => this.engine().output()());

  public submitted = signal<FormValues | null>(null);

  public constructor() {
    /* Reset submitted output when the schema changes. */
    effect(() => {
      this.schema();
      this.submitted.set(null);
    });
  }

  public onSubmit(values: FormValues): void {
    this.submitted.set(values);
  }
}
