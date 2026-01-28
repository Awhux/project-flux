/**
 * Access control configuration for RBAC
 */

import { createAccessControl } from 'better-auth/plugins/access'

/**
 * Define the access control statement for all resources and actions
 */
const statement = {
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
} as const

/**
 * Access control instance for managing permissions
 */
export const accessControl = createAccessControl(statement)
