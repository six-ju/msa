import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class AppService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  // 로그인
  async login(ID: string, PW: string): Promise<any> {
    const findUser = await this.userModel.findOne({ ID, PW });

    // 아이디 비밀번호 체크
    if (ID !== findUser?.ID || PW !== findUser?.PW) {
      throw new HttpException(
        '아이디와 비밀번호가 일치하지 않습니다.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    // JWT 토큰 발급
    const role = findUser?.role;
    const payload = { ID, role };
    const token = this.jwtService.sign(payload);

    // 로그인 시간 업데이트
    await this.userModel.updateOne({ ID }, { loginAt: new Date() });

    return token;
  }

  // 회원가입
  /**
   * param {string} ID - 아이디
   * param {string} PW - 비밀번호
   * param {string} role - 권한
   * param {string} recommend - 추천인
   * return Promise<User> - 생성된 사용자 정보
   */
  async signUp(ID: string, PW: string, role: string, recommend: string): Promise<User> {
    // 추천인 체크
    if(recommend !== undefined){
      const findUser = await this.userModel.findOne({ ID: recommend});
      if(findUser){
        await this.userModel.updateOne({ ID: recommend }, { $inc: { recommend: 1 } });
      }
    }
    return await this.userModel.create({ ID, PW, role, loginAt: new Date() });
  }
}
