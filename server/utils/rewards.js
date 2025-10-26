// utils/rewards.js
function calculateRewards(currentPoints, earnedPoints, currentBadges) {
  const newPoints = currentPoints + earnedPoints;

  const badgeThresholds = [
    { name: "Bronze Donor", threshold: 100 },
    { name: "Silver Donor", threshold: 250 },
    { name: "Gold Donor", threshold: 500 },
    { name: "Platinum Donor", threshold: 1000 },
    { name: "Diamond Donor", threshold: 2500 },
  ];

  const newBadges = [...currentBadges];
  for (const badge of badgeThresholds) {
    if (newPoints >= badge.threshold && !currentBadges.includes(badge.name)) {
      newBadges.push(badge.name);
    }
  }

  return { newPoints, newBadges };
}