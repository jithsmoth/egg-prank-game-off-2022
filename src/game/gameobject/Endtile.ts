import Phaser from 'phaser'
import { COLOR } from '../constant'
import Tile from './Tile'
import { Uncle } from './Uncle'
export default class EndTile extends Tile {
  uncle: Uncle
  constructor (x:number, y:number, scene: Phaser.Scene, offsetX = 0, offsetY = 0) {
    super(x, y, scene, offsetX, offsetY)
    this.scene = scene
    this.color = COLOR.RED
    this.resetColor()
    const uncleOffsetY = -6
    this.uncle = new Uncle(this.tilePosX, this.tilePosY + uncleOffsetY, this.scene)
  }

  angry () {
    this.uncle.angry()
  }

  happy () {
    this.uncle.happy()
  }

  reset () {
    this.uncle.reset()
  }
}
