import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { ApprovalStatus } from '../types/review.types';

@Injectable()
export class ReviewsApprovalService {
  private readonly dataDir = path.join(__dirname, '../../data');
  private readonly approvalsFile = path.join(this.dataDir, 'approvals.json');

  constructor() {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }

    if (!fs.existsSync(this.approvalsFile)) {
      fs.writeFileSync(this.approvalsFile, JSON.stringify({}, null, 2));
    }
  }

  private readApprovals(): Record<number, boolean> {
    try {
      const data = fs.readFileSync(this.approvalsFile, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading approvals:', error);
      return {};
    }
  }

  private writeApprovals(approvals: Record<number, boolean>): void {
    try {
      fs.writeFileSync(this.approvalsFile, JSON.stringify(approvals, null, 2));
    } catch (error) {
      console.error('Error writing approvals:', error);
      throw error;
    }
  }

  getAllApprovals(): Record<number, boolean> {
    return this.readApprovals();
  }

  getApprovalStatus(reviewId: number): boolean {
    const approvals = this.readApprovals();
    return approvals[reviewId] || false;
  }

  updateApprovalStatus(reviewId: number, approved: boolean): void {
    const approvals = this.readApprovals();
    approvals[reviewId] = approved;
    this.writeApprovals(approvals);
  }

  bulkUpdateApprovals(updates: ApprovalStatus[]): void {
    const approvals = this.readApprovals();
    updates.forEach(({ reviewId, approved }) => {
      approvals[reviewId] = approved;
    });
    this.writeApprovals(approvals);
  }
}
