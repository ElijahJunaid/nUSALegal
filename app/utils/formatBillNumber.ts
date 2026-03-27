export function formatBillNumber(num: string): string {
  return num
    .replace(/^Public Law\s+/i, 'PL ')
    .replace(/\| Public Law\s+/gi, '| PL ')
    .replace(/^(\d{2,3}-\d+)\s*\|/, 'PL $1 |')
}
