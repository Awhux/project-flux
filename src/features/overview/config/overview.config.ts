import type { OverviewData } from "../types"

/**
 * Mock data for overview page
 * Will be replaced with real API data later
 */
export const mockOverviewData: OverviewData = {
  metrics: {
    totalClicks: 12345,
    totalLeads: 1234,
    conversionRate: 10.2,
    activeLinks: 24,
  },
  trends: {
    clicks: { value: 12.5, isPositive: true },
    leads: { value: 8.2, isPositive: true },
    conversion: { value: 2.1, isPositive: false },
    activeLinks: { value: 24, isPositive: true },
  },
  clicksChart: [
    { date: "1 Jan", clicks: 120 },
    { date: "5 Jan", clicks: 180 },
    { date: "10 Jan", clicks: 240 },
    { date: "15 Jan", clicks: 320 },
    { date: "20 Jan", clicks: 280 },
    { date: "25 Jan", clicks: 360 },
    { date: "30 Jan", clicks: 420 },
  ],
  utmChart: [
    { source: "Facebook", clicks: 1250 },
    { source: "Instagram", clicks: 980 },
    { source: "Google", clicks: 750 },
    { source: "Direto", clicks: 420 },
    { source: "Twitter", clicks: 230 },
  ],
  usage: {
    current: 45,
    limit: 100,
    planTier: "FREE",
  },
  // New chart data
  topLinks: [
    {
      id: "1",
      slug: "promo-janeiro",
      clicks: 3420,
      trend: { value: 15.2, isPositive: true },
      sparkline: [120, 180, 220, 280, 320, 380, 420],
    },
    {
      id: "2",
      slug: "black-friday",
      clicks: 2890,
      trend: { value: 8.5, isPositive: true },
      sparkline: [200, 220, 180, 260, 300, 340, 390],
    },
    {
      id: "3",
      slug: "lancamento-v2",
      clicks: 1950,
      trend: { value: 3.2, isPositive: false },
      sparkline: [180, 200, 190, 170, 160, 175, 165],
    },
    {
      id: "4",
      slug: "desconto-vip",
      clicks: 1420,
      trend: { value: 22.1, isPositive: true },
      sparkline: [80, 100, 140, 180, 220, 280, 340],
    },
    {
      id: "5",
      slug: "frete-gratis",
      clicks: 890,
      trend: { value: 5.8, isPositive: true },
      sparkline: [60, 70, 85, 90, 100, 110, 120],
    },
  ],
  funnel: {
    totalClicks: 12345,
    totalLeads: 1234,
    totalConversions: 987,
  },
  geoData: [
    { region: "São Paulo", flag: "🇧🇷", clicks: 5840, percentage: 47.3 },
    { region: "Rio de Janeiro", flag: "🇧🇷", clicks: 2450, percentage: 19.8 },
    { region: "Minas Gerais", flag: "🇧🇷", clicks: 1680, percentage: 13.6 },
    { region: "Paraná", flag: "🇧🇷", clicks: 980, percentage: 7.9 },
    { region: "Outros", flag: "🌎", clicks: 1395, percentage: 11.4 },
  ],
  recentActivity: [
    {
      id: "act-1",
      type: "lead",
      linkSlug: "promo-janeiro",
      metadata: { visitorName: "João Silva", utmSource: "Facebook" },
      timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
    },
    {
      id: "act-2",
      type: "click",
      linkSlug: "black-friday",
      metadata: { utmSource: "Instagram", region: "São Paulo" },
      timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    },
    {
      id: "act-3",
      type: "whatsapp",
      linkSlug: "desconto-vip",
      metadata: { visitorName: "Maria Oliveira" },
      timestamp: new Date(Date.now() - 12 * 60 * 1000), // 12 minutes ago
    },
    {
      id: "act-4",
      type: "click",
      linkSlug: "lancamento-v2",
      metadata: { utmSource: "Google", region: "Rio de Janeiro" },
      timestamp: new Date(Date.now() - 18 * 60 * 1000), // 18 minutes ago
    },
    {
      id: "act-5",
      type: "lead",
      linkSlug: "frete-gratis",
      metadata: { visitorName: "Carlos Santos", utmSource: "Facebook" },
      timestamp: new Date(Date.now() - 25 * 60 * 1000), // 25 minutes ago
    },
    {
      id: "act-6",
      type: "link_created",
      linkSlug: "nova-colecao",
      timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    },
    {
      id: "act-7",
      type: "click",
      linkSlug: "promo-janeiro",
      metadata: { utmSource: "Direct", region: "Minas Gerais" },
      timestamp: new Date(Date.now() - 58 * 60 * 1000), // 58 minutes ago
    },
    {
      id: "act-8",
      type: "whatsapp",
      linkSlug: "black-friday",
      metadata: { visitorName: "Ana Costa" },
      timestamp: new Date(Date.now() - 72 * 60 * 1000), // 1h 12m ago
    },
  ],
}
