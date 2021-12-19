export interface Vocab {
  id: string,
  word: string,
  meaning: string,
  notes?: string,

  viewedCount?: bigint
  lastViewed?: Date,
  lastUpdated?: Date,
  knewTheWord?: boolean[];

  emotions?: string[]
  simple?: boolean,
  known?: boolean
  image?: Image
}

export interface Image {
  name?: string
  createdTime?: Date,
  content?: BinaryType,
  contentType?: string,
  size?: bigint
  img?: Blob
}

export interface SearchRequest {
  id?: string,
  word?: string,
  emotion?: string,
  score?:string,
  page?:number,
  size?:number
}
