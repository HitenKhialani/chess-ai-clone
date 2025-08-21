/**
 * Estimates ELO rating based on accuracy percentage
 * Returns specific ELO numbers instead of ranges
 */
export const estimateEloFromAccuracy = (accuracy: number): string => {
  if (accuracy < 20) return "150";
  if (accuracy >= 20 && accuracy < 30) return "300";
  if (accuracy >= 30 && accuracy < 40) return "500";
  if (accuracy >= 40 && accuracy < 50) return "700";
  if (accuracy >= 50 && accuracy < 60) return "900";
  if (accuracy >= 60 && accuracy < 70) return "1100";
  if (accuracy >= 70 && accuracy < 75) return "1300";
  if (accuracy >= 75 && accuracy < 80) return "1500";
  if (accuracy >= 80 && accuracy < 85) return "1700";
  if (accuracy >= 85 && accuracy < 90) return "1900";
  if (accuracy >= 90 && accuracy < 95) return "2100";
  if (accuracy >= 95 && accuracy < 98) return "2300";
  if (accuracy >= 98) return "2600";
  
  return "150"; // Default fallback
};

/**
 * Gets a more specific ELO estimate with a range
 */
export const getEloRange = (accuracy: number): { min: number; max: number; label: string } => {
  if (accuracy < 20) return { min: 0, max: 200, label: "150" };
  if (accuracy >= 20 && accuracy < 30) return { min: 200, max: 400, label: "300" };
  if (accuracy >= 30 && accuracy < 40) return { min: 400, max: 600, label: "500" };
  if (accuracy >= 40 && accuracy < 50) return { min: 600, max: 800, label: "700" };
  if (accuracy >= 50 && accuracy < 60) return { min: 800, max: 1000, label: "900" };
  if (accuracy >= 60 && accuracy < 70) return { min: 1000, max: 1200, label: "1100" };
  if (accuracy >= 70 && accuracy < 75) return { min: 1200, max: 1400, label: "1300" };
  if (accuracy >= 75 && accuracy < 80) return { min: 1400, max: 1600, label: "1500" };
  if (accuracy >= 80 && accuracy < 85) return { min: 1600, max: 1800, label: "1700" };
  if (accuracy >= 85 && accuracy < 90) return { min: 1800, max: 2000, label: "1900" };
  if (accuracy >= 90 && accuracy < 95) return { min: 2000, max: 2200, label: "2100" };
  if (accuracy >= 95 && accuracy < 98) return { min: 2200, max: 2400, label: "2300" };
  if (accuracy >= 98) return { min: 2600, max: 3000, label: "2600" };
  
  return { min: 0, max: 200, label: "150" };
}; 