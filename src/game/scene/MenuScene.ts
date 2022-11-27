import Phaser from 'phaser'
import { Kid } from '../gameobject/Kid'
import { Uncle } from '../gameobject/Uncle'
import { GAME_SCENES } from './constant'

export default class MenuScene extends Phaser.Scene {
  constructor () {
    super(GAME_SCENES.MENU_SCENE)
  }

  create () {
    const textSize = 36
    const textSyle = {
      stroke: '#272736',
      strokeThickness: 4,
      fixedHeight: textSize + 8,
      font: `${textSize}px 'Roboto Mono','Itim'`,
      fill: '#fff'
    }
    const titleText = this.add.text(this.cameras.main.width / 2, 100, 'EGG PRANK', textSyle)
    titleText.setOrigin(0.5)
    const egg = this.add.sprite(120, 100, 'eggSheet')
    egg.setScale(2)
    egg.setAngle(-20)
    this.tweens.add({
      targets: [egg],
      scaleX: {
        from: 2,
        to: 2.5
      },
      scaleY: {
        from: 2,
        to: 2.5
      },
      ease: 'Bounce',
      duration: 500,
      yoyo: 1,
      repeat: -1
    })
    const playButton = this.createButton(this.cameras.main.width / 2, 300, 'button1')
    const textSizeButton = 16
    const buttonTextSyle = {
      stroke: '#272736',
      strokeThickness: 4,
      fixedHeight: textSizeButton + 8,
      font: `${textSizeButton}px 'Roboto Mono','Itim'`,
      fill: '#fff'
    }

    // PLAY
    this.add.text(playButton.x, playButton.y, 'PLAY', buttonTextSyle).setOrigin(0.5)
    playButton.on('pointerdown', () => {
      playButton.setTexture('button1Down')
      const next = GAME_SCENES.SELECT_STAGE_SCENE
      this.scene.start(next)
    })
    playButton.on('pointerout', () => {
      playButton.setTexture('button1')
    })
    playButton.on('pointerup', () => {
      playButton.setTexture('button1')
    })

    // STORY
    const storyButton = this.createButton(this.cameras.main.width / 2, 400, 'button2')
    this.add.text(storyButton.x, storyButton.y, 'STORY', buttonTextSyle).setOrigin(0.5)
    storyButton.on('pointerdown', () => {
      storyButton.setTexture('button2Down')
      const next = GAME_SCENES.STORY_SCENE
      this.scene.start(next)
    })
    storyButton.on('pointerout', () => {
      storyButton.setTexture('button2')
    })
    storyButton.on('pointerup', () => {
      storyButton.setTexture('button2')
    })

    // CREDIT
    const creditButton = this.createButton(this.cameras.main.width / 2, 500, 'button3')
    this.add.text(creditButton.x, creditButton.y, 'CREDIT', buttonTextSyle).setOrigin(0.5)
    creditButton.on('pointerdown', () => {
      creditButton.setTexture('button3Down')
      const next = GAME_SCENES.CREDIT_SCENE
      this.scene.start(next)
    })
    creditButton.on('pointerout', () => {
      creditButton.setTexture('button3')
    })
    creditButton.on('pointerup', () => {
      creditButton.setTexture('button3')
    })

    const uncle = new Uncle(0, 0, this)
    uncle.sprite.setScale(4)
    uncle.sprite.setPosition(this.cameras.main.width - 128, this.cameras.main.height - uncle.sprite.displayHeight * 0.5)
    uncle.angry()

    const kid = new Kid(0, 0, this)
    kid.sprite.setScale(4)
    kid.sprite.setPosition(128, this.cameras.main.height - kid.sprite.displayHeight * 0.5)
    kid.happy()
  }

  createButton (x:number, y:number, texture = 'button1') {
    const img = this.add.image(0, 0, texture)
    img.setScale(4)
    img.setInteractive()
    img.setPosition(x, y)
    return img
  }
}
