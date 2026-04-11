import { inject, Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";

import { ModalService } from "@theredhead/lucid-kit";

import { UIAlertDialog } from "./alert-dialog.component";
import { UIConfirmDialog } from "./confirm-dialog.component";
import { UIPromptDialog } from "./prompt-dialog.component";
import { UIOpenFileDialog } from "./open-file-dialog.component";
import { UISaveFileDialog } from "./save-file-dialog.component";
import { UIAboutDialog } from "./about-dialog.component";

import type {
  AlertOptions,
  ConfirmOptions,
  PromptOptions,
  OpenFileOptions,
  OpenFileResult,
  SaveFileOptions,
  SaveFileResult,
  AboutOptions,
} from "./common-dialog.types";

/**
 * Service for showing common application dialogs — alert, confirm,
 * prompt, open-file, save-file, and about.
 *
 * Each method opens a modal dialog and returns a `Promise` that
 * resolves when the user closes it. The service delegates to
 * {@link ModalService} for the underlying dialog lifecycle.
 *
 * @example
 * ```ts
 * const confirmed = await this.dialogs.confirm({
 *   title: 'Delete item?',
 *   message: 'This action cannot be undone.',
 *   variant: 'danger',
 * });
 *
 * if (confirmed) { ... }
 * ```
 */
@Injectable({ providedIn: "root" })
export class CommonDialogService {
  private readonly modal = inject(ModalService);

  /**
   * Show a simple informational alert with a dismiss button.
   *
   * @returns Resolves when the user dismisses the dialog.
   */
  public async alert(options: AlertOptions): Promise<void> {
    const ref = this.modal.openModal<UIAlertDialog, void>({
      component: UIAlertDialog,
      inputs: {
        title: options.title,
        message: options.message,
        buttonLabel: options.buttonLabel ?? "OK",
      },
      ariaLabel: options.ariaLabel ?? options.title,
    });
    await firstValueFrom(ref.closed);
  }

  /**
   * Show a confirmation dialog with confirm and cancel buttons.
   *
   * @returns `true` if the user confirmed, `false` otherwise.
   */
  public async confirm(options: ConfirmOptions): Promise<boolean> {
    const ref = this.modal.openModal<UIConfirmDialog, boolean>({
      component: UIConfirmDialog,
      inputs: {
        title: options.title,
        message: options.message,
        confirmLabel: options.confirmLabel ?? "OK",
        cancelLabel: options.cancelLabel ?? "Cancel",
        variant: options.variant ?? "primary",
      },
      ariaLabel: options.ariaLabel ?? options.title,
    });
    const result = await firstValueFrom(ref.closed);
    return result ?? false;
  }

  /**
   * Show a prompt dialog with a text input.
   *
   * @returns The entered string, or `null` if cancelled.
   */
  public async prompt(options: PromptOptions): Promise<string | null> {
    const ref = this.modal.openModal<UIPromptDialog, string | null>({
      component: UIPromptDialog,
      inputs: {
        title: options.title,
        message: options.message,
        defaultValue: options.defaultValue ?? "",
        placeholder: options.placeholder ?? "",
        okLabel: options.okLabel ?? "OK",
        cancelLabel: options.cancelLabel ?? "Cancel",
      },
      ariaLabel: options.ariaLabel ?? options.title,
    });
    const result = await firstValueFrom(ref.closed);
    return result ?? null;
  }

  /**
   * Show an open-file dialog powered by {@link UIFileBrowser}.
   *
   * @returns The selected file(s), or `null` if cancelled.
   */
  public async openFile<M = unknown>(
    options: OpenFileOptions<M>,
  ): Promise<OpenFileResult<M> | null> {
    const ref = this.modal.openModal<
      UIOpenFileDialog<M>,
      OpenFileResult<M> | null
    >({
      component: UIOpenFileDialog,
      inputs: {
        title: options.title ?? "Open File",
        openLabel: options.openLabel ?? "Open",
        datasource: options.datasource,
      },
      ariaLabel: options.ariaLabel ?? options.title ?? "Open File",
    });
    const result = await firstValueFrom(ref.closed);
    return result ?? null;
  }

  /**
   * Show a save-file dialog powered by {@link UIFileBrowser} with a
   * file-name input.
   *
   * @returns The directory and file name, or `null` if cancelled.
   */
  public async saveFile<M = unknown>(
    options: SaveFileOptions<M>,
  ): Promise<SaveFileResult<M> | null> {
    const ref = this.modal.openModal<
      UISaveFileDialog<M>,
      SaveFileResult<M> | null
    >({
      component: UISaveFileDialog,
      inputs: {
        title: options.title ?? "Save File",
        saveLabel: options.saveLabel ?? "Save",
        defaultName: options.defaultName ?? "",
        datasource: options.datasource,
      },
      ariaLabel: options.ariaLabel ?? options.title ?? "Save File",
    });
    const result = await firstValueFrom(ref.closed);
    return result ?? null;
  }

  /**
   * Show an "About" dialog with application information.
   *
   * @returns Resolves when the user closes the dialog.
   */
  public async about(options: AboutOptions): Promise<void> {
    const ref = this.modal.openModal<UIAboutDialog, void>({
      component: UIAboutDialog,
      inputs: {
        appName: options.appName,
        version: options.version ?? "",
        description: options.description ?? "",
        logoUrl: options.logoUrl ?? "",
        copyright: options.copyright ?? "",
        credits: options.credits ?? [],
      },
      ariaLabel: options.ariaLabel ?? `About ${options.appName}`,
    });
    await firstValueFrom(ref.closed);
  }
}
