export function makeRowColKey (row:number, col:number) {
  return `row:${row}col:${col}`
}

export function getTextStyle (textSize = 16) {
  const textStyle = {
    stroke: '#272736',
    strokeThickness: 4,
    font: `${textSize}px 'Roboto Mono','Itim'`,
    fill: '#fff'
  }
  return textStyle
}
