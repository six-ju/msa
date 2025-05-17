import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RewardStrategy } from '../interfaces/reward-strategy.interface';
import { EventType } from '../config/variables';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { calculateTotalAmount } from '../utils/reward.utils';
import { Reward } from 'src/schemas/reward.schema';

@Injectable()
export class WeeklyLoginStrategy implements RewardStrategy {
  readonly eventType = EventType.Weekly;

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Reward.name) private rewardModel: Model<Reward>,
  ) {}

  async handle(ID: string, rewardNums: number[]) {
    // 보상액 지급
    const loginCount = await this.userModel
      .findOne({ ID })
      .then((count) => count.loginCount);

    if (loginCount >= 30) {
      const total = await calculateTotalAmount(rewardNums, this.rewardModel);
      await this.userModel.updateOne({ ID }, { $inc: { money: total } });
    } else {
      throw new HttpException('출석일이 부족합니다.', HttpStatus.BAD_REQUEST);
    }
  }
}
