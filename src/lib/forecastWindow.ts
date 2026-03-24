/**
 * Matches legacy behaviour: forecasts more than 7 days out are flagged as less reliable.
 */
export function isLongRangeForecast(stageDateStr: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const stageDate = new Date(stageDateStr);
  const diffDays = Math.ceil(
    (stageDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );
  return diffDays > 7;
}
