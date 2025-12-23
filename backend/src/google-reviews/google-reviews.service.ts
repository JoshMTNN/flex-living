import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GoogleReviewsService {
  private readonly apiKey = process.env.GOOGLE_PLACES_API_KEY;
  private readonly apiBaseUrl = 'https://maps.googleapis.com/maps/api/place';

  /**
   * Research findings:
   * Google Places API (new) doesn't expose individual reviews.
   * Only aggregate rating and total count are available.
   * Google My Business API provides reviews but requires business verification and OAuth.
   */

  async getPlaceDetails(placeId: string) {
    if (!this.apiKey) {
      throw new Error('Google Places API key not configured');
    }

    const response = await axios.get(`${this.apiBaseUrl}/details/json`, {
      params: {
        place_id: placeId,
        key: this.apiKey,
        fields: 'rating,user_ratings_total',
      },
    });

    return response.data;
  }

  async getReviews() {
    throw new Error(
      'Individual Google reviews are not available via Places API. Use Google My Business API with business verification.'
    );
  }
}
