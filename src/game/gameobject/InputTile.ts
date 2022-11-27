import Phaser from 'phaser'
import { DIR } from '../constant'
import Tile from './Tile'
export default class InputTile extends Tile {
  initialDir = DIR.NONE
  constructor (x:number, y:number, color:number, scene: Phaser.Scene, offsetX = 0, offsetY = 0, isActive = true) {
    super(x, y, scene, offsetX, offsetY, isActive)
    this.scene = scene
    this.color = color
    this.resetColor()
  }
}
