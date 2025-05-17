import { Injectable } from '@nestjs/common';
import axios from 'axios';
const dockerURL = process.env.IS_DOCKER === 'true' ? 'auth:8001' : 'localhost:8001';

@Injectable()
export class AppService {
  // 로그인
  async login(ID: string, PW: string): Promise<boolean> {
    try {
      const result = await axios.post(`http://${dockerURL}/login`, {
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
      const result = await axios.post(`http://${dockerURL}/signup`, {
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

  // 이벤트 조회(USER)
  async getEventForUser(accessToken: string): Promise<any> {
    try {
      const result = await axios.get(`http://${dockerURL}/event`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return result.data;
    } catch (error) {
      throw error;
    }
  }

  // 이벤트 조회(ADMIN)
  async getEvent(accessToken: string): Promise<any> {
    try {
      const result = await axios.get(`http://${dockerURL}/admin/event`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return result.data;
    } catch (error) {
      throw error;
    }
  }

  // 이벤트 생성
  async createEvent(name:string, reward:number, status:boolean, eventType:string, startAt:Date, endAt:Date, accessToken: string): Promise<{ message: string }> {
    try {
      const event = {
        name,
        reward,
        status,
        eventType,
        startAt,
        endAt
      } 

      const result = await axios.post(`http://${dockerURL}/admin/event`,event, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return result.data;
    } catch (error) {
      throw error;
    }
  }

  // 이벤트 보상 추가
  async eventAddReward(eventNum:number, reward:number, accessToken: string): Promise<{ message: string }> {
    try {
      const info = {
        eventNum,
        reward
      }
      const result = await axios.patch(`http://${dockerURL}/admin/event`,info, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return result.data;
    } catch (error) {
      throw error;
    }
  }

  // 보상 조회(USER)
  async getRewardForUser(accessToken: string): Promise<{ message: string }> {
    try {
      const result = await axios.get(`http://${dockerURL}/reward`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return result.data;
    } catch (error) {
      throw error;
    }
  }

  // 보상 조회(ADMIN)
  async getReward(accessToken: string): Promise<{ message: string }> {
    try {
      const result = await axios.get(`http://${dockerURL}/admin/reward`, {
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

      const result = await axios.post(`http://${dockerURL}/admin/reward`,reward, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return result.data;
    } catch (error) {
      throw error;
    }
  }
  
  // 보상 요청
  async requestReward(eventNum: number, accessToken: string): Promise<{ message: string }> {
    try {
      const result = await axios.post(`http://${dockerURL}/request`,{eventNum},{
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return result.data;
    } catch (error) {
      throw error;
    }
  }
  
  // 내 요청 이력보기
  async requestUserHistoryById(accessToken: string): Promise<{ message: string }> {
    try {
      const result = await axios.get(`http://${dockerURL}/request/history`,{
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return result.data;
    } catch (error) {
      throw error;
    }
  }
  
  // ADMIN 요청 이력보기
  async requestAdminHistoryById(accessToken: string): Promise<{ message: string }> {
    try {
      const result = await axios.get(`http://${dockerURL}/admin/request/history`,{
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
