import { EventType } from '../config/variables'

export interface RewardStrategy {
  readonly eventType: EventType;

  handle(userId: string, rewardNums: number[]): Promise<void>;
}
