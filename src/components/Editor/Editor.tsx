import { Box, Button, Input, Popover, Stack } from "@mui/material"
import makeStyles from "@mui/styles/makeStyles"
import { ChangeEvent, ChangeEventHandler, useEffect, useRef, useState } from "react"
import ReactPlayer from "react-player"
import { OnProgressProps } from "react-player/base"
import { Caption, PlayerData } from "../../types"
import { getCaptionByTime, getCaptionRelatives } from "../../utils"
import { CaptionsList } from "../CaptionsList/CaptionsList"
import { Screen } from "../Screen/Screen"
import { Timeline } from "../Timeline/Timeline"
import { CaptionEditor } from "../CaptionEditor/CaptionEditor"

const data: PlayerData = {
  videoUrl:
    "https://storage.googleapis.com/loomz-downloaded-videos/storage_folder/id_246_1732534559723low.mp4",
  startTime: 10,
  endTime: 45,
  captions: [
    {
      word: "He",
      start_time: 10,
      end_time: 10.6,
    },
    {
      word: "is",
      start_time: 10.6,
      end_time: 11.1,
    },
    {
      word: "so",
      start_time: 11.1,
      end_time: 11.6,
    },
    {
      word: "but",
      start_time: 12.1,
      end_time: 12.6,
    },
    {
      word: "when",
      start_time: 13,
      end_time: 13.5,
    },
    {
      word: "we",
      start_time: 14,
      end_time: 14.5,
    },
    {
      word: "do",
      start_time: 15,
      end_time: 15.5,
    },
    {
      word: "something",
      start_time: 16,
      end_time: 17,
    },
    {
      word: "things",
      start_time: 17,
      end_time: 17.5,
    },
  ],
}

async function getData(): Promise<PlayerData> {
  return Promise.resolve(data)
}

export function Editor() {
  const [url, setUrl] = useState<string>('')
  
  const [captions, setCaptions] = useState<Array<Caption>>([])
  const [curCaptionIndex, setCurCaptionIndex] = useState<number>(-1)
  const [editCaptionIndex, setEditCaptionIndex] = useState<number>(-1)
  
  const [startTime, setStartTime] = useState<number>(0)
  const [endTime, setEndTime] = useState<number>(0)
  const [curTime, setCurTime] = useState<number>(0)

  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [isReady, setIsReady] = useState<boolean>(false)

  const playerRef = useRef<ReactPlayer>(null)
  const mainBlockRef = useRef(null)

  const captionOnEdit = captions[editCaptionIndex]
  const curProgress = ((curTime-startTime) * 100) / (endTime-startTime)
  const curCaptionRelatives = getCaptionRelatives(captions, curCaptionIndex)

  const classes = useStyles()

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const handleCaptionEdit = (index: number) => {
    const caption = captions[index]

    if(!caption || !playerRef.current){
      return
    }

    setIsPlaying(false)
    playerRef.current.seekTo(caption.start_time)
    setEditCaptionIndex(index)
  }
  
  const handleCaptionEditClose = ()=>{
    setEditCaptionIndex(-1)
    setIsPlaying(true)
  }

  const handleCaptionEditChange = (value: string)=>{
    const caption = captions[editCaptionIndex]

    if(!caption){
      return
    }

    const editedCaptions = [...captions]
    if (value) {
      editedCaptions[editCaptionIndex] = {...caption, word: value}
    } else {
      editedCaptions.splice(editCaptionIndex, 1)
    }

    setCaptions(editedCaptions)
    handleCaptionEditClose()
  }

  const handleReady = () => {
    if(playerRef.current && !isReady) {
      playerRef.current.seekTo(curTime)
    }
    setIsReady(true)
  }

  const handleProgress = (data: OnProgressProps) => {
    setCurTime(data.playedSeconds)
  }

  const handleError = (...args: Array<any>)=>{
    console.log('onError', args)
  }

  const handleSeek = (percent: number)=>{
    if(playerRef.current) {
      const value = startTime + (percent / 100) * (endTime - startTime) 
      playerRef.current.seekTo(value)
    }
  }

  useEffect(() => {
    getData().then((data) => {
      setUrl(data.videoUrl)
      setCaptions(data.captions)
      setStartTime(data.startTime)
      setEndTime(data.endTime)
      setCurTime(data.startTime)
    })
  }, [])

  useEffect(() => {
    if(curTime >= endTime) {
      setIsPlaying(false)
    }

    setCurCaptionIndex(getCaptionByTime(captions, curTime))
  }, [curTime])

  return (
    <Stack ref={mainBlockRef} direction='column' gap='10px' position='relative'>
      {isReady && (<Button onClick={togglePlay}>{isPlaying ? 'Pause':'Play'}</Button>)}
      <Stack direction='row' gap='10px'>
        <Box display='flex' width='50%'>
          <CaptionsList captions={captions} activeIndex={curCaptionIndex} onEditCaption={handleCaptionEdit}/>
        </Box>
        <Box display='flex' width='50%' position='relative'>
          <Screen ref={playerRef} url={url} isPlaying={isPlaying} onReady={handleReady} onProgress={handleProgress} onError={handleError}/>
          {curCaptionRelatives.length && (
            <Box className={classes.captionTooltip}>
              <CaptionsList captions={curCaptionRelatives} activeIndex={getCaptionByTime(curCaptionRelatives, curTime)} onEditCaption={handleCaptionEdit}/>
            </Box>
          )}
        </Box>
      </Stack>
      <Timeline curProgress={curProgress} onClick={handleSeek}/>

      {captionOnEdit && (
        <Popover 
        open={true}
        anchorEl={mainBlockRef.current}
        onClose={handleCaptionEditClose}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
      >
        <CaptionEditor caption={captionOnEdit} onChange={handleCaptionEditChange} />
      </Popover>
      )}
    </Stack>
  )
}

const useStyles = makeStyles(()=>({
    captionTooltip: {
      position: 'absolute',
      bottom: '20px',
      left: '50%',
      transform: 'translate(-50% 0)'
    },
}))