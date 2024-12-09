import { Box } from "@mui/material"
import makeStyles from "@mui/styles/makeStyles"
import { Caption } from "../../types"
import { roundTo } from "../../utils"

type CaptionsListProps = {
  captions: Array<Caption>
  activeIndex: number
  onEditCaption: (index:number) => void
}

export function CaptionsList(props: CaptionsListProps) {
  const {captions, activeIndex, onEditCaption} = props

  const classes = useStyles()

  return (<Box className={classes.captionsList}>
    {captions.map((item, index)=>{

       const key = `${item.word}-${item.start_time}`

      return (
        <Box key={key} display='inline-block'>
          <CaptionsSpan prevCaption={captions[index-1]} caption={item}/>
          <CaptionItem caption={item} isActive={index === activeIndex} onClick={()=> onEditCaption(index)}/>
        </Box>
    )
    })}
  </Box>)
}

type CaptionItemProps = {
  caption: Caption
  isActive: boolean
  onClick: () => void
}

export function CaptionItem(props: CaptionItemProps){
  const {caption, isActive=false, onClick} = props

  const classes = useStyles()

  return (<Box className={classes.captionsListItem} onClick={onClick} sx={{
    bgcolor: isActive ? '#ccc': undefined
  }}>{caption.word}</Box>)
}

type CaptionsSpanProps = {
  prevCaption?: Caption
  caption: Caption
}

function CaptionsSpan(props: CaptionsSpanProps) {
  const {prevCaption, caption} = props

  const classes = useStyles()

  if(!prevCaption){
    return null
  }

  const timeSpan = roundTo((caption.start_time - prevCaption.end_time), 2)

  if(timeSpan <= 0){
    return null
  }

  return <Box className={classes.captionsSpan}>{timeSpan}s</Box>
}

const useStyles = makeStyles(() => ({
  captionsList: {
    display: 'block',
    fontSize: '12px'
  },
  captionsListItem: {
    cursor: 'pointer',
    display: 'inline-block',
    padding: 0,
    margin: '0 3px',
    textAlign: 'left',
  },
  captionsSpan: {
    display: 'inline-block',
    color: '#888',
    padding: "0 5px",
  }
}));