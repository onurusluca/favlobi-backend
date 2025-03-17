export enum UserRole {
  USER = 'user', // Storefront customer
  VENDOR = 'vendor', // Seller
  ADVOCATE = 'advocate', // Affiliate, referrer, influencer etc.
  MODERATOR = 'moderator', // Admin with limited access: approve/reject products, reviews, comments etc.
  ADMIN = 'admin', // Full admin access, superuser
}

export enum UserStatus {
  ACTIVE = 'active',
  BANNED = 'banned',
}

export enum VendorStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum AdvocateStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum ProductStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}
