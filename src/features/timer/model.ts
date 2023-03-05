import { GameState } from '@entities/game/types'
import { useStore } from 'effector-react'
import { createStore, createEvent, sample } from 'effector'
import { interval } from 'patronum'
import { gameModel } from '@entities/game'

const startCounter = createEvent()
const stopCounter = createEvent()
const $counter = createStore(0)

const { tick } = interval({
    timeout: 1000,
    start: startCounter,
    stop: stopCounter,
})
sample({
    clock: $counter,
    filter: (clock) => clock >= 999,
    fn: () => 'lose' as GameState,
    target: gameModel.events.updateGame,
})
sample({ clock: gameModel.events.restart, target: [stopCounter, $counter.reinit!] })
sample({ clock: gameModel.stores.gameState, target: stopCounter })

$counter.on(tick, (number) => number + 1)

export const events = {
    startCounter,
    stopCounter,
}
export const selectors = { useTimer: () => useStore($counter) }

export const stores = {
    timer: $counter,
}
