import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AppService {
  // 로그인
  async login(ID: string, PW: string): Promise<boolean> {
    try {
      const result = await axios.post('http://localhost:8001/login', {
        ID,
        PW,
      });

      return result.data;
    } catch (error) {
      throw error;
    }
  }

  // 회원가입
  async signUp(
    ID: string,
    PW: string,
    role: string,
    recommend: string,
  ): Promise<{ message: string }> {
    try {
      const result = await axios.post('http://localhost:8001/signup', {
        ID,
        PW,
        role,
        recommend,
      });

      return result.data;
    } catch (error) {
      throw error;
    }
  }

  // 이벤트 생성
  async createEvent(name:string, reward:number, status:boolean, startAt:Date, endAt:Date, accessToken: string): Promise<{ message: string }> {
    try {
      const event = {
        name,
        reward,
        status,
        startAt,
        endAt
      } 

      const result = await axios.post('http://localhost:8001/admin/event',event, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return result.data;
    } catch (error) {
      throw error;
    }
  }

  // 보상 생성
  async createReward(name:string, amount: number, info:string, accessToken: string): Promise<{ message: string }> {
    try {
      const reward = {
        name, amount, info
      } 

      const result = await axios.post('http://localhost:8001/admin/reward',reward, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return result.data;
    } catch (error) {
      throw error;
    }
  }
}
