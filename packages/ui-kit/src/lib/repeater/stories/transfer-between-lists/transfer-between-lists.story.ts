import { Component } from '@angular/core';
import { UIRepeater, RepeaterTransferEvent } from '@theredhead/lucid-kit';
import { ArrayDatasource } from '@theredhead/lucid-foundation';

@Component({
  selector: 'app-transfer-example',
  standalone: true,
  imports: [UIRepeater],
  templateUrl: './transfer-example.component.html',
})
export class TransferExampleComponent {
  readonly dsAvailable = new ArrayDatasource([
    { id: 1, name: 'Item A' },
    { id: 2, name: 'Item B' },
    { id: 3, name: 'Item C' },
  ]);
  readonly dsSelected = new ArrayDatasource([
    { id: 4, name: 'Item D' },
  ]);

  onTransfer(event: RepeaterTransferEvent<{ id: number; name: string }>): void {
    console.log('Transferred:', event.item.name, 'to index', event.currentIndex);
  }
}
