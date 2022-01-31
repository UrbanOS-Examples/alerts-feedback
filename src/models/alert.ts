export interface Alert {
  id: string,
  type?: string,
  severity?: string,
  time?: string,
  coordinates?: {
    latitude: number,
    longitude: number
  }
  location?: string,
  status?: string,
  speed?: number,
  avgSpeed?: number,
  refSpeed?: number,
  camera?: string
}
