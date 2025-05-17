import { Model } from "mongoose";
import { Reward } from "src/schemas/reward.schema";

export async function calculateTotalAmount(arrReward: number[], rewardModal: Model<Reward>): Promise<number> {
    const amount = await Promise.all(
        arrReward.map(num => rewardModal.findOne({ number: num }).then(r => r.amount))
    );

    return amount.reduce((money, a) => money + a, 0)
}
