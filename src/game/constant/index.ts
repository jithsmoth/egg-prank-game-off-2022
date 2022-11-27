import Phaser from 'phaser'
export { default as COLOR } from './color'

export const DIR = {
  UP: new Phaser.Math.Vector2(0, -1),
  DOWN: new Phaser.Math.Vector2(0, 1),
  LEFT: new Phaser.Math.Vector2(-1, 0),
  RIGHT: new Phaser.Math.Vector2(1, 0),
  NONE: new Phaser.Math.Vector2(0, 0)
}

export const SIZE = 68

export enum GAME_STATE{
  START,
  PLAYING,
  END,
}
