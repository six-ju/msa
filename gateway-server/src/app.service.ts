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

  // 회원가입
  async event(accessToken: string): Promise<{ message: string }> {
    try {
      const result = await axios.get('http://localhost:8001/event', {
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
