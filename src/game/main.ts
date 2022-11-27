
import Phaser from 'phaser'
import 'phaser/plugins/spine/dist/SpinePlugin'
import PreloaderScene from './scene/PreloaderScene'
import GameScene from './scene/GameScene'
import MenuScene from './scene/MenuScene'
import SelectStageScene from './scene/SelectStageScene'
import CreditScene from './scene/CreditScene'
import StoryScene from './scene/StoryScene'

export const gameConfig = {
  type: Phaser.WEBGL,
  scale: {
    mode: Phaser.Scale.NONE
  },
  width: 640,
  height: 640,
  dom: {
    createContainer: true
  },
  parent: 'game',
  physics: {
    default: 'arcade',
    arcade: {}
  },
  backgroundColor: '#5e315b',
  pixelArt: true,
  audio: {
    disableWebAudio: true
  },
  scene: [PreloaderScene, GameScene, MenuScene, SelectStageScene, CreditScene, StoryScene]
}
