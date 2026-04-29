readonly dateAdapter = new DateInputAdapter({
  format: 'yyyy-MM-dd',
  min: new Date(2026, 2, 1),
  max: new Date(2026, 2, 31),
});
readonly dateText = signal('');
