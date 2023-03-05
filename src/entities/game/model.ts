import { useStore } from 'effector-react'
import { createStore, createEvent, sample } from 'effector'
import { GameState } from './types'

const updateGame = createEvent<GameState>()
const $gameState = createStore<GameState>('inProgress')

sample({ clock: updateGame, target: $gameState })
export const selectors = { useGameState: () => useStore($gameState) }

export const events = {
    updateGame,
}
