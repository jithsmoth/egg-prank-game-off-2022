import Phaser from 'phaser'
export class Uncle {
  scene!: Phaser.Scene
  sprite: Phaser.GameObjects.Sprite
  constructor (x:number, y:number, scene: Phaser.Scene) {
    this.scene = scene
    this.sprite = this.scene.add.sprite(x, y, 'uncleSheet')
    this.sprite.setScale(2)
    const idle = {
      key: 'uncle-idle',
      frames: this.scene.anims.generateFrameNumbers('uncleSheet', { start: 0, end: 4 }),
      frameRate: 10,
      repeat: -1
    }
    this.scene.anims.create(idle)
    const angry = {
      key: 'uncle-angry',
      frames: this.scene.anims.generateFrameNumbers('uncleSheet', { start: 5, end: 10 }),
      frameRate: 10,
      repeat: -1
    }
    this.scene.anims.create(angry)
    const happy = {
      key: 'uncle-happy',
      frames: this.scene.anims.generateFrameNumbers('uncleSheet', { start: 11, end: 16 }),
      frameRate: 10,
      repeat: -1
    }
    this.scene.anims.create(happy)
    this.sprite.play('uncle-idle')
  }

  angry () {
    this.sprite.play('uncle-angry')
  }

  happy () {
    this.sprite.play('uncle-happy')
  }

  reset () {
    this.sprite.play('uncle-idle')
  }
}
