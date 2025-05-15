import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Event, EventDocument } from './schemas/event.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reward, RewardDocument } from './schemas/reward.schema';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    @InjectModel(Reward.name) private rewardModal: Model<RewardDocument>,
  ) {}

  // 이벤트 생성
  async createEvent(name:string, reward:number, status:boolean, startAt:Date, endAt:Date, ID:string): Promise<Event>{
    
    // 보상이 존재하는 보상인 체크
    const rewardCheck = await this.rewardModal.findOne({number : reward});
    
    if(!rewardCheck){
      throw new HttpException('해당 보상이 존재하지 않습니다.', HttpStatus.BAD_REQUEST)
    }

    const result = await this.eventModel.create({name, reward, status, startAt, endAt, createdBy:ID, updatedBy:ID});

    return result;
  }

  // 보상 생성
  async createReward(name:string, amount: number, info:string, ID:string): Promise<Reward>{
    
    const rewardList = await this.rewardModal.find();
    const rewardNumber = rewardList.length + 1;

    const result = await this.rewardModal.create({number:rewardNumber, name, amount, info, createdBy:ID, updatedBy:ID});

    return result
  }
}
 