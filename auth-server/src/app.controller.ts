import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './utill/jwt-auth.guard';
import { RolesGuard } from './utill/roles.guard';
import { Roles } from './utill/roles.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // 로그인
  @Post('/login')
  async login(@Body() body, @Res() res) {
    try {
      const { ID, PW } = body;
      const token = await this.appService.login(ID, PW);

      return res.status(200).json(token);
    } catch (error) {
      return res.status(401).json({ message: error.message });
    }
  }

  // 회원가입
  /**
   * param {string} ID - 아이디
   * param {string} PW - 비밀번호
   * param {string} role - 권한
   * param {string} recommend - 추천인
   * return Promise{message:string} - 성공 메시지
   */
  @Post('/signup')
  async signUp(@Body() body, @Res() res) {
    try {
      const { ID, PW, role, recommend } = body;

      await this.appService.signUp(ID, PW, role, recommend);

      return res
        .status(200)
        .json({ message: '회원가입을 성공적으로 완료했습니다.' });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ message: '이미 존재하는 아이디입니다.' });
      } else {
        return res
          .status(400)
          .json({ message: '회원가입 중 에러가 발생했습니다.' });
      }
    }
  }

  // 이벤트 조회(USER)
  @UseGuards(JwtAuthGuard)
  @Get('/event')
  async getEventForUser(@Res() res) {
    try {
      const result = await this.appService.getEventForUser();

      return res.status(200).json(result.data)
    } catch (error) {
      return res.status(400).json({ message: error.response?.data.message ||'이벤트 조회 중 에러가 발생했습니다.' });
    }
  }

  // 이벤트 조회(ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'OPERATOR')
  @Get('/admin/event')
  async getEvent(@Res() res) {
    try {
      const result = await this.appService.getEvent();

      return res.status(200).json(result.data)
    } catch (error) {
      return res.status(400).json({ message: error.response?.data.message ||'이벤트 조회 중 에러가 발생했습니다.' });
    }
  }

  // 이벤트 생성
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'OPERATOR')
  @Post('/admin/event')
  async createEvent(@Body() body, @Req() req, @Res() res) {
    try {
      const { ID } = req.user;
      const { name, reward, status, eventType, startAt, endAt } = body;

      await this.appService.createEvent(name, reward, status, eventType, startAt, endAt, ID);
      
      return res.status(200).json({message:'이벤트 생성 완료'})
    } catch (error) {
      return res.status(400).json({ message: error.response?.data.message ||'이벤트 생성 중 에러가 발생했습니다.' });
    }
  }

  // 이벤트 보상 추가
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'OPERATOR')
  @Patch('/admin/event')
  async eventAddReward(@Body() body, @Req() req, @Res() res) {
    try {
      const { ID } = req.user;
      const { eventNum, reward } = body;

      await this.appService.eventAddReward(eventNum, reward, ID);
      
      return res.status(200).json({message:'보상 추가 완료'})
    } catch (error) {
      return res.status(400).json({ message: error.response?.data.message ||'보상 추가 중 에러가 발생했습니다.' });
    }
  }

  // 보상 조회(USER)
  @UseGuards(JwtAuthGuard)
  @Get('/reward')
  async getRewardForUser(@Res() res) {
    try {
      const result = await this.appService.getRewardForUser();

      return res.status(200).json(result.data)
    } catch (error) {
      return res.status(400).json({ message: error.response?.data.message || '보상 조회 중 에러가 발생했습니다.' });
    }
  }

  // 보상 조회(ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'OPERATOR')
  @Get('/admin/reward')
  async getReward(@Res() res) {
    try {
      const result = await this.appService.getReward();

      return res.status(200).json(result.data)
    } catch (error) {
      return res.status(400).json({ message: error.response?.data.message || '보상 조회 중 에러가 발생했습니다.' });
    }
  }

  // 보상 생성
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'OPERATOR')
  @Post('/admin/reward')
  async createReward(@Body() body, @Req() req, @Res() res) {
    try {
      const { ID } = req.user;
      const { name, amount, info } = body;
      await this.appService.createReward(name, amount, info, ID);

      return res.status(200).json({message:'보상 생성 완료'})
    } catch (error) {
      return res.status(400).json({ message: error.response?.data.message || '보상 생성 중 에러가 발생했습니다.' });
    }
  }

  // 보상 요청
  @UseGuards(JwtAuthGuard)
  @Post('/request')
  async requestReward(@Body() body, @Req() req, @Res() res) {
    try {
      const { ID } = req.user;
      const { eventNum } = body;
      await this.appService.requestReward(eventNum, ID);

      return res.status(200).json({message:'보상 받기 완료'})
    } catch (error) {
      return res.status(400).json({ message: error.response?.data.message || '보상 요청 중 에러가 발생했습니다.' });
    }
  }
}
