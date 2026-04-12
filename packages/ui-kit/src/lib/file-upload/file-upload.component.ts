import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  model,
  output,
  signal,
  viewChild,
} from "@angular/core";
import { UISurface, UI_DEFAULT_SURFACE_TYPE } from "@theredhead/lucid-foundation";

/** A single file entry tracked by the upload component. */
export interface UIFileEntry {

  /** The native File object. */
  readonly file: File;

  /** Unique id for tracking. */
  readonly id: string;
}

/**
 * File-upload component providing a click-to-browse button **and** a
 * drag-and-drop zone.
 *
 * Selected files are exposed via the two-way `files` model signal
 * and emitted individually through `fileAdded` / `fileRemoved`.
 *
 * @example
 * ```html
 * <ui-file-upload
 *   accept="image/*"
 *   [multiple]="true"
 *   [(files)]="selectedFiles"
 *   (fileAdded)="onFile($event)"
 * />
 * ```
 */
@Component({
  selector: "ui-file-upload",
  standalone: true,
  templateUrl: "./file-upload.component.html",
  styleUrl: "./file-upload.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: UISurface, inputs: ["surfaceType"] }],
  providers: [{ provide: UI_DEFAULT_SURFACE_TYPE, useValue: "input" }],
  host: {
    class: "ui-file-upload",
    "[class.dragging]": "isDragging()",
    "[class.disabled]": "disabled()",
  },
})
export class UIFileUpload {
  // ── Inputs ───────────────────────────────────────────────────────

  /** Comma-separated MIME types or extensions (forwarded to the native input). */
  public readonly accept = input<string>("");

  /** Whether multiple files may be selected at once. */
  public readonly multiple = input(false);

  /** Whether the component is disabled. */
  public readonly disabled = input(false);

  /** Maximum file size in bytes. Files exceeding this are rejected. */
  public readonly maxFileSize = input<number | undefined>(undefined);

  /** Accessible label for the hidden file input. */
  public readonly ariaLabel = input<string>("Upload file");

  /** Label text shown inside the drop zone. */
  public readonly label = input<string>("Drop files here or click to browse");

  // ── Model ────────────────────────────────────────────────────────

  /** Two-way binding for the current list of selected file entries. */
  public readonly files = model<readonly UIFileEntry[]>([]);

  // ── Outputs ──────────────────────────────────────────────────────

  /** Emitted when a file passes validation and is added. */
  public readonly fileAdded = output<UIFileEntry>();

  /** Emitted when a file is removed by the user. */
  public readonly fileRemoved = output<UIFileEntry>();

  /** Emitted when a file is rejected (wrong type or too large). */
  public readonly fileRejected = output<{ file: File; reason: string }>();

  // ── Queries ──────────────────────────────────────────────────────

  /** @internal */
  protected readonly fileInput =
    viewChild<ElementRef<HTMLInputElement>>("fileInputRef");

  // ── Computed ─────────────────────────────────────────────────────

  /** Human-readable summary of selected files. */
  public readonly fileCount = computed(() => this.files().length);

  // ── Internal state ───────────────────────────────────────────────

  /** @internal */
  protected readonly isDragging = signal(false);

  /** Counter to track nested dragenter/dragleave pairs. */
  private dragCounter = 0;

  // ── Public methods ───────────────────────────────────────────────

  /** Programmatically open the file browser. */
  public browse(): void {
    if (this.disabled()) return;
    this.fileInput()?.nativeElement.click();
  }

  /** Remove a file entry by its id. */
  public remove(id: string): void {
    const entry = this.files().find((f) => f.id === id);
    if (!entry) return;
    this.files.update((list) => list.filter((f) => f.id !== id));
    this.fileRemoved.emit(entry);
  }

  /** Remove all files. */
  public clear(): void {
    const current = this.files();
    this.files.set([]);
    for (const entry of current) {
      this.fileRemoved.emit(entry);
    }
  }

  // ── Protected template handlers ──────────────────────────────────

  /** @internal */
  protected onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.addFiles(input.files);
    }
    // Reset so re-selecting the same file triggers change again
    input.value = "";
  }

  /** @internal */
  protected onDragEnter(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.disabled()) return;
    this.dragCounter++;
    this.isDragging.set(true);
  }

  /** @internal */
  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  /** @internal */
  protected onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragCounter--;
    if (this.dragCounter <= 0) {
      this.dragCounter = 0;
      this.isDragging.set(false);
    }
  }

  /** @internal */
  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragCounter = 0;
    this.isDragging.set(false);
    if (this.disabled()) return;
    if (event.dataTransfer?.files) {
      this.addFiles(event.dataTransfer.files);
    }
  }

  /** @internal */
  protected onZoneClick(): void {
    this.browse();
  }

  /** @internal */
  protected onZoneKeydown(event: KeyboardEvent): void {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.browse();
    }
  }

  /** @internal */
  protected formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  // ── Private helpers ──────────────────────────────────────────────

  private addFiles(fileList: FileList): void {
    const incoming = Array.from(fileList);
    const accepted: UIFileEntry[] = [];

    for (const file of incoming) {
      if (!this.matchesAccept(file)) {
        this.fileRejected.emit({
          file,
          reason: `File type "${file.type || file.name}" is not accepted`,
        });
        continue;
      }

      const max = this.maxFileSize();
      if (max !== undefined && file.size > max) {
        this.fileRejected.emit({
          file,
          reason: `File size ${this.formatSize(file.size)} exceeds maximum ${this.formatSize(max)}`,
        });
        continue;
      }

      accepted.push({ file, id: crypto.randomUUID() });
    }

    if (accepted.length === 0) return;

    if (this.multiple()) {
      this.files.update((list) => [...list, ...accepted]);
    } else {
      // Single-file mode: replace previous selection
      this.files.set([accepted[0]]);
    }

    for (const entry of this.multiple() ? accepted : [accepted[0]]) {
      this.fileAdded.emit(entry);
    }
  }

  private matchesAccept(file: File): boolean {
    const accept = this.accept().trim();
    if (!accept) return true;

    const patterns = accept.split(",").map((s) => s.trim().toLowerCase());
    const fileName = file.name.toLowerCase();
    const fileType = (file.type || "").toLowerCase();

    return patterns.some((pattern) => {
      // Extension match (e.g. ".pdf", ".jpg")
      if (pattern.startsWith(".")) {
        return fileName.endsWith(pattern);
      }
      // Wildcard MIME (e.g. "image/*")
      if (pattern.endsWith("/*")) {
        const group = pattern.slice(0, -2);
        return fileType.startsWith(group + "/");
      }
      // Exact MIME match
      return fileType === pattern;
    });
  }
}
