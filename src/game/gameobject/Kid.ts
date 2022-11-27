import Phaser from 'phaser'
export class Kid {
  scene!: Phaser.Scene
  sprite: Phaser.GameObjects.Sprite
  constructor (x:number, y:number, scene: Phaser.Scene) {
    this.scene = scene
    this.sprite = this.scene.add.sprite(x, y, 'kidSheet')
    this.sprite.setScale(2)
    const happy = {
      key: 'kid-happy',
      frames: this.scene.anims.generateFrameNumbers('kidSheet', { start: 0, end: 4 }),
      frameRate: 8,
      repeat: -1
    }
    this.scene.anims.create(happy)
    this.sprite.play('kid-happy')
  }

  happy () {
    this.sprite.play('kid-happy')
  }
}
