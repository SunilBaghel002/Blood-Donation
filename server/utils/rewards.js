// utils/rewards.js
const REWARD_TIERS = [
  { points: 50, badge: "Gold Donor" },
  { points: 10, badge: "Silver Donor" },
  { points: 5,  badge: "Bronze Donor" },
];

const calculateRewards = (currentPoints, addedPoints, currentBadges = []) => {
  const newPoints = currentPoints + addedPoints;
  const newBadges = [...currentBadges];

  for (const tier of REWARD_TIERS) {
    if (newPoints >= tier.points && !newBadges.includes(tier.badge)) {
      newBadges.push(tier.badge);
    }
  }

  return { newPoints, newBadges };
};

module.exports = { calculateRewards };