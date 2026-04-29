import { UIInput, DateInputAdapter, TimeTextAdapter } from '@theredhead/lucid-kit';

readonly dateAdapter = new DateInputAdapter({ format: 'yyyy-MM-dd' });
readonly timeAdapter = new TimeTextAdapter();
readonly dateText = signal('');
readonly timeText = signal('');
