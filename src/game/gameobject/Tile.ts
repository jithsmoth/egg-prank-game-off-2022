import Phaser from 'phaser'
import { COLOR, DIR, SIZE } from '../constant'
import { GameInput } from '../controller/GameInput'

const debug = false

export default class Tile {
  scene!: Phaser.Scene
  isActive!: boolean
  rowID = 0
  colID = 0
  dir!:Phaser.Math.Vector2
  rect!: Phaser.GameObjects.Rectangle
  gameInput!: GameInput
  color = COLOR.GRAY
  title!:Phaser.GameObjects.Text
  initialDir = DIR.NONE
  sprite!: Phaser.GameObjects.Sprite
  tilePosX = 0
  tilePosY = 0
  isTrap = false
  constructor (row:number, col:number, scene: Phaser.Scene, offsetX = 0, offsetY = 0, isActive = true) {
    this.scene = scene
    this.tilePosX = (SIZE * (col + 1)) + offsetX
    this.tilePosY = (SIZE * (row + 1)) + offsetY
    this.isActive = isActive
    this.rect = this.scene.add.rectangle(0, 0, SIZE, SIZE, COLOR.GRAY)
    this.rect.setPosition(this.tilePosX, this.tilePosY)

    if (this.isActive) {
      const config = {
        key: 'idle',
        frames: this.scene.anims.generateFrameNumbers('tilesheet', { start: 0, end: 2 }),
        frameRate: 10,
        repeat: -1
      }
      this.sprite = this.scene.add.sprite(0, 0, 'tilesheet')
      this.sprite.setPosition(this.tilePosX, this.tilePosY)
      this.scene.anims.create(config)
      this.sprite.play('idle')
      this.sprite.setVisible(false)
      this.rect.setInteractive()

      this.rect.on('pointerdown', (pointer:Phaser.Input.Pointer) => {
        if (pointer.leftButtonDown()) {
          this.onPointerLeftDown(pointer)
          const inputState = {
            rowID: this.rowID,
            colID: this.colID
          }
          this.gameInput.addNewState(inputState)
          this.scene.input.setDefaultCursor('url(assets/ui/custom-cursor-plus.png), pointer')
        } else if (pointer.rightButtonDown()) {
          this.scene.input.setDefaultCursor('url(assets/ui/custom-cursor-minus.png), pointer')
          this.gameInput.removeTile(this.rowID, this.colID)
        }
      })
      this.rect.on('pointerover', (pointer:Phaser.Input.Pointer) => {
        if (pointer.leftButtonDown()) {
          this.onPointerLeftDownOver(pointer)
          const inputState = {
            rowID: this.rowID,
            colID: this.colID
          }
          this.gameInput.addNewState(inputState)
        } else if (pointer.rightButtonDown()) {
          this.gameInput.removeTile(this.rowID, this.colID)
        }
      })
    } else {
      this.scene.add.image(this.tilePosX, this.tilePosY, 'hole')
    }

    this.title = this.scene.add.text(this.tilePosX - 10, this.tilePosY + 10, '')
    this.title.setVisible(debug)
    this.title.setColor(`${COLOR.BLACK}`)
    this.dir = DIR.NONE
    const graphics = this.scene.add.graphics()
    graphics.lineStyle(2, COLOR.BLACK, 0.5)
    graphics.strokeRect(this.tilePosX - SIZE / 2, this.tilePosY - SIZE / 2, SIZE, SIZE)
    this.rowID = row
    this.colID = col
    this.scene.input.mouse.disableContextMenu()
  }

  play () {}

  reset () {
    if (this.sprite) {
      if (this.dir !== DIR.NONE) {
        this.sprite.setVisible(true)
      } else {
        this.sprite.setVisible(false)
      }
    }
  }

  resetDir () {
    this.dir = this.initialDir
  }

  setDir (dir:Phaser.Math.Vector2) {
    this.dir = dir
  }

  resetColor () {
    this.rect.fillColor = this.color
  }

  resetText () {
    this.title.text = ''
  }

  setTitle (text:string) {
    this.title.text = text
  }

  private getClassName () {
    return this.constructor.name
  }

  bindInputSeq (gameInput:GameInput) {
    this.gameInput = gameInput
  }

  onPointerLeftDown (pointer:Phaser.Input.Pointer) {
  }

  onPointerLeftDownOver (pointer:Phaser.Input.Pointer) {
  }

  update () {
    if (!this.isActive) { return }
    if (this.dir.x === 0 && this.dir.y === 0) {
      this.resetColor()
      this.title.text = ''
      this.sprite.setVisible(false)
    } else {
      this.rect.fillColor = COLOR.GREEN
      this.sprite.setVisible(true)
      if (this.dir.y !== 0) {
        this.sprite.rotation = Phaser.Math.DegToRad(90)
        if (this.dir.y > 0) {
          this.sprite.rotation = Phaser.Math.DegToRad(90)
        }
        if (this.dir.y < 0) {
          this.sprite.rotation = Phaser.Math.DegToRad(-90)
        }
      } else {
        this.sprite.rotation = Phaser.Math.DegToRad(0)
      }
      if (Math.abs(this.dir.x) > 0) {
        this.sprite.scaleX = this.dir.x
      }
    }
  }
}
