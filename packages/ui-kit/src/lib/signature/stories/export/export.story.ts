const svg: string | null = this.sigRef.exportSvg();  // stroke value only
const png: string | null = this.sigRef.exportPng();  // any value
const canSvg: boolean = this.sigRef.canExport('svg');
const canPng: boolean = this.sigRef.canExport('png');
