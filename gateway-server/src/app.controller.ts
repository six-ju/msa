import { Controller, Get, Post, Render, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { USER_ROLES } from './config/variables';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  @Render('index')
  main() {
    return;
  }

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

  @Get('/event')
  async event(@Req() req, @Res() res) {
    try {
      const { accessToken } = req.cookies;
      const result = await this.appService.event(accessToken);

      return res.status(200).json(result);
    } catch (error) {
      return res.status(401).json({ message: error.response.data.message });
    }
  }
}
