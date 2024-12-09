import { Stack } from "@mui/material"
import { makeStyles } from "@mui/styles"
import { Caption } from "../../types"
import { ChangeEvent, KeyboardEvent, useState } from "react"

type CaptionEditorProps = {
  caption: Caption,
  onChange: (value: string)=> void
}

export function CaptionEditor(props: CaptionEditorProps){
  const { caption, onChange } = props

  const [value, setValue] = useState<string>(caption.word)
  
  const classes = useStyles()

  const handleChange = ({target: {value}}: ChangeEvent<HTMLInputElement>)=>{
    setValue(value)
  }

  const handleKeyDown = ({code}: KeyboardEvent<HTMLInputElement>)=>{
    if(code === 'Enter'){
      onChange(value)
    }
  }

  const handleButtonClick = () => {
    onChange('')
  }
  
  return (
    <Stack className={classes.captionEditor}>
      <input autoFocus={true} className={classes.captionEditorInput} name="caption" value={value} onChange={handleChange} onKeyDown={handleKeyDown} />
      <span className={classes.captionEditorButton} onClick={handleButtonClick}>Remove Caption</span>
    </Stack>
  )
}

const useStyles = makeStyles(()=>({  
  captionEditor: {
    backgroundColor: '#1B1B1B',
    padding: '20px',
  },

  captionEditorInput: {
    backgroundColor: '#2C2F31',
    color: 'white',
    padding: '10px 5px',
    
    border: 'none',
    outline: 'none',
    borderRadius: '6px',
  },

  captionEditorButton: {
    marginTop: '10px',
    fontSize: '12px',
    cursor: 'pointer',
    color: 'red',
  },
}))