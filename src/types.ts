export type PlayerData = {
  videoUrl: string
  startTime: number
  endTime: number
  captions: Array<Caption>
}

export type Caption = {
  word: string
  start_time: number
  end_time: number
}

export type PlayerObject = {
  seekTo: (amount: number, type?: 'seconds' | 'fraction')=> void
}