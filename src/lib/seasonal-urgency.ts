/** Month-based urgency copy for India (0 = January, 11 = December). */
export function getSeasonalUrgencyMessage(): string {
  const m = new Date().getMonth();
  // Oct–Feb (winter pollution): 9,10,11,0,1
  if (m >= 9 || m <= 1) {
    return "Winter is the worst season for polluted-city lungs. Most orders come in now — stock runs low every year.";
  }
  // Mar–May
  if (m >= 2 && m <= 4) {
    return "Summer heat thickens mucus and stresses airways. This is when our customers see the fastest results.";
  }
  // Jun–Sep monsoon
  return "Monsoon humidity triggers respiratory flare-ups. Our highest-demand months are June–September.";
}
