import { BigNumber } from "ethers";
import MoralisType from "moralis";

export function computeUnitRewardWei(
  Moralis: MoralisType,
  maxReward: string,
  maxTaskers: number
): string {
  const maxRewardWei = BigNumber.from(Moralis.Units.ETH(maxReward));
  const unitRewardWei = maxRewardWei.div(maxTaskers).sub(1); // ensures that unitRewardWei*maxTaskers < maxRewardWei
  return unitRewardWei.toString();
}

export function computeMaxRewardWei(
  Moralis: MoralisType,
  maxReward: number
): string {
  return Moralis.Units.ETH(maxReward);
}
