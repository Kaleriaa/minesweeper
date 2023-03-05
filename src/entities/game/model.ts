import { createEvent, createStore, sample } from 'effector'
import { useStore } from 'effector-react'
import { GameState } from './types'

const restart = createEvent()
const win = createEvent()
const updateGame = createEvent<GameState>()
const $gameState = createStore<GameState>('inProgress')

sample({ clock: updateGame, target: $gameState })
sample({ clock: restart, target: $gameState.reinit! })
sample({ clock: win, fn: () => 'win' as GameState, target: $gameState })
export const selectors = {
    useGameState: () => useStore($gameState),
    useIsGameEnd: () => {
        const state = useStore($gameState)

        if (state === 'inProgress') return false
        return true
    },
}

export const events = {
    updateGame,
    restart,
    win,
}

export const stores = {
    gameState: $gameState,
}
