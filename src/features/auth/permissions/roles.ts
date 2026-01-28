/**
 * Role definitions for RBAC
 */

import { accessControl } from './access-control'

/**
 * Owner role with full access to all resources
 */
export const owner = accessControl.newRole({
  dashboard: [
    'read',
    'view:cashflow',
    'view:reports',
    'view:recent-transactions',
  ],
  transactions: ['create', 'read', 'update', 'delete'],
  accounts: ['create', 'read', 'update', 'delete'],
  categories: ['create', 'read', 'update', 'delete'],
  loans: ['create', 'read', 'update', 'delete'],
  investments: ['create', 'read', 'update', 'delete'],
  people: ['create', 'read', 'update', 'delete'],
})
