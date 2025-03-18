interface LocationOption {
  label: string
  value: number
}

interface Address {
  province: LocationOption
  district: LocationOption
  neighborhood: LocationOption
  postalCode: string
  streetAddress: string
}

interface BillingInfo {
  type: string // "personal" or "corporate"
  companyName?: string
  taxNumber?: string
  taxOffice?: string
}

export interface AddressRecord {
  deliveryAddress: Address
  billingInfo: BillingInfo
  useSeparateAddress: boolean
  billingAddress?: Address
}
