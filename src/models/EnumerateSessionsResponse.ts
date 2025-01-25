import {SaveHeader} from "./SaveHeader";

interface SaveHeaderRaw extends Omit<SaveHeader, "saveDateTime" | "playDurationString"> {
  saveDateTime: string
}

export interface EnumerateSessionsResponse {
  sessions: {
    sessionName: string,
    saveHeaders: SaveHeaderRaw[]
  }[]
}