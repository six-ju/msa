import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventSchema } from './schemas/event.schema';
import { RewardSchema } from './schemas/reward.schema';
import { HistorySchema } from './schemas/history.schema';
import { UserSchema } from './schemas/user.schema';
import { DailyLoginStrategy } from './strategies/daily-login.strategy';
import { WeeklyLoginStrategy } from './strategies/weekly-login.strategy';
import { MonthlyLoginStrategy } from './strategies/monthly-login.strategy';
import { RecommendStrategy } from './strategies/recommend.strategy';
import { MoneyStrategy } from './strategies/money.strategy';
import { RewardStrategy } from './interfaces/reward-strategy.interface';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URL'),
      }),
      inject: [ConfigService],
    }),

    MongooseModule.forFeature([{ name: 'Event', schema: EventSchema }]),
    MongooseModule.forFeature([{ name: 'Reward', schema: RewardSchema }]),
    MongooseModule.forFeature([{ name: 'History', schema: HistorySchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    DailyLoginStrategy,
    WeeklyLoginStrategy,
    MonthlyLoginStrategy,
    RecommendStrategy,
    MoneyStrategy,
    {
      provide: 'REWARD_STRATEGIES',
      useFactory: (
        Daily: DailyLoginStrategy,
        Weekly: WeeklyLoginStrategy,
        Monthly: MonthlyLoginStrategy,
        Recommend: RecommendStrategy,
        Money: MoneyStrategy,
      ) => [Daily, Weekly, Monthly, Recommend, Money] as RewardStrategy[],
      inject: [
        DailyLoginStrategy,
        WeeklyLoginStrategy,
        MonthlyLoginStrategy,
        RecommendStrategy,
        MoneyStrategy,
      ],
    },
  ],
})
export class AppModule {}
