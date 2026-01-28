export interface ClicksDataPoint {
  date: string
  clicks: number
}

export interface UtmDataPoint {
  source: string
  clicks: number
}

export interface DeviceDataPoint {
  device: string
  value: number
}

export const mockClicksData: ClicksDataPoint[] = [
  { date: "Jan 1", clicks: 120 },
  { date: "Jan 2", clicks: 145 },
  { date: "Jan 3", clicks: 135 },
  { date: "Jan 4", clicks: 160 },
  { date: "Jan 5", clicks: 180 },
  { date: "Jan 6", clicks: 165 },
  { date: "Jan 7", clicks: 190 },
  { date: "Jan 8", clicks: 210 },
  { date: "Jan 9", clicks: 225 },
  { date: "Jan 10", clicks: 240 },
  { date: "Jan 11", clicks: 220 },
  { date: "Jan 12", clicks: 235 },
  { date: "Jan 13", clicks: 260 },
  { date: "Jan 14", clicks: 285 },
  { date: "Jan 15", clicks: 320 },
  { date: "Jan 16", clicks: 305 },
  { date: "Jan 17", clicks: 295 },
  { date: "Jan 18", clicks: 310 },
  { date: "Jan 19", clicks: 290 },
  { date: "Jan 20", clicks: 280 },
  { date: "Jan 21", clicks: 300 },
  { date: "Jan 22", clicks: 325 },
  { date: "Jan 23", clicks: 340 },
  { date: "Jan 24", clicks: 355 },
  { date: "Jan 25", clicks: 360 },
  { date: "Jan 26", clicks: 380 },
  { date: "Jan 27", clicks: 395 },
  { date: "Jan 28", clicks: 405 },
  { date: "Jan 29", clicks: 415 },
  { date: "Jan 30", clicks: 420 },
]

export const mockUtmSource: UtmDataPoint[] = [
  { source: "Facebook", clicks: 1250 },
  { source: "Instagram", clicks: 980 },
  { source: "Google", clicks: 750 },
  { source: "Direct", clicks: 420 },
  { source: "Twitter", clicks: 230 },
  { source: "LinkedIn", clicks: 180 },
  { source: "TikTok", clicks: 150 },
  { source: "Email", clicks: 120 },
]

export const mockUtmMedium: UtmDataPoint[] = [
  { source: "Social", clicks: 2230 },
  { source: "CPC", clicks: 1050 },
  { source: "Organic", clicks: 890 },
  { source: "Email", clicks: 460 },
  { source: "Referral", clicks: 320 },
  { source: "Display", clicks: 130 },
]

export const mockUtmCampaign: UtmDataPoint[] = [
  { source: "Summer Sale", clicks: 1800 },
  { source: "Black Friday", clicks: 1200 },
  { source: "New Product Launch", clicks: 950 },
  { source: "Newsletter Q1", clicks: 680 },
  { source: "Retargeting", clicks: 520 },
  { source: "Brand Awareness", clicks: 430 },
]

export const mockDeviceData: DeviceDataPoint[] = [
  { device: "Mobile", value: 2540 },
  { device: "Desktop", value: 1320 },
  { device: "Tablet", value: 560 },
  { device: "Other", value: 210 },
]

export const mockMetrics = {
  totalClicks: 12345,
  totalLeads: 1234,
  conversionRate: 0.102,
  activeLinks: 24,
  avgClickTime: "2.5m",
  trends: {
    clicks: { value: 12.5, isPositive: true },
    leads: { value: 8.2, isPositive: true },
    conversionRate: { value: 2.1, isPositive: false },
  },
}
