const ROLES = ['user', 'owner', 'admin'];

const ACCOUNT_STATUSES = ['pending_verification', 'active', 'banned', 'rejected'];

const UNIT_TYPES = ['apartment', 'room', 'studio', 'bed'];

const LISTING_TYPES = ['rent', 'sale'];

const UNIT_STATUSES = [
  'pending_payment',
  'pending_approval',
  'available',
  'rented',
  'sold',
  'rejected',
  'pending',
  'deleted'
];

const PAYMENT_METHODS = ['vodafone_cash', 'instapay', 'bank_transfer', 'online_gateway'];

const PAYMENT_STATUSES = ['pending', 'confirmed', 'rejected'];

const NOTIFICATION_TYPES = [
  'chat',
  'unit_approved',
  'unit_rejected',
  'payment_confirmed',
  'payment_rejected',
  'booking_confirmed',
  'feature_approved',
  'feature_rejected'
];

const AUDIT_ACTIONS = [
  'approve_unit',
  'reject_unit',
  'approve_payment',
  'reject_payment',
  'ban_user',
  'unban_user',
  'flag_user',
  'status_change',
  'request_feature',
  'approve_feature',
  'reject_feature'
];

const AD_LOCATIONS = ['home', 'search', 'dashboard'];

module.exports = {
  ROLES,
  ACCOUNT_STATUSES,
  UNIT_TYPES,
  LISTING_TYPES,
  UNIT_STATUSES,
  PAYMENT_METHODS,
  PAYMENT_STATUSES,
  NOTIFICATION_TYPES,
  AUDIT_ACTIONS,
  AD_LOCATIONS
};
