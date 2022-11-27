import Phaser from 'phaser'
import { getTextStyle } from '../../utils/game'
import { Kid } from '../gameobject/Kid'
import { Uncle } from '../gameobject/Uncle'
import { GAME_SCENES } from './constant'

export default class StoryScene extends Phaser.Scene {
  constructor () {
    super(GAME_SCENES.STORY_SCENE)
  }

  create () {
    const title = this.add.text(this.cameras.main.width / 2, 32, 'Story', getTextStyle(42))
    title.setOrigin(0.5)
    this.add.text(32, 64, 'Character', getTextStyle(32))
    const k = new Kid(64, 138, this)
    k.sprite.setScale(1)
    this.add.text(k.sprite.x + 32, k.sprite.y, 'The Kid - you will role play as him \n with mission to prank the uncle with egg.', getTextStyle(16))

    const u = new Uncle(64, 138 + 64 + 20, this)
    u.sprite.setScale(1)
    this.add.text(u.sprite.x + 32, u.sprite.y, 'The Uncle - He is a target of kid\'s mission.', getTextStyle(16))

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

    const titleHowto = this.add.text(32, 280, 'How to play', getTextStyle(32))
    const how1 = this.add.text(titleHowto.x, titleHowto.y + 64, '1. Left click and drag mouse\n for adding the tile with direction', getTextStyle(16))

    const how2 = this.add.text(how1.x, how1.y + 64, '2. Right click and drag mouse\n for removing the tile', getTextStyle(16))

    this.add.text(how2.x, how2.y + 64, '3. Create the tile for making the path to the uncle.', getTextStyle(16))

    const c1 = this.add.image(how1.x + how1.width + 20, how1.y, 'cursorPlus')
    this.add.image(c1.x, how2.y + 10, 'cursorMinus')
  }
}
