import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  
  // 이벤트 생성
  @Post('/admin/event')
  async createEvent(@Body() body, @Res() res){
    try {
      const { name, reward, status, startAt, endAt, ID } = body;

      const result = await this.appService.createEvent(name, reward, status, startAt, endAt, ID);

      return res.status(200).json(result)
    } catch (error) {
      return res.status(400).json({message: error.response || '이벤트 생성 중 에러가 발생했습니다.'})
    }
  }

  // 보상 생성
  @Post('/admin/reward')
  async createReward(@Body() body, @Res() res){
    try {
      const { name, amount, info, ID } = body;

      const result = await this.appService.createReward(name, amount, info, ID);

      return res.status(200).json(result)
    } catch (error) {
      return res.status(400).json({message: '보상 생성 중 에러가 발생했습니다.'})
    }
  }
}
