import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import axios from 'axios';
import { Reward } from './schemas/reward.schema';

@Injectable()
export class AppService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  // 로그인
  async login(ID: string, PW: string): Promise<any> {
    const findUser = await this.userModel.findOne({ ID, PW });

    // 아이디 비밀번호 체크
    if (ID !== findUser?.ID || PW !== findUser?.PW) {
      throw new HttpException(
        '아이디와 비밀번호가 일치하지 않습니다.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    // JWT 토큰 발급
    const role = findUser?.role;
    const payload = { ID, role };
    const token = this.jwtService.sign(payload);

    // 로그인 시간 업데이트
    await this.userModel.updateOne({ ID }, { loginAt: new Date() });

    return token;
  }

  // 회원가입
  /**
   * param {string} ID - 아이디
   * param {string} PW - 비밀번호
   * param {string} role - 권한
   * param {string} recommend - 추천인
   * return Promise<User> - 생성된 사용자 정보
   */
  async signUp(ID: string, PW: string, role: string, recommend: string): Promise<User> {
    // 추천인 체크
    if(recommend !== undefined){
      const findUser = await this.userModel.findOne({ ID: recommend});
      if(findUser){
        await this.userModel.updateOne({ ID: recommend }, { $inc: { recommend: 1 } });
      }
    }
    return await this.userModel.create({ ID, PW, role, loginAt: new Date() });
  }

  // 이벤트 조회(USER)
  async getEventForUser(): Promise<any>{
    return await axios.get('http://localhost:8002/event')
  }

  // 이벤트 조회(ADMIN)
  async getEvent(): Promise<any>{
    return await axios.get('http://localhost:8002/admin/event')
  }

  // 이벤트 생성
  async createEvent(name:string, reward:number, status:boolean, eventType:string, startAt:Date, endAt:Date, ID:string): Promise<any>{
    const event = {
      name,
      reward,
      status,
      eventType,
      startAt,
      endAt,
      ID
    } 
  
    return await axios.post('http://localhost:8002/admin/event', event)
  }

  // 이벤트 보상 추가
  async eventAddReward(eventNum:number, reward:number, ID:string): Promise<any>{
    const event = {
      eventNum,
      reward,
      ID
    } 
  
    return await axios.patch('http://localhost:8002/admin/event', event)
  }

  // 보상 조회(USER)
  async getRewardForUser(): Promise<any>{  
    return await axios.get('http://localhost:8002/reward')
  }

  // 보상 조회(ADMIN)
  async getReward(): Promise<any>{  
    return await axios.get('http://localhost:8002/admin/reward')
  }

  // 보상 생성
  async createReward(name:string, amount: number, info:string, ID:string): Promise<any>{
    const reward = {
      name, amount, info, ID
    } 
  
    return await axios.post('http://localhost:8002/admin/reward', reward)
  }

  // 보상 요청
  async requestReward(eventNum:number, ID:string): Promise<any>{
    const reward = {
      eventNum, ID
    } 
  
    return await axios.post('http://localhost:8002/admin/request', reward)
  }
}
