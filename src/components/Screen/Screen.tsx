import {forwardRef, LegacyRef} from 'react'
import ReactPlayer from "react-player"
import { OnProgressProps } from 'react-player/base'

type ScreenProps = {
  url: string, 
  isPlaying: boolean
  onReady?: (player: ReactPlayer) => void
  onProgress?: (state: OnProgressProps) => void
  onError?: (
    error: any,
    data?: any,
    hlsInstance?: any,
    hlsGlobal?: any
  ) => void
} 
export const Screen = forwardRef((props: ScreenProps, ref: LegacyRef<ReactPlayer>)=>{
  const {url, isPlaying, onReady, onProgress, onError} = props
  return (<ReactPlayer
      ref={ref}
      url={url}
      playing={isPlaying}
      progressInterval={100}
      onReady={onReady}
      onProgress={onProgress}
      onError={onError}
  />)
})