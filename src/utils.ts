import { Caption } from "./types"

export const roundTo = (value: number, digitsCount: number) => {
  const multiplier = Math.pow(10,digitsCount > 1 ? digitsCount: 1 )
  return Math.round(value* multiplier)/multiplier
}

export const getCaptionByTime = (captionsList: Array<Caption>, time: number) => {
  return captionsList.findIndex((item)=>{
    return time >= item.start_time && time <= item.end_time
  }) ?? -1
}

export function getCaptionRelatives(captions: Array<Caption>, index: number){
  const caption = captions[index]

  if(!caption) {
    return []
  }

  let firstIndex: number = index
  for(let prevIndex=firstIndex-1; prevIndex >= 0; prevIndex--){
    const curCaption = captions[firstIndex]
    const prevCaption = captions[prevIndex]

    if(curCaption && prevCaption){
      const timeSpan = roundTo((curCaption.start_time - prevCaption.end_time), 2)
      if(timeSpan === 0){
        firstIndex = prevIndex
        continue;
      }
    } 
    break;
  }

  let lastIndex: number = index
  for(let nextIndex=lastIndex+1; nextIndex < captions.length; nextIndex++){
    const curCaption = captions[lastIndex]
    const nextCaption = captions[nextIndex]

    if(curCaption && nextCaption){
      const timeSpan = roundTo((nextCaption.start_time - curCaption.end_time), 2)
      if(timeSpan === 0) {
        lastIndex = nextIndex
        continue;
      }
    } 
    break;
  }

  return captions.slice(firstIndex, lastIndex+1)
}