import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventSchema } from './schemas/event.schema';
import { RewardSchema } from './schemas/reward.schema';

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

    MongooseModule.forFeature([{ name: 'Event', schema: EventSchema}]),
    MongooseModule.forFeature([{ name: 'Reward', schema: RewardSchema}])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
