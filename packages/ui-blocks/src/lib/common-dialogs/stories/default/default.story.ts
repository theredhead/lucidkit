import { Component, inject } from '@angular/core';
import { UIButton } from '@theredhead/lucid-kit';
import {
  CommonDialogService,
  type FileBrowserDatasource,
} from '@theredhead/lucid-blocks';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIButton],
  template: \`
    <ui-button (click)="showAlert()">Alert</ui-button>
    <ui-button (click)="showConfirm()">Confirm</ui-button>
    <ui-button (click)="showPrompt()">Prompt</ui-button>
  \`,
})
export class ExampleComponent {
  private readonly dialogs = inject(CommonDialogService);

  async showAlert() {
    await this.dialogs.alert({
      title: 'Update Available',
      message: 'A new version is available.',
    });
  }

  async showConfirm() {
    const confirmed = await this.dialogs.confirm({
      title: 'Delete Project?',
      message: 'This action cannot be undone.',
      variant: 'danger',
      confirmLabel: 'Delete',
    });
    if (confirmed) { /* delete */ }
  }

  async showPrompt() {
    const name = await this.dialogs.prompt({
      title: 'Rename File',
      message: 'Enter a new name:',
      defaultValue: 'document.txt',
    });
    if (name !== null) { /* rename */ }
  }

  async showOpenFile() {
    const result = await this.dialogs.openFile({
      datasource: myDatasource,
    });
    if (result) { /* use result.files */ }
  }

  async showSaveFile() {
    const result = await this.dialogs.saveFile({
      datasource: myDatasource,
      defaultName: 'untitled.txt',
    });
    if (result) { /* use result.directory, result.name */ }
  }

  async showAbout() {
    await this.dialogs.about({
      appName: 'MyApp',
      version: '1.0.0',
      description: 'A great application.',
      copyright: '© 2026 Acme Corp',
      credits: ['Angular Team', 'Lucide Icons'],
    });
  }
}
