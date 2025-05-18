import { Body, Controller, Get, Patch, Post, Render, Req, Res, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { USER_ROLES } from './config/variables';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // 로그인
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 1, ttl: 5000 } })
  @Post('/login')
  async login(@Body() body, @Res() res) {
    try {
      const { ID, PW } = body;

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
      console.log(error)
      return res.status(401).json({ message: error.response?.data.message || '로그인 중 실패했습니다.'  });
    }
  }

  // 회원가입
  @Post('/signup')
  async signUp(@Body() body, @Res() res) {
    try {
      const { ID, PW, role, recommend } = body;

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

  // 이벤트 조회(USER)
  @Get('/event')
  async getEventForUser(@Req() req, @Res() res) {
    try {
      const { accessToken } = req.cookies; 

      if(!accessToken){
        return res.status(401).json({ message: "로그인 먼저 해주세요."})
      }

      const result = await this.appService.getEventForUser(accessToken);

      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ message: error.response?.data.message || '이벤트 조회 중 오류가 발생했습니다.' });
    }
  }

  // 이벤트 조회(ADMIN)
  @Get('/admin/event')
  async getEvent(@Req() req, @Res() res) {
    try {
      const { accessToken } = req.cookies; 

      if(!accessToken){
        return res.status(401).json({ message: "로그인 먼저 해주세요."})
      }

      const result = await this.appService.getEvent(accessToken);

      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ message: error.response?.data.message || '이벤트 조회 중 오류가 발생했습니다.' });
    }
  }

  // 이벤트 생성
  @Post('/admin/event')
  async createEvent(@Body() body, @Req() req, @Res() res) {
    try {
      const { accessToken } = req.cookies; 

      if(!accessToken){
        return res.status(401).json({ message: "로그인 먼저 해주세요."})
      }

      const { name, reward, status, eventType, startAt, endAt } = body;

      if (!name || !reward || !status || !startAt || !endAt) {
        return res.status(400).json({message: '모든 정보를 입력해주세요.'});
      }

      const result = await this.appService.createEvent(name, reward, status, eventType, startAt, endAt, accessToken);

      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ message: error.response?.data.message || '이벤트 등록 중 오류가 발생했습니다.' });
    }
  }

  // 이벤트 보상 추가
  @Patch('/admin/event')
  async eventAddReward(@Body() body, @Req() req, @Res() res) {
    try {
      const { accessToken } = req.cookies; 

      if(!accessToken){
        return res.status(401).json({ message: "로그인 먼저 해주세요."})
      }

      const { eventNum, reward } = body;

      if (!eventNum || !reward) {
        return res.status(400).json({message: '정보를 입력해주세요.'});
      }

      const result = await this.appService.eventAddReward(eventNum, reward, accessToken);

      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ message: error.response?.data.message || '보상 추가 중 오류가 발생했습니다.' });
    }
  }

  // 보상 조회(USER)
  @Get('/reward')
  async getRewardForUser(@Req() req, @Res() res) {
    try {
      const { accessToken } = req.cookies; 

      if(!accessToken){
        return res.status(401).json({ message: "로그인 먼저 해주세요."})
      }

      const result = await this.appService.getRewardForUser(accessToken);

      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ message: error.response?.data.message || '보상 조회 중 오류가 발생했습니다.' });
    }
  }

  // 보상 조회(ADMIN)
  @Get('/admin/reward')
  async getReward(@Req() req, @Res() res) {
    try {
      const { accessToken } = req.cookies; 

      if(!accessToken){
        return res.status(401).json({ message: "로그인 먼저 해주세요."})
      }

      const result = await this.appService.getReward(accessToken);

      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ message: error.response?.data.message || '보상 조회 중 오류가 발생했습니다.' });
    }
  }

  // 보상 생성
  @Post('/admin/reward')
  async createReward(@Body() body, @Req() req, @Res() res) {
    try {
      const { accessToken } = req.cookies; 

      if(!accessToken){
        return res.status(401).json({ message: "로그인 먼저 해주세요."})
      }

      const { name, amount, info } = body;

      if (!name || !amount || !info ) {
        return res.status(400).json({message: '모든 정보를 입력해주세요.'});
      }

      const result = await this.appService.createReward( name, amount, info, accessToken);

      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ message: error.response?.data.message || '보상 등록 중 오류가 발생했습니다.' });
    }
  }

  // 보상 요청
  @Post('/request')
  async requestReward(@Body() body, @Req() req, @Res() res){
    try {
      const { accessToken } = req.cookies; 

      if(!accessToken){
        return res.status(401).json({ message: "로그인 먼저 해주세요."})
      }

      const { eventNum } = body;

      if (!eventNum) {
        return res.status(400).json({message: '이벤트 번호를 입력해주세요.'})
      }

      const result = await this.appService.requestReward(eventNum, accessToken);

      return res.status(200).json(result)
    } catch (error) {
      return res.status(400).json({message: error.response?.data.message || '보상 지급 중 에러가 발생했습니다.'})
    }
  }

  // 내 요청 이력보기
  @Get('/request/history')
  async requestUserHistoryById(@Req() req, @Res() res){
    try {
      const { accessToken } = req.cookies; 

      if(!accessToken){
        return res.status(401).json({ message: "로그인 먼저 해주세요."})
      }

      const result = await this.appService.requestUserHistoryById(accessToken);

      return res.status(200).json(result)
    } catch (error) {
      return res.status(400).json({message: error.response?.data.message || '내 이력 가져오는 중 에러가 발생했습니다.'})
    }
  }

  // ADMIN 요청 이력보기
  @Get('/admin/request/history')
  async requestAdminHistoryById(@Req() req, @Res() res){
    try {
      const { accessToken } = req.cookies; 

      if(!accessToken){
        return res.status(401).json({ message: "로그인 먼저 해주세요."})
      }

      const result = await this.appService.requestAdminHistoryById(accessToken);

      return res.status(200).json(result)
    } catch (error) {
      return res.status(400).json({message: error.response?.data.message || '내 이력 가져오는 중 에러가 발생했습니다.'})
    }
  }
}
