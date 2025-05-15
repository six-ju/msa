import { Body, Controller, Get, Post, Render, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { USER_ROLES } from './config/variables';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // 로그인
  @Post('/login')
  async login(@Req() req, @Res() res) {
    try {
      const { ID, PW } = req.query;

      if (!ID || !PW) {
        return res.status(400).json({ message: '모두 입력해주세요.' });
      }

      const token = await this.appService.login(ID, PW);

      res.cookie('accessToken', token, {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60, // 1시간
      });

      return res.status(200).json({ message: '로그인 성공' });
    } catch (error) {
      return res.status(401).json({ message: error.response.data.message });
    }
  }

  // 회원가입
  @Post('/signup')
  async signUp(@Req() req, @Res() res) {
    try {
      const { ID, PW, role, recommend } = req.query;

      if (!ID || !PW || !role) {
        return res.status(400).json({ message: '모두 입력해주세요.' });
      }

      const upperRole = role.toUpperCase();

      if (!USER_ROLES.includes(upperRole)) {
        return res.status(400).json({ message: '잘못된 권한입니다.' });
      }

      const result = await this.appService.signUp(ID, PW, upperRole, recommend);

      return res.status(200).json(result);
    } catch (error) {
      return res.status(401).json({ message: error.response?.data.message || '회원가입 중 실패했습니다.' });
    }
  }

  // 이벤트 생성
  @Post('/admin/event')
  async createEvent(@Body() body, @Req() req, @Res() res) {
    try {
      const { name, reward, status, startAt, endAt } = body;

      if (!name || !reward || !status || !startAt || !endAt) {
        return res.status(400).json({message: '모든 정보를 입력해주세요.'});
      }

      const { accessToken } = req.cookies; 

      if(!accessToken){
        return res.status(401).json({ message: "로그인 먼저 해주세요."})
      }

      const result = await this.appService.createEvent(name, reward, status, startAt, endAt, accessToken);

      return res.status(200).json(result);
    } catch (error) {
      console.log(error)
      return res.status(400).json({ message: error.response?.data.message || '이벤트 등록 중 오류가 발생했습니다.' });
    }
  }

  // 보상 생성
  @Post('/admin/reward')
  async createReward(@Body() body, @Req() req, @Res() res) {
    try {
      const { name, amount, info } = body;

      if (!name || !amount || !info ) {
        return res.status(400).json({message: '모든 정보를 입력해주세요.'});
      }

      const { accessToken } = req.cookies; 

      if(!accessToken){
        return res.status(401).json({ message: "로그인 먼저 해주세요."})
      }

      const result = await this.appService.createReward( name, amount, info, accessToken);

      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ message: error.response?.data.message || '보상 등록 중 오류가 발생했습니다.' });
    }
  }
}
