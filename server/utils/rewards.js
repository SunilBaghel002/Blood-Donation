// utils/rewards.js

/**
 * Calculate reward points and badges for blood donors
 * @param {number} currentPoints - Current reward points
 * @param {number} earnedPoints - Points earned from this donation
 * @param {array} currentBadges - Array of current badges
 * @returns {object} { newPoints, newBadges }
 */
function calculateRewards(currentPoints, earnedPoints, currentBadges) {
  const newPoints = currentPoints + earnedPoints;

  const badgeThresholds = [
    { name: "Bronze Donor", threshold: 100 },
    { name: "Silver Donor", threshold: 250 },
    { name: "Gold Donor", threshold: 500 },
    { name: "Platinum Donor", threshold: 1000 },
    { name: "Diamond Donor", threshold: 2500 },
    { name: "Legendary Donor", threshold: 5000 },
  ];

  const newBadges = [...currentBadges];
  
  for (const badge of badgeThresholds) {
    if (newPoints >= badge.threshold && !currentBadges.includes(badge.name)) {
      newBadges.push(badge.name);
    }
  }

  return { newPoints, newBadges };
}

// ✅ EXPORT THE FUNCTION
module.exports = {
  calculateRewards,
};