import Phaser from 'phaser'
import { COLOR, DIR } from '../constant'
import Tile from './Tile'
export default class StartTile extends Tile {
  initialDir = DIR.NONE
  arrow!: Phaser.GameObjects.Image
  arrowTween!: Phaser.Tweens.Tween
  constructor (x:number, y:number, dir:Phaser.Math.Vector2, scene: Phaser.Scene, offsetX = 0, offsetY = 0) {
    super(x, y, scene, offsetX, offsetY)
    this.scene = scene
    this.color = COLOR.BLUE
    this.resetColor()
    this.dir = dir
    this.initialDir = dir
    this.sprite.setVisible(true)
    if (this.dir.y === 1) {
      this.sprite.setAngle(90)
    }
    if (this.dir.y === -1) {
      this.sprite.setAngle(270)
    }

    const arrow = this.scene.add.image(0, 0, 'arrow')
    this.arrow = arrow
    this.arrowResetPosition()
    arrow.setScale(4)
    arrow.setDepth(10)
    arrow.setRotation(this.sprite.rotation)
  }

  initTween () {
    const offsetArrow = 40
    const x = this.sprite.x + offsetArrow * this.dir.x
    const y = this.sprite.y + offsetArrow * this.dir.y
    this.arrowTween = this.scene.tweens.add({
      targets: [this.arrow],
      x: {
        from: x,
        to: x + 16 * this.dir.x
      },
      y: {
        from: y,
        to: y + 16 * this.dir.y
      },
      repeat: -1,
      yoyo: true,
      duration: 500
    })
  }

  arrowResetPosition () {
    const offsetArrow = 40
    this.arrow.setPosition(this.sprite.x + offsetArrow * this.dir.x, this.sprite.y + offsetArrow * this.dir.y)
  }

  play (): void {
    this.arrow.setVisible(false)
    this.arrowTween.stop()
  }

  reset (): void {
    this.arrow.setVisible(true)
    this.initTween()
  }
}
