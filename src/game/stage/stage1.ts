import { StageData } from '.'
import { DIR } from '../constant'

export const stage1: StageData = {
  stageNum: 1,
  title: 'Mission: 1',
  row: 2,
  column: 4,
  maxInput: 5,
  startTile: [
    {
      id: 0,
      row: 1,
      col: 0,
      dir: DIR.UP
    }
  ],
  trapTile: [],
  inactiveTile: [
    {
      id: 0,
      row: 0,
      col: 2,
      dir: DIR.NONE
    }
  ],
  endTile: {
    row: 0,
    col: 3
  }
}
