import Phaser from 'phaser'

import { stage1 } from './stage1'
import { stage2 } from './stage2'
import { stage3 } from './stage3'
export interface TilePosition {
    row: number
    col: number
}
export interface StartTilePosition extends TilePosition {
    id: number
    dir: Phaser.Math.Vector2
}
export interface StageData {
    stageNum:number
    title:string
    row: number
    column: number,
    maxInput: number,
    startTile: StartTilePosition[],
    endTile: TilePosition,
    inactiveTile: StartTilePosition[]
    trapTile: StartTilePosition[]
    nextStage?:StageData | null
}

stage1.nextStage = stage2
stage2.nextStage = stage3
const st1 = stage1
const st2 = stage2
export default { stage1: st1, stage2: st2, stage3 }
