import { Body, Controller, Get, Patch, Post, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  
  // 이벤트 조회(USER)
  @Get('/event')
  async getEventForUser(@Res() res){
    try {
      const result = await this.appService.getEventForUser();

      return res.status(200).json(result)
    } catch (error) {
      return res.status(400).json({message: error.response || '이벤트 조회 중 에러가 발생했습니다.'})
    }
  }
    
  // 이벤트 조회(ADMIN)
  @Get('/admin/event')
  async getEvent(@Res() res){
    try {
      const result = await this.appService.getEvent();

      return res.status(200).json(result)
    } catch (error) {
      return res.status(400).json({message: error.response || '이벤트 조회 중 에러가 발생했습니다.'})
    }
  }
  
  // 이벤트 생성
  @Post('/admin/event')
  async createEvent(@Body() body, @Res() res){
    try {
      const { name, reward, status, eventType, startAt, endAt, ID } = body;

      const result = await this.appService.createEvent(name, reward, status, eventType, startAt, endAt, ID);

      return res.status(200).json(result)
    } catch (error) {
      return res.status(400).json({message: error.response || '이벤트 생성 중 에러가 발생했습니다.'})
    }
  }
  
  // 이벤트 보상 추가
  @Patch('/admin/event')
  async eventAddReward(@Body() body, @Res() res){
    try {
      const { eventNum, reward, ID } = body;

      const result = await this.appService.eventAddReward(eventNum, reward, ID);

      return res.status(200).json(result)
    } catch (error) {
      return res.status(400).json({message: error.response || '보상 추가 중 에러가 발생했습니다.'})
    }
  }

  // 보상 조회(USER)
  @Get('/reward')
  async getRewardForUser(@Res() res){
    try {
      const result = await this.appService.getRewardForUser();

      return res.status(200).json(result)
    } catch (error) {
      return res.status(400).json({message: error.response || '보상 조회 중 에러가 발생했습니다.'})
    }
  }

  // 보상 조회(ADMIN)
  @Get('/admin/reward')
  async getReward(@Res() res){
    try {
      const result = await this.appService.getReward();

      return res.status(200).json(result)
    } catch (error) {
      return res.status(400).json({message: error.response || '보상 조회 중 에러가 발생했습니다.'})
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
      return res.status(400).json({message: error.response || '보상 생성 중 에러가 발생했습니다.'})
    }
  }

  // 보상 요청
  @Post('/request')
  async requestReward(@Body() body, @Res() res){
    try {
      const {eventNum, ID} = body;

      const result = await this.appService.requestReward(eventNum, ID);

      return res.status(200).json(result)
    } catch (error) {
      return res.status(400).json({message: error.response || '보상 지급 중 에러가 발생했습니다.'})
    }
  }

  // 내 요청 이력보기
  @Get('/request/history/:ID')
  async requestUserHistoryById(@Req() req, @Res() res){
    try {
      const { ID } = req.params;
      
      const result = await this.appService.requestUserHistoryById(ID);

      return res.status(200).json(result)
    } catch (error) {
      return res.status(400).json({message: error.response || '요청 내역 가져오는 중 에러가 발생했습니다.'})
    }
  }

  // ADMIN 요청 이력보기
  @Get('/admin/request/history')
  async requestAdminHistoryById(@Res() res){
    try {
      const result = await this.appService.requestAdminHistoryById();

      return res.status(200).json(result)
    } catch (error) {
      return res.status(400).json({message: error.response || '요청 내역 가져오는 중 에러가 발생했습니다.'})
    }
  }
}
