import axios, {Axios} from "axios";
import * as https from "node:https";
import {ServerGameState} from "./models/ServerGameState";
import {SatisfactoryResponse} from "./models/SatisfactoryResponse";
import {ServerGameStateResponse} from "./models/ServerGameStateResponse";
import {EnumerateSessionsResponse} from "./models/EnumerateSessionsResponse";
import {parse} from "date-fns";
import {SaveHeader} from "./models/SaveHeader";
import {Stream} from "node:stream";

export class SatisfactoryRepository {
  private api: Axios

  constructor() {
    this.api = axios.create({
      httpsAgent: new https.Agent({
        rejectUnauthorized: false
      }),
      baseURL: `https://${process.env.SERVER_IP}:${process.env.SERVER_PORT}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SERVER_TOKEN}`
      }
    })
  }

  public async getLatestSave(sessionName: string): Promise<SaveHeader | null> {
    const sessions = await this.getSessions()

    const session = sessions.find(s => s.sessionName === sessionName)

    if (!session) {
      return null
    }

    return session.saveHeaders[0]
  }

  public async getServerState(): Promise<ServerGameState> {
    const res = await this.apiV1<ServerGameStateResponse>("QueryServerState")

    return res.data.serverGameState
  }

  public async getSessions() {
    const { data: { sessions }} = await this.apiV1<EnumerateSessionsResponse>("EnumerateSessions")

    return sessions.map(session => ({
      ...session,
      saveHeaders: session.saveHeaders.map(saveHeader => ({
        ...saveHeader,
        saveDateTime: parse(saveHeader.saveDateTime, "yyyy.MM.dd-HH.mm.ss", new Date()),
        playDurationString: this.secondsToTimestamp(saveHeader.playDurationSeconds)
      }))
    }))
  }

  private secondsToTimestamp(seconds: number): string {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor(seconds & 86400 / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)

    return `${days}d ${hours}h ${minutes}min`
  }

  public async downloadSave(saveName: string): Promise<Stream> {
    const res = await this.api.post(`/api/v1`, {
      function: "DownloadSaveGame",
      data: {
        SaveName: saveName
      }
    }, { responseType: 'stream' })

    return res.data
  }

  private async apiV1<T>(functionName: string, data?: object): Promise<SatisfactoryResponse<T>> {
    const res = await this.api.post(`/api/v1`, {
      function: functionName,
      data
    })

    return res.data
  }
}