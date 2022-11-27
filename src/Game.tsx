import { useEffect } from 'react'
import { gameConfig } from './game/main'
import Phaser from 'phaser'
export const Game = () => {
  useEffect(() => {
    const g = new Phaser.Game(gameConfig)
    return () => {
      g.destroy(true)
    }
  }, [])

  return (
    <div id="game"></div>)
}
