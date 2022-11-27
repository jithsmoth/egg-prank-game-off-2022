import Phaser from 'phaser'
import { getTextStyle } from '../../utils/game'
import { GAME_SCENES } from './constant'

export default class CreditScene extends Phaser.Scene {
  constructor () {
    super(GAME_SCENES.CREDIT_SCENE)
  }

  create () {
    const title = this.add.text(this.cameras.main.width / 2, 32, 'Credit', getTextStyle(42))
    title.setOrigin(0.5)
    const teamMemberText = this.add.text(32, 84, 'Team member', getTextStyle(32))
    const d1 = this.initDev1(teamMemberText.x, teamMemberText.y)
    this.initDev2(teamMemberText.x, d1.sprite.y)

    const menuButton = this.add.image(0, 0, 'menuButton')
    menuButton.setScale(2)
    menuButton.setPosition(32, 32)
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

    this.musicThank()
  }

  musicThank () {
    const title = this.add.text(32, 384, 'SFX & Muisc', getTextStyle(32))
    const div1 = document.createElement('div')
    div1.innerHTML = 'laughter - https://freesound.org/people/unfa/sounds/198251'
    div1.classList.add('div-text')
    const div2 = document.createElement('div')
    div2.innerHTML = 'BGM by <a href="https://pixabay.com/users/nojisuma-23737290/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=music&amp;utm_content=117144">nojisuma</a> from <a href="https://pixabay.com/music//?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=music&amp;utm_content=117144">Pixabay</a>'
    div2.classList.add('div-text')
    const dom1 = this.add.dom(0, 0, div1)
    dom1.setPosition(title.x + dom1.displayWidth * 0.5, title.y + title.displayHeight + 48)
    const dom = this.add.dom(0, 0, div2)
    dom.setPosition(title.x + dom.displayWidth * 0.5, title.y + title.displayHeight + 96)
  }

  initDev1 (refX = 0, refY = 0) {
    return this.initDev('tyrSheet', 64 + refX, 96 + refY, 'Tyr - Developer')
  }

  initDev (sheet:string, x:number, y:number, name = '') {
    const sprite = this.add.sprite(x, y, sheet)
    const idle = {
      key: `${sheet}-idle`,
      frames: this.anims.generateFrameNumbers(sheet, { start: 0, end: 4 }),
      frameRate: 10,
      repeat: -1
    }
    this.anims.create(idle)
    sprite.play(`${sheet}-idle`)
    sprite.setScale(2)
    const text = this.add.text(sprite.x + 48, sprite.y, name, getTextStyle())
    return {
      sprite,
      text
    }
  }

  initDev2 (refX = 0, refY = 0) {
    return this.initDev('lothurrSheet', 64 + refX, 96 + refY, 'Lothurr - Developer')
  }
}
