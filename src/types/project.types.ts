export interface Location {
  lat: number
  lon: number
  label: string
}

export interface PartnerCharity {
  name: string
  description: string
  website: string
  logo: string
}

export interface Mission {
  heroImage: string
  problem: string
  solution: string
  impact: string[]
  partnerCharity: PartnerCharity
}

export interface ShopifyCollection {
  handle: string
  title: string
}

export interface Theme {
  primaryColor: string
  secondaryColor: string
}

export interface Project {
  id: string
  slug: string
  name: string
  tagline: string
  location: Location
  mission: Mission
  shopifyCollection: ShopifyCollection
  theme: Theme
}

export interface Satellite {
  id: string
  projectName: string
  position: { lat: number; lon: number }
  color: string
  threadColor: string
}
