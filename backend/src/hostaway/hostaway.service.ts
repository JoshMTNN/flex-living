import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { HostawayApiResponse } from '../types/review.types';

@Injectable()
export class HostawayService {
  private readonly apiBaseUrl = 'https://api.hostaway.com/v1';
  private readonly accountId = process.env.HOSTAWAY_ACCOUNT_ID;
  private readonly apiKey = process.env.HOSTAWAY_API_KEY;

  async fetchReviews(): Promise<HostawayApiResponse> {
    try {
      if (!this.accountId || !this.apiKey) {
        throw new Error('Hostaway credentials are not set in environment variables.');
      }
      const mockDataPath = path.join(__dirname, '../mock/reviews.mock.json');
      const mockData = fs.readFileSync(mockDataPath, 'utf-8');
      return JSON.parse(mockData);
    } catch (error) {
      console.error('Error fetching reviews from Hostaway:', error);
      return {
        status: 'success',
        result: [],
      };
    }
  }
}
