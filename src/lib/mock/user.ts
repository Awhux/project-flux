export type PlanTier = "FREE" | "PRO" | "AGENCY"

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  avatar?: string
  planTier: PlanTier
  createdAt: Date
}

export interface PlanUsage {
  current: number
  limit: number
  percentage: number
}

export interface PlanFeatures {
  clicksPerMonth: number
  maxActiveLinks: number | "unlimited"
  facebookCAPI: boolean
  ghostMode: boolean
  prioritySupport: boolean
  whiteLabel: boolean
  analytics: "basic" | "advanced" | "full"
}

export const mockUser: User = {
  id: "user-1",
  firstName: "João",
  lastName: "Silva",
  email: "joao@example.com",
  phone: "+55 (11) 98765-4321",
  planTier: "FREE",
  createdAt: new Date("2025-12-01"),
}

export const mockPlanUsage: PlanUsage = {
  current: 45,
  limit: 100,
  percentage: 45,
}

export const planFeatures: Record<PlanTier, PlanFeatures> = {
  FREE: {
    clicksPerMonth: 100,
    maxActiveLinks: 1,
    facebookCAPI: false,
    ghostMode: false,
    prioritySupport: false,
    whiteLabel: false,
    analytics: "basic",
  },
  PRO: {
    clicksPerMonth: 5000,
    maxActiveLinks: "unlimited",
    facebookCAPI: true,
    ghostMode: true,
    prioritySupport: false,
    whiteLabel: false,
    analytics: "advanced",
  },
  AGENCY: {
    clicksPerMonth: Infinity,
    maxActiveLinks: "unlimited",
    facebookCAPI: true,
    ghostMode: true,
    prioritySupport: true,
    whiteLabel: true,
    analytics: "full",
  },
}

export const planPricing = {
  FREE: { monthly: 0, yearly: 0 },
  PRO: { monthly: 29, yearly: 290 }, // ~$24/month when paid yearly
  AGENCY: { monthly: 99, yearly: 990 }, // ~$82/month when paid yearly
}
