import { StageData } from '.'
import { DIR } from '../constant'

export const stage3: StageData = {
  stageNum: 3,
  title: 'Mission: 3',
  row: 5,
  column: 5,
  maxInput: 7,
  startTile: [
    {
      id: 0,
      row: 3,
      col: 2,
      dir: DIR.DOWN
    }
  ],
  trapTile: [
    {
      id: 0,
      row: 1,
      col: 0,
      dir: DIR.NONE
    },
    {
      id: 1,
      row: 3,
      col: 1,
      dir: DIR.NONE
    },
    {
      id: 2,
      row: 3,
      col: 3,
      dir: DIR.NONE
    },
    {
      id: 3,
      row: 1,
      col: 4,
      dir: DIR.NONE
    }
  ],
  inactiveTile: [
    {
      id: 0,
      row: 0,
      col: 2,
      dir: DIR.NONE
    },
    {
      id: 1,
      row: 2,
      col: 2,
      dir: DIR.NONE
    }
  ],
  endTile: {
    row: 1,
    col: 2
  }
}
