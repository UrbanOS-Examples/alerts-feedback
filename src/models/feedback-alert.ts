export interface FeedbackAlert {
  id: string,
  type?: string,
  severity?: string,
  time?: string,
  latitude?: number,
  longitude?: number,
  location?: string,
  status?: string,
  speed?: number,
  avgSpeed?: number,
  refSpeed?: number,
  camera?: string,
  functionalClass?: string,
  isCongestion?: boolean
}
