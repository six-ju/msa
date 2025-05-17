import { Injectable } from '@nestjs/common';
import { RewardStrategy } from '../interfaces/reward-strategy.interface';
import { EventType } from '../config/variables';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { calculateTotalAmount } from '../utils/reward.utils';
import { Reward } from 'src/schemas/reward.schema';

@Injectable()
export class MonthlyLoginStrategy implements RewardStrategy {
  readonly eventType = EventType.Monthly;

  constructor(
    @InjectModel(User.name)    private userModel:    Model<User>,
    @InjectModel(Reward.name)    private rewardModel:    Model<Reward>,
  ) {}

  async handle(userId: string, rewardNums: number[]) {
    // 보상액 지급
    const total = await calculateTotalAmount(rewardNums, this.rewardModel);
    await this.userModel.updateOne({ ID: userId }, { $inc: { money: total } });

  }
}
