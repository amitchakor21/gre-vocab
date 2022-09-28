export interface Vocab {
  id: string,
  word: string,
  meaning: string,
  familiarLevel: string,
  notes?: string,

  trickySpell?: boolean,
  trickyPronounce?: boolean,
  total?: number
}

export interface SearchRequest {
  id?: string,
  word?: string,
  score?: string,
  page?: number,
  size?: number
}

export interface RegexSelection {
  name: string,
  prefix: string,
  suffix: string
}

export interface GoogleApiResponse {
  word: string
  phonetic?: string
  phonetics: Phonetic[]
  origin?: string
  meanings: Meaning[]
}

export interface Phonetic {
  text: string,
  audio: string
}

export interface Meaning {
  partOfSpeech: string,
  definitions: Definition[]
}

export interface Definition {
  definition: string,
  example: string,
  synonyms: string[],
  antonyms: string[]
}
