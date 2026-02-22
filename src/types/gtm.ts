/**
 * GTM/Outreach domain types — reference for future features.
 * See docs/GTM_SYSTEM_REFERENCE.md for architecture.
 */

export interface Product {
  id: number;
  name: string;
  executiveSummary: string;
  pid: string;
  icpNotes: string;
  refinedIcp?: string;
  painStatement?: string;
  outcomeStatement?: string;
  betaOffer?: string;
  pricingHypothesis?: string;
  objectionMatrix?: string;
  updatedAt: string;
}

export interface Contact {
  id: number;
  name: string;
  company: string;
  role: string;
  icpScore: number;
  channel: "LinkedIn" | "Email";
  status:
    | "Pending"
    | "Sent"
    | "Replied"
    | "Call Booked"
    | "Closed"
    | "Rejected";
  lastOutreachDate?: string;
  revenueValue: number;
  notes?: string;
}

export interface OutreachMessage {
  id: number;
  contactId: number;
  productId: number;
  type: "Initial" | "Follow-up" | "Reactivation";
  content: string;
  sentAt?: string;
}

export interface Reply {
  id: number;
  contactId: number;
  content: string;
  classification:
    | "Interested"
    | "Maybe later"
    | "Objection"
    | "Referral"
    | "Not ICP"
    | "No response";
  suggestedReply?: string;
  receivedAt: string;
}

export interface Analytics {
  outreachSent: number;
  replyRate: number;
  callBookedRate: number;
  closeRate: number;
  totalRevenue: number;
  objectionFrequency: Record<string, number>;
}
