import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Event, EventDocument } from './schemas/event.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reward, RewardDocument } from './schemas/reward.schema';
import { History, HistoryDocument } from './schemas/History.schema';
const dayjs = require('dayjs');

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    @InjectModel(Reward.name) private rewardModal: Model<RewardDocument>,
    @InjectModel(History.name) private historyModal: Model<HistoryDocument>,
  ) {}

  // 이벤트 조회(USER)
  async getEventForUser(): Promise<Event[]>{
    const eventList = await this.eventModel.find();
    const resultData = []

    eventList.map((event) => {
      const resultArr = {
        name: event.name,
        reward: event.reward,
        startAt: dayjs(event.startAt).format('YYYY-MM-DD'),
        endAt: dayjs(event.endAt).format('YYYY-MM-DD'),
      }

      resultData.push(resultArr)
    })

    return resultData;
  }

  // 이벤트 조회(ADMIN)
  async getEvent(): Promise<Event[]>{
    return await this.eventModel.find();
  }

  // 이벤트 생성
  async createEvent(name:string, reward:number, status:boolean, eventType:string, startAt:Date, endAt:Date, ID:string): Promise<Event>{
    
    // 보상이 존재하는 보상인 체크
    const rewardCheck = await this.rewardModal.findOne({number : reward});
    
    if(!rewardCheck){
      throw new HttpException('해당 보상이 존재하지 않습니다.', HttpStatus.BAD_REQUEST)
    }
    const eventList = await this.eventModel.find();
    const eventNumber = eventList.length + 1;

    const result = await this.eventModel.create({number:eventNumber, name, reward, status, eventType, startAt, endAt, createdBy:ID, updatedBy:ID});

    return result;
  }

  // 이벤트 보상 추가
  async eventAddReward(eventNum:number, reward:number, ID:string): Promise<any>{
    
    // 보상이 존재하는 보상인 체크
    const rewardCheck = await this.rewardModal.findOne({number : reward});
    
    if(!rewardCheck){
      throw new HttpException('해당 보상이 존재하지 않습니다.', HttpStatus.BAD_REQUEST)
    }

    const result = await this.eventModel.updateOne(
                      {number: eventNum},
                      {$addToSet: { reward },
                        $set: {
                          updatedBy: ID,
                          updatedAt: new Date()
                        }
                      }
                    );

    return result;
  }

  // 보상 조회(USER)
  async getRewardForUser(): Promise<any[]>{
    
    const result = await this.rewardModal.aggregate([
      { $match: {} },
      {
        $lookup: {
          from: 'events',
          let: { localNumber: '$number' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: [
                    { $toString: '$$localNumber' }, 
                    '$reward'
                  ]
                }
              }
            }
          ],
          as: 'events'
        }
      },
      {
        $project: {
          _id: 0,
          number: 1,
          name: 1,
          amount: 1,
          eventPath: '$events.name',
        }
      }
    ]);

    return result
  }

  // 보상 조회(ADMIN)
  async getReward(): Promise<any[]>{
    
    const result = await this.rewardModal.aggregate([
      { $match: {} },
      {
        $lookup: {
          from: 'events',
          let: { localNumber: '$number' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: [
                    { $toString: '$$localNumber' }, 
                    '$reward'
                  ]
                }
              }
            }
          ],
          as: 'events'
        }
      },
      {
        $project: {
          _id: 0,
          number: 1,
          name: 1,
          amount: 1,
          info: 1,
          createdAt: 1,
          updatedAt: 1,
          eventsName: '$events.name',
        }
      }
    ]);

    return result
  }

  // 보상 생성
  async createReward(name:string, amount: number, info:string, ID:string): Promise<Reward>{
    
    const rewardList = await this.rewardModal.find();
    const rewardNumber = rewardList.length + 1;

    const result = await this.rewardModal.create({number:rewardNumber, name, amount, info, createdBy:ID, updatedBy:ID});

    return result
  }

  // 보상 요청
  async requestReward(eventNum:number, ID:string): Promise<History>{
    
    // 이벤트 존재 체크
    const eventCheck = await this.eventModel.findOne({number: eventNum});
    if(!eventCheck){
      await this.historyModal.create({userId: ID, eventNum, remark:'해당 이벤트가 존재하지 않습니다.', status: RewardStatus.Failed});
      throw new HttpException('해당 이벤트가 존재하지 않습니다.', HttpStatus.BAD_REQUEST)
    }

    // 이벤트 상태 체크
    if(!eventCheck.status){
      await this.historyModal.create({userId: ID, eventNum, remark:'이벤트가 종료되었습니다.', status: RewardStatus.Failed});
      throw new HttpException('이벤트가 종료되었습니다.', HttpStatus.BAD_REQUEST)
    }

    // 이벤트 기간 체크
    const startAt = dayjs(eventCheck.startAt).format('YYYY-MM-DD');
    const endAt = dayjs(eventCheck.endAt).format('YYYY-MM-DD');
    const today = dayjs(new Date()).format('YYYY-MM-DD');
    if(today < startAt || today > endAt){
      await this.historyModal.create({userId: ID, eventNum, remark:'이벤트 기간이 아닙니다.', status: RewardStatus.Failed});
      throw new HttpException('이벤트 기간이 아닙니다.', HttpStatus.BAD_REQUEST)
    }

    // 보상 조건 충족 여부 체크
    

    // 중복 보상 요청 방지
    const historyCheck = await this.historyModal.findOne({userId: ID, eventNum, status: 'success'});
    if(historyCheck){
      await this.historyModal.create({userId: ID, eventNum, remark:'이미 보상을 받으셨습니다.', status: RewardStatus.Failed});
      throw new HttpException('이미 보상을 받으셨습니다.', HttpStatus.BAD_REQUEST)
    }


    return historyCheck
  }
}