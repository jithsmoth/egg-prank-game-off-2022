import Phaser from 'phaser'
import { getTextStyle } from '../../utils/game'
import { COLOR, DIR } from '../constant'
import stage from '../stage'
import { GAME_SCENES } from './constant'

export default class SelectStageScene extends Phaser.Scene {
  constructor () {
    super(GAME_SCENES.SELECT_STAGE_SCENE)
  }

  create () {
    // playButton.on('pointerdown', () => {
    //     playButton.setTexture('playButtonDown')
    //     const next = GAME_SCENES.GAME_SCENE
    //     this.scene.start(next)
    //   })
    //   playButton.on('pointerout', () => {
    //     playButton.setTexture('playButton')
    //   })
    //   playButton.on('pointerup', () => {
    //     playButton.setTexture('playButton')
    //   })
    const stagePass = +(localStorage.getItem('stagePass') || 0)
    const stage1Btn = this.createButtonCircle(80 + 32, 300, 'STAGE: 1')
    stage1Btn.on('pointerdown', () => {
      const next = GAME_SCENES.GAME_SCENE
      this.scene.start(next, stage.stage1)
    })

    const stage2Btn = this.createButtonCircle(this.cameras.main.width / 2, 300, 'STAGE: 2')
    stage2Btn.fillColor = COLOR.PURPLE_2
    stage2Btn.on('pointerdown', () => {
      const next = GAME_SCENES.GAME_SCENE
      this.scene.start(next, stage.stage2)
    })
    if (stagePass < 2) {
      const c = this.add.circle(stage2Btn.x, stage2Btn.y, stage1Btn.width / 2, COLOR.BLACK, 0.5)
      c.setDepth(100)
      const text = this.add.text(c.x, c.y - 20, 'LOCK', getTextStyle())
      text.setOrigin(0.5)
      text.setDepth(100)
      c.setInteractive()
      c.on('pointerover', () => {
        this.input.setDefaultCursor('url(assets/ui/custom-cursor-block.png), pointer')
      })
      c.on('pointerout', () => {
        this.input.setDefaultCursor('url(assets/ui/custom-cursor.png), pointer')
      })
    }

    const stage3Btn = this.createButtonCircle(this.cameras.main.width - 80 - 32, 300, 'STAGE: 3')
    stage3Btn.on('pointerdown', () => {
      const next = GAME_SCENES.GAME_SCENE
      this.scene.start(next, stage.stage3)
    })

    if (stagePass < 3) {
      const c = this.add.circle(stage3Btn.x, stage3Btn.y, stage3Btn.width / 2, COLOR.BLACK, 0.5)
      c.setDepth(100)
      const text = this.add.text(c.x, c.y - 20, 'LOCK', getTextStyle())
      text.setOrigin(0.5)
      text.setDepth(100)
      c.setInteractive()
      c.on('pointerover', () => {
        this.input.setDefaultCursor('url(assets/ui/custom-cursor-block.png), pointer')
      })
      c.on('pointerout', () => {
        this.input.setDefaultCursor('url(assets/ui/custom-cursor.png), pointer')
      })
    }

    const rect = this.add.rectangle(this.cameras.main.width / 2, 300, this.cameras.main.width - 100, 16, COLOR.BROWN_PURPLE)
    const graphics = this.add.graphics()
    graphics.lineStyle(4, COLOR.BLACK, 2)
    graphics.strokeRect(rect.getTopLeft().x, rect.getTopLeft().y, rect.width, rect.height)
  }

  createButtonCircle (x:number, y:number, text:string) {
    const circle = this.add.circle(x, y, 80, COLOR.PURPLE_3)
    circle.setDepth(2)
    const graphics = this.add.graphics()
    graphics.lineStyle(4, COLOR.BLACK, 2)
    graphics.strokeCircle(circle.x, circle.y, circle.radius)
    graphics.setDepth(2)

    circle.setInteractive()

    const textSizeButton = 16
    const buttonTextSyle = {
      stroke: '#272736',
      strokeThickness: 4,
      fixedHeight: textSizeButton + 8,
      font: `${textSizeButton}px 'Roboto Mono','Itim'`,
      fill: '#fff'
    }
    this.add.text(circle.x, circle.y, text, buttonTextSyle).setOrigin(0.5).setDepth(2)
    return circle
  }
}
