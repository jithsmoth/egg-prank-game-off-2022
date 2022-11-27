import Phaser from 'phaser'
import { getTextStyle, makeRowColKey } from '../../utils/game'
import { COLOR, GAME_STATE, SIZE } from '../constant'
import { GameInput } from '../controller/GameInput'
import EndTile from '../gameobject/Endtile'
import InputTile from '../gameobject/InputTile'
import InputTrapTile from '../gameobject/InputTrapTile'
import Pin from '../gameobject/Pin'
import StartTile from '../gameobject/StartTile'
import { StageData, StartTilePosition } from '../stage'
import { GAME_SCENES } from './constant'

export default class GameScene extends Phaser.Scene {
  circles: Phaser.GameObjects.Arc[] = []
  circlePos: {
    x:number,
    y:number
  }[] = []

  posRect: { [key: string]: any } = {}
  currentTileInputIndex = 0
  gameState = GAME_STATE.START
  counter = 0
  stopCounter = 0
  tileRect:Phaser.GameObjects.Rectangle[] = []
  gameInput!:GameInput
  stageData!: StageData
  bg!: Phaser.GameObjects.Rectangle
  winTitle!: Phaser.GameObjects.Container

  constructor () {
    super(GAME_SCENES.GAME_SCENE)
  }

  create (stageData:StageData) {
    this.stageData = stageData
    const numCol = this.stageData.column
    const numRow = this.stageData.row
    const bg = this.add.rectangle(0, 0, SIZE * (numCol + 1), SIZE * (numRow + 1), COLOR.PURPLE_4)
    bg.setPosition(bg.width / 2 + SIZE * 1.25, bg.height / 2 + SIZE)
    this.bg = bg
    this.gameInput = new GameInput(numRow, numCol, stageData, this)
    this.gameInput.setTotalAction(this.stageData.maxInput)
    this.initTile()
    this.input.on('pointerup', (pointer:Phaser.Input.Pointer) => {
      this.input.setDefaultCursor('url(assets/ui/custom-cursor.png), pointer')
      this.gameInput.clearSeq()
    })

    this.setUpUI()
    this.gameInput.reset()
    // const r = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 200, 100, COLOR.BLUE)
  }

  setUpUI () {
    const textStyle = getTextStyle()

    const stageTextSize = 24
    const stageTextSyle = {
      stroke: '#272736',
      strokeThickness: 4,
      fixedHeight: stageTextSize + 8,
      font: `${stageTextSize}px 'Roboto Mono','Itim'`,
      fill: '#fff'
    }
    const stageText = this.add.text(this.cameras.main.width / 2, 32, this.stageData.title, stageTextSyle)
    stageText.setOrigin(0.5)

    const resetButton = this.add.image(0, 0, 'resetButton')
    resetButton.setPosition(200 - resetButton.width / 2, 512 + 70)
    resetButton.setScale(4)
    this.add.text(resetButton.x, resetButton.y, 'Again', textStyle).setOrigin(0.5)
    resetButton.setInteractive()
    resetButton.on('pointerdown', () => {
      this.gameInput.reset()
      resetButton.setTexture('resetButtonDown')
    })
    resetButton.on('pointerup', () => {
      resetButton.setTexture('resetButton')
    })
    resetButton.on('pointerout', () => {
      resetButton.setTexture('resetButton')
    })

    const playButton = this.add.image(0, 0, 'playButton')
    playButton.setScale(4)
    playButton.setInteractive()
    playButton.setPosition(720 - 200 - resetButton.width / 2 - SIZE * 0.5, 512 + 70)

    this.add.text(playButton.x, playButton.y, 'Let\'s GO', textStyle).setOrigin(0.5)
    playButton.on('pointerdown', () => {
      this.gameInput.play()
      playButton.setTexture('playButtonDown')
    })
    playButton.on('pointerout', () => {
      playButton.setTexture('playButton')
    })
    playButton.on('pointerup', () => {
      playButton.setTexture('playButton')
    })

    const clearbutton = this.add.image(0, 0, 'button2')
    clearbutton.setPosition(200 - resetButton.width / 2 - (resetButton.x - playButton.x) * 0.5, 512 + 70)
    clearbutton.setScale(4)
    this.add.text(clearbutton.x, clearbutton.y, 'Clear', textStyle).setOrigin(0.5)
    clearbutton.setInteractive()
    clearbutton.on('pointerdown', () => {
      this.gameInput.clear()
      clearbutton.setTexture('button2Down')
    })
    clearbutton.on('pointerup', () => {
      clearbutton.setTexture('button2')
    })
    clearbutton.on('pointerout', () => {
      clearbutton.setTexture('button2')
    })

    const menuButton = this.add.image(0, 0, 'menuButton')
    menuButton.setScale(2)
    menuButton.setPosition(32, stageText.y)
    menuButton.setInteractive()
    menuButton.on('pointerdown', () => {
      const next = GAME_SCENES.MENU_SCENE
      this.scene.start(next)
      menuButton.setTexture('menuButtonDown')
    })
    menuButton.on('pointerout', () => {
      menuButton.setTexture('menuButton')
    })
    menuButton.on('pointerup', () => {
      menuButton.setTexture('menuButton')
    })
  }

  update (time: number, delta: number): void { }

  reset () {
    this.initTile()
    this.gameState = GAME_STATE.START
    this.stopCounter = 0
    this.counter = 0
  }

  initTile () {
    for (const t of this.tileRect) {
      t.destroy()
    }
    for (const t of this.circles) {
      t.destroy()
    }
    this.circles = []
    this.tileRect = []
    const startGridLookUp = new Map<string, StartTilePosition>()
    for (const g of this.stageData.startTile) {
      startGridLookUp.set(makeRowColKey(g.row, g.col), g)
    }
    const endGridLookUp = new Map<string, boolean>()
    endGridLookUp.set(makeRowColKey(this.stageData.endTile.row, this.stageData.endTile.col), true)
    // HOLE
    const inactiveGridLookUp = new Map<string, boolean>()
    for (const g of this.stageData.inactiveTile) {
      inactiveGridLookUp.set(makeRowColKey(g.row, g.col), true)
    }
    // TRAP
    const trapGridLookup = new Map<string, boolean>()
    for (const g of this.stageData.trapTile) {
      trapGridLookup.set(makeRowColKey(g.row, g.col), true)
    }
    const numCol = this.stageData.column
    const numRow = this.stageData.row
    const OFFSET_X = 116 - (68 * 0.5) + ((6 - numCol) * SIZE * 0.5)
    this.bg.setPosition(this.bg.width / 2 + OFFSET_X, this.bg.height / 2 + SIZE)
    const OFFSET_Y = 64
    for (let row = 0; row < numRow; row++) {
      for (let col = 0; col < numCol; col++) {
        const key = makeRowColKey(row, col)
        let t
        if (startGridLookUp.has(key)) {
          const tileData = startGridLookUp.get(key)
          if (!tileData) {
            continue
          }
          t = new StartTile(row, col, tileData.dir, this, OFFSET_X, OFFSET_Y)
          const pinID = tileData.id as number
          const p = new Pin(row, col, t.dir, pinID, this.gameInput, this)
          p.visitTileGrid(t)
          p.setStartGrid(t)
          this.gameInput.addTile(key, t)
          this.gameInput.addPin(p)
        } else if (endGridLookUp.has(key)) {
          t = new EndTile(row, col, this, OFFSET_X, OFFSET_Y)
        } else {
          let color = COLOR.GRAY
          if (col % 2 === row % 2) {
            color = COLOR.LIGHT_GRAY
          }
          if (inactiveGridLookUp.has(key)) {
            t = new InputTile(row, col, color, this, OFFSET_X, OFFSET_Y, false)
          } else if (trapGridLookup.has(key)) {
            t = new InputTrapTile(row, col, color, this, OFFSET_X, OFFSET_Y)
          } else {
            t = new InputTile(row, col, color, this, OFFSET_X, OFFSET_Y)
          }
        }
        t.bindInputSeq(this.gameInput)
        this.gameInput.addTile(key, t)
      }
    }
  }
}
