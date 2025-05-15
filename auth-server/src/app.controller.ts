import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
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

      return res.status(200).json( token );
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

      return res.status(200).json({ message: '회원가입을 성공적으로 완료했습니다.'  });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ message: '이미 존재하는 아이디입니다.' });
      }else {
        return res.status(400).json({ message: '회원가입 중 에러가 발생했습니다.' });
      }
    }
  }

  // event 로 넘어가기전 검증
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('/event')
  getProfile(@Req() req) {
    console.log('🧑‍💼 유저 정보:', req.user);
    return 123; 
  }
}
