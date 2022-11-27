import Phaser from 'phaser'
import greenBoxImg from '../../assets/green-box.png'
import tileSheet from '../../assets/tile-sheet.png'
import eggSheet from '../../assets/eggSheet.png'
import uncleSheet from '../../assets/uncleSheet.png'
import kidSheet from '../../assets/kidSheet.png'
import playButton from '../../assets/playbutton.png'
import playButtonDown from '../../assets/playbutton-1.png'
import resetButton from '../../assets/resetbutton.png'
import resetButtonDown from '../../assets/resetbutton-1.png'
import menuButton from '../../assets/menuButton.png'
import menuButtonDown from '../../assets/menuButton1.png'
import hole from '../../assets/hole.png'
import spike from '../../assets/spike.png'
import cursorPlus from '../../assets/custom-cursor-plus.png'
import cursorMinus from '../../assets/custom-cursor-minus.png'
import bgm from '../../assets/maze.mp3'

import button1 from '../../assets/button1.png'
import button1Down from '../../assets/button1-1.png'
import button2 from '../../assets/button2.png'
import button2Down from '../../assets/button2-1.png'
import button3 from '../../assets/button3.png'
import button3Down from '../../assets/button3-1.png'
import arrow from '../../assets/arrow.png'

import { GAME_SCENES } from './constant'
import tyrSheet from '../../assets/TyrSheet.png'
import lothurrSheet from '../../assets/LothurrSheet.png'
import explosionSFX from '../../assets/explosion.mp3'
import laughter from '../../assets/unfa-laughter-01.mp3'

export default class PreloaderScene extends Phaser.Scene {
  constructor () {
    super(GAME_SCENES.PRELOADER_SCENE)
  }

  preloadBar () {
    const width = this.cameras.main.width
    const height = this.cameras.main.height

    const textStyle = {
      stroke: '#272736',
      strokeThickness: 4,
      font: `bold ${18}px 'Roboto Mono','Itim'`,
      fill: '#fff'
    }
    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading...',
      style: textStyle
    })
    loadingText.setOrigin(0.5, 0.5)

    const percentText = this.make.text({
      x: width / 2,
      y: height / 2 - 5,
      text: '0%',
      style: textStyle
    })
    percentText.setOrigin(0.5, 0.5)

    const assetText = this.make.text({
      x: width / 2,
      y: height / 2 + 50,
      text: '',
      style: textStyle
    })
    assetText.setOrigin(0.5, 0.5)

    this.load.on('progress', function (value:number) {
      percentText.setText(parseInt(`${value * 100}`) + '%')
    })

    this.load.on('fileprogress', function (file:{key:string}) {
      assetText.setText('Loading asset: ' + file.key)
    })
    this.load.on('complete', function () {
      loadingText.destroy()
      percentText.destroy()
      assetText.destroy()
    })
  }

  preload () {
    this.preloadBar()
    this.load.image('green_box', greenBoxImg)
    this.load.image('playButton', playButton)
    this.load.image('playButtonDown', playButtonDown)
    this.load.image('resetButton', resetButton)
    this.load.image('resetButtonDown', resetButtonDown)
    this.load.image('menuButton', menuButton)
    this.load.image('menuButtonDown', menuButtonDown)
    this.load.image('button1', button1)
    this.load.image('button1Down', button1Down)
    this.load.image('button2', button2)
    this.load.image('button2Down', button2Down)
    this.load.image('button3', button3)
    this.load.image('button3Down', button3Down)
    this.load.image('arrow', arrow)
    this.load.image('hole', hole)
    this.load.image('spike', spike)
    this.load.image('cursorPlus', cursorPlus)
    this.load.image('cursorMinus', cursorMinus)

    this.load.audio('explosionSFX', explosionSFX)
    this.load.audio('laughter', laughter)
    this.load.audio('bgm', bgm)

    this.load.spritesheet('tilesheet', tileSheet, { frameWidth: 64, frameHeight: 64 })
    this.load.spritesheet('eggSheet', eggSheet, { frameWidth: 80, frameHeight: 80 })
    this.load.spritesheet('uncleSheet', uncleSheet, { frameWidth: 40, frameHeight: 40 })
    this.load.spritesheet('kidSheet', kidSheet, { frameWidth: 48, frameHeight: 40 })
    this.load.spritesheet('tyrSheet', tyrSheet, { frameWidth: 48, frameHeight: 48 })
    this.load.spritesheet('lothurrSheet', lothurrSheet, { frameWidth: 48, frameHeight: 48 })

    if (!localStorage.getItem('stagePass')) {
      localStorage.setItem('stagePass', '0')
    }
  }

  create () {
    const menuMusic = this.sound.add('bgm')
    menuMusic.play({
      volume: 0.3,
      loop: true
    })
    const next = GAME_SCENES.MENU_SCENE
    this.scene.start(next)
  }
}
