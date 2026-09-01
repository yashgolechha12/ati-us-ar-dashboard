export function fmtCurrency(val: number, compact = false): string {
  const sign = val < 0 ? '-' : '';
  const abs = Math.abs(val);
  if (compact) {
    if (abs >= 1000000000) return sign + '$' + (abs / 1000000000).toFixed(2) + 'B';
    if (abs >= 1000000) return sign + '$' + (abs / 1000000).toFixed(2) + 'M';
    if (abs >= 1000) return sign + '$' + (abs / 1000).toFixed(1) + 'K';
    return sign + '$' + abs.toFixed(0);
  }
  return sign + '$' + new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(abs);
}

export function fmtPct(val: number): string {
  return val.toFixed(1) + '%';
}

export function fmtNumber(val: number): string {
  return new Intl.NumberFormat('en-US').format(Math.round(val));
}
