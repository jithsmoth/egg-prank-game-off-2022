import Phaser from 'phaser'
import { DIR } from '../constant'
import InputTile from './InputTile'
export default class InputTrapTile extends InputTile {
  initialDir = DIR.NONE
  spike!: Phaser.GameObjects.Image
  constructor (x:number, y:number, color:number, scene: Phaser.Scene, offsetX = 0, offsetY = 0, isActive = true) {
    super(x, y, color, scene, offsetX, offsetY, isActive)
    this.scene = scene
    this.color = color
    this.resetColor()
    this.isTrap = true
    this.spike = this.scene.add.image(this.tilePosX, this.tilePosY, 'spike')
    this.spike.setDepth(20)
    this.spike.setPosition(this.tilePosX, this.tilePosY + this.spike.displayHeight * 0.5)
    this.spike.setOrigin(0.5, 1)
    this.spike.setVisible(false)
  }

  spikeActive () {
    this.resetColor()
    this.spike.setVisible(true)
    this.scene.tweens.add({
      targets: [this.spike],
      y: {
        from: this.spike.y,
        to: this.spike.y - 10
      },
      scaleY: {
        from: 1,
        to: 1.5
      },
      yoyo: 1,
      ease: 'Bounce', // 'Cubic', 'Elastic', 'Bounce', 'Back'
      duration: 100
    })
  }

  reset (): void {
    this.spike.setVisible(false)
    if (this.dir !== DIR.NONE) {
      this.sprite.setVisible(true)
    }
  }
}
