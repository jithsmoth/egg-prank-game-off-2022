import { StageData } from '.'
import { DIR } from '../constant'

export const stage2: StageData = {
  stageNum: 2,
  title: 'Mission: 2',
  row: 3,
  column: 5,
  maxInput: 7,
  startTile: [
    {
      id: 0,
      row: 0,
      col: 0,
      dir: DIR.RIGHT
    }
  ],
  inactiveTile: [
    {
      id: 0,
      row: 1,
      col: 3,
      dir: DIR.NONE
    }
  ],
  trapTile: [
    {
      id: 0,
      row: 0,
      col: 3,
      dir: DIR.NONE
    },
    {
      id: 1,
      row: 2,
      col: 1,
      dir: DIR.NONE
    }
  ],
  endTile: {
    row: 0,
    col: 4
  }
}
