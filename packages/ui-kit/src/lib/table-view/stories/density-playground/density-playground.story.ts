import {
  UITableView,
  UINumberColumn,
  UITextColumn,
  UIBadgeColumn,
  type UIDensity,
} from '@theredhead/lucid-kit';

density: UIDensity = 'comfortable'; // 'small' | 'compact' | 'comfortable' | 'generous'
adapter = new JsonPlaceholderPostsDatasource(25);
