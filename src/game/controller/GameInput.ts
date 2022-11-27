import Phaser from 'phaser'
import { getTextStyle, makeRowColKey } from '../../utils/game'
import { COLOR, DIR } from '../constant'
import EndTile from '../gameobject/Endtile'
import InputTile from '../gameobject/InputTile'
import Pin from '../gameobject/Pin'
import StartTile from '../gameobject/StartTile'
import Tile from '../gameobject/Tile'
import { GAME_SCENES } from '../scene/constant'
import { StageData } from '../stage'

export interface GameInputState {
    rowID:number
    colID:number
  }

export class GameInput {
  actionText!: Phaser.GameObjects.Text
  scene: Phaser.Scene
  stateSeq:GameInputState[] = []
  tileLookUp = new Map<string, Tile>()
  pinLookUp = new Map<number, Pin>()
  isPlay = false
  numRow = 0
  numCol = 0
  isPass = false
  numAction = 0
  totalAction = 0
  canInput = true
  winTitle!: Phaser.GameObjects.Container
  stageData: StageData
  constructor (numRow:number, numCol:number, stageData: StageData, scene: Phaser.Scene) {
    this.numRow = numRow
    this.numCol = numCol
    this.stageData = stageData
    const actionTextSize = 16
    const actionTextStyle = {
      stroke: '#272736',
      strokeThickness: 4,
      fixedHeight: actionTextSize + 8,
      font: `${actionTextSize}px 'Roboto Mono','Itim'`,
      fill: '#fff'
    }

    this.scene = scene
    this.actionText = this.scene.add.text(this.scene.cameras.main.width - 64, 32, 'total: 0', actionTextStyle)
    this.actionText.setOrigin(0.5)
    this.initNextStageUI()
  }

  clear () {
    for (const [, t] of this.tileLookUp) {
      this.processRemoveTile(t.rowID, t.colID)
    }
    this.processReset()
    this.reset()
  }

  initNextStageUI () {
    const container = this.scene.add.container()
    let textStyle = getTextStyle(32)
    const isLastStage = !this.stageData.nextStage
    if (+(localStorage.getItem('stagePass') || 0) <= this.stageData.stageNum) {
      localStorage.setItem('stagePass', `${this.stageData.stageNum}`)
    }

    const bgTitle = this.scene.add.rectangle(this.scene.cameras.main.width / 2, this.scene.cameras.main.height / 2, 300, 300, COLOR.PURPLE_3)
    let txtWin = 'You win'
    if (isLastStage) {
      txtWin = 'Thank you for playing 😃'
      textStyle = getTextStyle()
      bgTitle.setDisplaySize(300, 200)
    }
    const text = this.scene.add.text(bgTitle.x, bgTitle.y - 48, txtWin, textStyle)
    text.setOrigin(0.5)

    const btnNext = this.scene.add.image(text.x, text.y + 100, 'button1')
    btnNext.setScale(4)
    btnNext.setInteractive()
    btnNext.on('pointerdown', () => {
      const next = GAME_SCENES.GAME_SCENE
      if (this.stageData.nextStage) {
        this.scene.scene.start(next, this.stageData.nextStage)
      }
    })

    const textNext = this.scene.add.text(btnNext.x, btnNext.y, 'Next stage', getTextStyle())
    textNext.setOrigin(0.5)
    const graphics = this.scene.add.graphics()
    graphics.lineStyle(4, COLOR.BLACK, 1)
    graphics.strokeRect(bgTitle.getTopLeft().x, bgTitle.getTopLeft().y, bgTitle.displayWidth, bgTitle.displayHeight)
    graphics.setDepth(10)
    container
      .add(bgTitle)
      .add(graphics)
      .add(text)

    if (this.stageData.nextStage) {
      container.add(btnNext)
        .add(textNext)
    }
    container.setDepth(11)
    container.setVisible(false)
    this.winTitle = container

    if (isLastStage) {
      const btnNext = this.scene.add.image(text.x, text.y + 100, 'button1')
      btnNext.setScale(4)
      btnNext.setInteractive()
      btnNext.on('pointerdown', () => {
        const next = GAME_SCENES.MENU_SCENE
        this.scene.scene.start(next)
      })
      const textNext = this.scene.add.text(btnNext.x, btnNext.y, 'Back to menu', getTextStyle(14))
      textNext.setOrigin(0.5)
      container.add(btnNext)
        .add(textNext)
    }
  }

  decreaseAction () {
    if (this.numAction <= 0) {
      return
    }
    this.numAction--
    this.updateActionText()
  }

  increaseAction () {
    if (this.numAction >= this.totalAction) {
      return
    }
    this.numAction++
    this.updateActionText()
  }

  setTotalAction (total: number) {
    this.numAction = total
    this.totalAction = total
    this.updateActionText()
  }

  updateActionText () {
    this.actionText.setText(`total: ${this.numAction}`)
  }

  makeLose () {
    this.isPlay = false
    for (const [, t] of this.tileLookUp.entries()) {
      if (t instanceof EndTile) {
        t.happy()
      }
    }
    this.scene.sound.play('laughter')
  }

  makeWin () {
    this.isPlay = false
    for (const [, t] of this.tileLookUp.entries()) {
      if (t instanceof EndTile) {
        t.angry()
      }
    }
  }

  isOutOfGrid (row:number, col:number) {
    const outOfRow = row > this.numRow - 1 || row < 0
    const outOfCol = col > this.numCol - 1 || col < 0
    return (outOfCol || outOfRow)
  }

  clearSeq () {
    this.stateSeq = []
  }

  reset () {
    if (this.isPlay) {
      this.isPlay = false
      this.processReset()
    } else {
      this.processReset()
    }
  }

  processReset () {
    this.isPass = false
    this.clearSeq()
    for (const [, t] of this.tileLookUp.entries()) {
      t.reset()
      if (t.dir !== DIR.NONE && t instanceof InputTile) {
        t.rect.fillColor = COLOR.GREEN
      }
    // t.resetColor()
    // const { text } = this.getDirText(t.initialDir)
    // t.setTitle(text)
    // t.resetDir()
    // t.update()
    }
    for (const [, pin] of this.pinLookUp.entries()) {
      pin.reset()
    }
    this.canInput = true
  }

  async play () {
    if (this.isPlay) {
      return
    }
    let counter = 0
    this.isPlay = true
    for (const [, t] of this.tileLookUp.entries()) {
      t.play()
    }
    const ps = []
    const controller = new AbortController()
    while (counter < this.pinLookUp.size && this.isPlay) {
      for (const [, pin] of this.pinLookUp.entries()) {
        const key = makeRowColKey(pin.rowID, pin.colID)
        const t = this.tileLookUp.get(key)
        if (t) {
          pin.executeVisitedTile(t) // get direction from tile
          const row = pin.rowID + pin.dir.y
          const col = pin.colID + pin.dir.x
          if (this.isOutOfGrid(row, col)) {
            this.isPlay = false
            this.makeLose()
            break
          }
          const nextTileKey = makeRowColKey(row, col)

          const nextTile = this.tileLookUp.get(nextTileKey)
          if (nextTile) {
            const pm = pin.moveToTile(nextTile, controller)
            ps.push(pm)
          }
        }
      }
      counter = Array.from(this.pinLookUp.values()).filter((i) => i.isDone).length
      await Promise.all(ps)
      ps.pop()
      if (counter >= this.pinLookUp.size) {
        this.isPass = true
        this.winTitle.setVisible(true)
      }
    }
    controller.abort()
    this.isPlay = false
    this.canInput = false
    // if (!this.isPass) this.processReset()
  }

  removeTile (rowID:number, colID:number) {
    if (this.isPlay) {
      return
    }
    if (!this.canInput) {
      return
    }
    this.processRemoveTile(rowID, colID)
  }

  processRemoveTile (rowID:number, colID:number) {
    const tile = this.tileLookUp.get(makeRowColKey(rowID, colID))
    if (!(tile instanceof InputTile)) {
      return
    }
    if (tile.dir !== DIR.NONE) {
      this.increaseAction()
    }
    tile?.setDir(tile.initialDir)
    tile.reset()
    tile?.update()
  }

  addNewState (inputState: GameInputState) {
    if (this.isPlay) {
      return
    }
    if (!this.canInput) {
      return
    }
    const prev = this.getPrev()
    const newState = inputState
    if (prev?.colID === newState.colID && prev?.rowID === newState.rowID) {
      return
    }
    if (prev !== newState && prev) {
      const key = makeRowColKey(inputState.rowID, inputState.colID)
      const tile = this.tileLookUp.get(key)
      if (tile && tile.isActive) {
        const diffX = newState.colID - prev.colID
        const diffY = newState.rowID - prev.rowID
        const noDirChange = ((Math.abs(diffX) === Math.abs(tile.dir.x) && tile.dir.x !== diffX) ||
        (Math.abs(diffY) === Math.abs(tile.dir.y) && tile.dir.y !== diffY)) && tile.dir.x !== 0 && tile.dir.y !== 0
        if (noDirChange) {
          return
        }

        const dirVec = new Phaser.Math.Vector2(diffX, diffY)
        const { text, isError } = this.getDirText(dirVec)
        if (isError) {
          return
        }
        const currentDirText = text
        const prevTile = this.tileLookUp.get(makeRowColKey(prev.rowID, prev.colID))
        if (!(tile instanceof EndTile) && !(tile instanceof StartTile) && this.numAction > 0) {
          // check dir from diff state
          if (tile.dir === DIR.NONE) {
            this.decreaseAction()
          }
          tile.setDir(dirVec)
          tile.setTitle(currentDirText)
          tile?.update()
          if (prevTile && (prevTile instanceof InputTile)) {
            const { text } = this.getDirText(prevTile.dir)
            this.setPrevTile(text, prevTile, currentDirText)
          }
        } else {
          if (prevTile) {
            const { text } = this.getDirText(prevTile.dir)
            this.setPrevTile(text, prevTile, currentDirText)
          }
        }
      }
    } else {
      if (this.numAction <= 0) {
        return
      }
      const key = makeRowColKey(inputState.rowID, inputState.colID)
      const tile = this.tileLookUp.get(key)
      if (tile && tile.isActive) {
        if (!(tile instanceof EndTile) && !(tile instanceof StartTile)) {
          tile.rect.fillColor = COLOR.GREEN
          // default is right
          const dirVec = DIR.RIGHT
          const { text } = this.getDirText(dirVec)
          if (tile.dir === DIR.NONE) {
            this.decreaseAction()
          }
          tile.setDir(dirVec)
          tile.setTitle(text)
          tile?.update()
        }
      }
    }
    this.stateSeq.push(inputState)
  }

  setPrevTile (prevText:string, prevTile:Tile, currentDirText:string) {
    if ((prevText === 'right' || prevText === 'left') && currentDirText === 'down') {
      prevTile.setDir(DIR.DOWN)
      prevTile.setTitle('down')
    }
    if ((prevText === 'right' || prevText === 'left') && currentDirText === 'up') {
      prevTile.setDir(DIR.UP)
      prevTile.setTitle('up')
    }
    if ((prevText === 'down' || prevText === 'up') && currentDirText === 'right') {
      prevTile.setDir(DIR.RIGHT)
      prevTile.setTitle('right')
    }
    if ((prevText === 'down' || prevText === 'up') && currentDirText === 'left') {
      prevTile.setDir(DIR.LEFT)
      prevTile.setTitle('left')
    }
    prevTile.update()
  }

  getDirText (dirVec:Phaser.Math.Vector2) {
    let t = ''
    let isError = true
    if (dirVec.x === 0 && dirVec.y === -1) {
      t = 'up'
      isError = false
    }
    if (dirVec.x === 0 && dirVec.y === 1) {
      t = 'down'
      isError = false
    }
    if (dirVec.x === -1 && dirVec.y === 0) {
      t = 'left'
      isError = false
    }
    if (dirVec.x === 1 && dirVec.y === 0) {
      t = 'right'
      isError = false
    }
    return {
      text: t,
      isError
    }
  }

  addTile (key:string, tile:Tile) {
    this.tileLookUp.set(key, tile)
  }

  addPin (pin:Pin) {
    this.pinLookUp.set(pin.pinID, pin)
  }

  private getPrev () {
    if (this.stateSeq.length === 0) {
      return null
    }
    return this.stateSeq[this.stateSeq.length - 1]
  }
}
