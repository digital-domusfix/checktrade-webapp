// src/utils/serializers.ts
export interface GeoLocationDto {
  lat: number
  lng: number
}

export interface AddressForm {
  line1: string
  line2?: string
  city: string
  province: string
  postalCode: string
  country: string
}

export interface CreatePropertyRequest {
  customerProfileId: string,
  nickname?: string
  address: {
    line1: string
    line2?: string
    city: string
    province: string
    postalCode: string
    country: string
    geoLocation: GeoLocationDto
  }
}

export const toCreatePropertyRequest = (
 customerProfileId: string,
  address: AddressForm,
  nickname?: string
): CreatePropertyRequest => ({
  customerProfileId: customerProfileId,
  nickname: nickname ?? `Property at ${address.line1}`,
  address: {
    ...address,
    geoLocation: { lat: 0, lng: 0 }, // placeholder
  },
})
