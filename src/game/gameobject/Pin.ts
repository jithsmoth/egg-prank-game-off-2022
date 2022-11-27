import { Resolver } from 'matter'
import Phaser from 'phaser'
import { COLOR, DIR, SIZE } from '../constant'
import { GameInput } from '../controller/GameInput'
import EndTile from './Endtile'
import InputTile from './InputTile'
import InputTrapTile from './InputTrapTile'
import StartTile from './StartTile'
import Tile from './Tile'

const MOVE_DURATION = 300
export default class Pin {
  startTile!: StartTile
  dir = DIR.NONE
  rowID = 0
  colID = 0
  scene: Phaser.Scene
  circle: Phaser.GameObjects.Arc
  pinID: number
  isDone = false
  sprite!: Phaser.GameObjects.Sprite
  tween!: Phaser.Tweens.Tween
  gameInput: GameInput
  constructor (row:number, col:number, dir:Phaser.Math.Vector2, id:number, gameInput :GameInput, scene: Phaser.Scene) {
    const x = (SIZE * (row + 1))
    const y = (SIZE * (col + 1))
    this.scene = scene
    this.circle = this.scene.add.circle(x, y, SIZE / 2, COLOR.RED)
    this.circle.setVisible(false)
    this.circle.setDepth(9)
    this.pinID = id
    this.gameInput = gameInput
    const eggIdle = {
      key: 'egg-idle',
      frames: this.scene.anims.generateFrameNumbers('eggSheet', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    }
    const eggEmpty = {
      key: 'egg-empty',
      frames: this.scene.anims.generateFrameNumbers('eggSheet', { start: 0, end: 0 }),
      frameRate: 10,
      repeat: -1
    }
    const eggHappy = {
      key: 'egg-happy',
      frames: this.scene.anims.generateFrameNumbers('eggSheet', { start: 5, end: 5 })
    }
    const eggSad = {
      key: 'egg-sad',
      frames: this.scene.anims.generateFrameNumbers('eggSheet', { start: 4, end: 4 })
    }
    this.scene.anims.create(eggIdle)
    this.scene.anims.create(eggEmpty)
    this.scene.anims.create(eggHappy)
    this.scene.anims.create(eggSad)
    this.sprite = this.scene.add.sprite(x, y, 'eggSheet')
    this.sprite.setDepth(9)
    this.sprite.play('egg-idle')
  }

  setStartGrid (t: StartTile) {
    this.startTile = t
  }

  reset () {
    if (this.tween) this.tween.stop()
    this.isDone = false
    this.sprite.play('egg-idle')
    this.sprite.rotation = 0
    this.setPositionToTile(this.startTile)
  }

  visitTileGrid (t: Tile) {
    this.rowID = t.rowID
    this.colID = t.colID
  }

  setPositionToTile (tile:Tile, offsetY = 0) {
    this.circle.x = tile.rect.x
    this.circle.y = tile.rect.y + offsetY
    this.sprite.x = this.circle.x
    this.sprite.y = this.circle.y
    this.rowID = tile.rowID
    this.colID = tile.colID
  }

  async moveToTile (nextTile: Tile, controller:AbortController) {
    if (!this.gameInput.isPlay) {
      return new Promise(resolve => resolve(null))
    }
    return new Promise((resolve) => {
      controller.signal.addEventListener('abort', () => {
        resolve(null)
      })
      let angle = {}
      const duration = MOVE_DURATION
      let y = {}
      let offsetY = 0
      if (nextTile instanceof EndTile) {
        offsetY = -44
        angle = {}
        y = {
          from: this.circle.y,
          to: nextTile.rect.y + offsetY
        }
      }
      // } else {
      angle = {
        from: 0,
        to: 360
      }
      y = {
        from: this.circle.y,
        to: nextTile.rect.y
      }
      // }
      this.tween = this.scene.tweens.add({
        targets: [this.circle, this.sprite],
        angle,
        x: {
          from: this.circle.x,
          to: nextTile.rect.x
        },
        y,
        ease: 'Linear', // 'Cubic', 'Elastic', 'Bounce', 'Back'
        duration
      }).once('complete', () => {
        this.setPositionToTile(nextTile, offsetY)
        this.sprite.rotation = 0
        if (nextTile instanceof EndTile) {
          nextTile.angry()
        }
        resolve(null)
      })
    })
  }

  sad () {
    this.tween.stop()
    this.sprite.play('egg-sad')
    this.gameInput.makeLose()
    this.scene.sound.play('explosionSFX', {
      // loop: false
    })
  }

  executeVisitedTile (t: Tile) {
    if (t.isTrap && t instanceof InputTrapTile) {
      this.sad()
      t.sprite.setVisible(false)
      t.spikeActive()
    }
    this.dir = t.dir
    // }
    if (t instanceof EndTile) {
      this.isDone = true
      this.sprite.play('egg-happy')
      if (this.tween) {
        this.tween.stop()
        this.sprite.rotation = 0
      }
    }
    if (t instanceof InputTile) {
      if (t.dir === DIR.NONE) {
        // empty tile egg will be break
        this.sad()
      }
    }
    if (t instanceof EndTile) {
      this.sprite.play('egg-happy')
      this.scene.sound.play('explosionSFX')
      this.gameInput.makeWin()
    }
  }
}
