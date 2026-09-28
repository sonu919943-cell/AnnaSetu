// AnnaSetu — Surplus Batch Status Lifecycle Constants
// Used across Business, NGO, and Fertilizer dashboards + Firestore writes

export const BATCH_STATUS = {
  PENDING_SCAN:          'PENDING_SCAN',          // Just logged, awaiting AI scan
  VERIFYING:             'VERIFYING',             // AI scan in progress
  PENDING_NGO:           'PENDING_NGO',           // Edible → waiting for NGO (30-min window)
  PENDING_FERTILIZER:    'PENDING_FERTILIZER',    // Edible → 30 min expired, now available to fertilizer
  SPOILED_PENDING:       'SPOILED_PENDING',       // Spoiled → directly available to fertilizer
  ACCEPTED_EN_ROUTE:     'ACCEPTED_EN_ROUTE',     // NGO or Fertilizer accepted, pickup dispatched
  ACCEPTED_AND_VERIFIED: 'ACCEPTED_AND_VERIFIED', // Delivery scan confirmed
  DELIVERED:             'DELIVERED',             // Fully completed
  EXPIRED:               'EXPIRED',              // No one claimed within allowed window
};

// 30-minute NGO-exclusive claim window (in milliseconds)
export const NGO_WINDOW_MS = 30 * 60 * 1000; // 30 minutes
export const NGO_WINDOW_MINUTES = 30;
