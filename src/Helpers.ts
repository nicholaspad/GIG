import MoralisType from "moralis";

export function computeUnitRewardWei(
  Moralis: MoralisType,
  maxReward: number,
  maxTaskers: number
): string {
  const maxRewardWei = Number(Moralis.Units.ETH(maxReward));
  const unitRewardWei = maxRewardWei / maxTaskers - 1; // ensures that unitRewardWei*maxTaskers < maxRewardWei
  return unitRewardWei.toString();
}

export function computeMaxRewardWei(
  Moralis: MoralisType,
  maxReward: number
): string {
  return Moralis.Units.ETH(maxReward);
}
