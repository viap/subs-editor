import { Box } from "@mui/material"
import makeStyles from "@mui/styles/makeStyles"
import { SyntheticEvent, useRef } from "react"

type TimelineProps = {
  curProgress: number
  onClick: (value: number) => void
}
export function Timeline(props: TimelineProps) {
  const {curProgress, onClick} = props

  const classes = useStyles()

  const ref = useRef<HTMLElement>(null)

  const progressPosition = curProgress >=0 && curProgress<= 100 ? curProgress: 0;

  const handleClick = (e: SyntheticEvent)=>{
    if(!ref.current) {
      return
    }

 
    const offsetLeft = ref.current.getBoundingClientRect().left
    const cursorPosition = (e as unknown as {clientX: number}).clientX 
    const value = ((cursorPosition - offsetLeft) * 100) / ref.current.clientWidth

    if(value >= 0 && value <= 100) {
      onClick(value)
    }
  }

  return (
    <Box ref={ref} className={classes.timeline} onClick={handleClick}>
      <Box className={classes.progressLine} left={`${progressPosition}%`}/>
    </Box>
  )
}

const useStyles = makeStyles(() => ({
  timeline: {
    position: 'relative',
    overflow: 'hidden',

    width: '100%',
    height: '50px',
    
    border: '1px solid grey',
    borderRadius: '20px',
  },
  progressLine: {
    position: 'absolute',
    top: '0',
    bottom: '0',

    width: '0px',
    border: '1px solid white'
  }
}));