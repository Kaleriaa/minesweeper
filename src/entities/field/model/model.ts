import { gameModel } from '@entities/game'
import { AroundMinesCount, Cell, CellCoords, CellType } from '@entities/cell/types'
import { createStore, createEvent, createEffect, sample } from 'effector'
import { useStore } from 'effector-react'
import { FIELD_SIZE, MINES_COUNT } from '../constants'
import { GameState } from '@entities/game/types'
import { timerModel } from '@features/timer'

const defaultValue = [...Array(FIELD_SIZE).keys()].map(() =>
    [...Array(FIELD_SIZE).keys()].map(
        (): Cell => ({ hidden: true, type: CellType.Base, isFlagged: false, aroundMinesCount: 0, isQuestion: false }),
    ),
)

const rightCellClick = createEvent<CellCoords>()
const cellClick = createEvent<CellCoords>()
const cellClickFx = createEffect(({ x, y, field }: CellCoords & { field: Cell[][] }) => {
    if (field[x][y].type === CellType.Mine) {
        throw new Error('its mine')
    }

    const cells: Cell[][] = JSON.parse(JSON.stringify(field))

    const calc = (x: number, y: number) => {
        let mineCount = 0
        for (let i = Math.max(x - 1, 0); i <= Math.min(x + 1, FIELD_SIZE - 1); i++) {
            for (let j = Math.max(y - 1, 0); j <= Math.min(y + 1, FIELD_SIZE - 1); j++) {
                if (cells[i][j].type === CellType.Mine) mineCount++
            }
        }
        cells[x][y] = {
            hidden: false,
            aroundMinesCount: mineCount as AroundMinesCount,
            type: CellType.Empty,
            isFlagged: false,
            isQuestion: false,
        }

        if (mineCount == 0) {
            //Reveal all adjacent cells as they do not have a mine
            for (let i = Math.max(x - 1, 0); i <= Math.min(x + 1, FIELD_SIZE - 1); i++) {
                for (let j = Math.max(y - 1, 0); j <= Math.min(y + 1, FIELD_SIZE - 1); j++) {
                    //Recursive Call
                    if (cells[i][j].type === CellType.Base) calc(i, j)
                }
            }
        }
    }

    calc(x, y)

    return cells
})

const rightCellClickFx = createEffect(({ x, y, field }: CellCoords & { field: Cell[][] }) => {
    const cells: Cell[][] = JSON.parse(JSON.stringify(field))

    if (cells[x][y].isFlagged) {
        cells[x][y] = { ...cells[x][y], isFlagged: false, isQuestion: true }

        return cells
    }

    if (cells[x][y].isQuestion) {
        cells[x][y] = { ...cells[x][y], isFlagged: false, isQuestion: false }

        return cells
    }

    cells[x][y] = { ...cells[x][y], isFlagged: true, isQuestion: false }

    return cells
})
sample({ clock: cellClickFx.fail, fn: () => 'lose' as GameState, target: gameModel.events.updateGame })

const checkWinFx = createEffect((cells: Cell[][]) => {
    let minesChecked = true
    let openedCells = 0
    let hasMines = false
    for (let i = 0; i < FIELD_SIZE; i++) {
        for (let j = 0; j < FIELD_SIZE; j++) {
            const cell = cells[i][j]
            if (cell.type === CellType.Base) {
                openedCells++
            }
            if (cell.type === CellType.Mine && !cell.isFlagged) {
                minesChecked = false
            }
            if (cell.type === CellType.Mine) {
                hasMines = true
            }
        }
    }

    return (minesChecked || openedCells === 0) && hasMines
})

sample({ clock: checkWinFx.doneData, filter: Boolean, target: gameModel.events.win })

const generateMinesFx = createEffect(({ x: lastX, y: lastY, field }: CellCoords & { field: Cell[][] }) => {
    const minedField: Cell[][] = JSON.parse(JSON.stringify(field))
    const mine: Cell = { hidden: true, type: CellType.Mine, isQuestion: false, isFlagged: false, aroundMinesCount: 0 }

    for (let index = 0; index < MINES_COUNT; index++) {
        let x = Math.floor(Math.random() * FIELD_SIZE)
        let y = Math.floor(Math.random() * FIELD_SIZE)

        while (lastX === x && lastY === y) {
            x = Math.floor(Math.random() * FIELD_SIZE)
            y = Math.floor(Math.random() * FIELD_SIZE)
        }

        minedField[x][y] = mine
    }
    return minedField
})

const showMinesFx = createEffect((field: Cell[][]) => {
    const cells: Cell[][] = JSON.parse(JSON.stringify(field))

    return cells.map((row) => row.map((cell) => (cell.type === CellType.Mine ? { ...cell, hidden: false } : cell)))
})
const $minesGenerated = createStore<boolean>(false)

sample({ clock: $minesGenerated, filter: Boolean, target: timerModel.events.startCounter })
sample({ clock: cellClick, fn: () => true, target: $minesGenerated })

const $field = createStore<Cell[][]>(defaultValue)

sample({ clock: gameModel.events.restart, target: [$minesGenerated.reinit!, $field.reinit!] })
sample({ clock: rightCellClick, source: $field, fn: (field, clock) => ({ field, ...clock }), target: rightCellClickFx })
sample({
    clock: $field,
    target: checkWinFx,
})

sample({
    clock: gameModel.stores.gameState,
    source: $field,
    filter: (_, state) => state !== 'inProgress',
    target: showMinesFx,
})
sample({ clock: showMinesFx.doneData, target: $field })

const $lastClickedCoords = createStore<CellCoords | null>(null)
sample({ clock: cellClick, target: $lastClickedCoords })

sample({
    clock: cellClick,
    source: { field: $field, minesGenerated: $minesGenerated },
    filter: ({ minesGenerated }) => minesGenerated,
    fn: ({ field }, coords) => ({ field, ...coords }),
    target: cellClickFx,
})

sample({
    clock: generateMinesFx.doneData,
    source: $lastClickedCoords,
    fn: (coords, field) => ({ ...coords!, field }),
    target: cellClickFx,
})

sample({ clock: cellClickFx.doneData, target: $field })
sample({ clock: rightCellClickFx.doneData, target: $field })

sample({
    source: { field: $field, lastClickedCoords: $lastClickedCoords },
    clock: $minesGenerated,
    filter: (_, clock) => clock,
    fn: ({ lastClickedCoords, field }) => ({ ...lastClickedCoords!, field }),
    target: generateMinesFx,
})

export const selectors = {
    useFieldCell: ({ x, y }: CellCoords) => {
        const cells = useStore($field)

        return cells[x][y]
    },
    useLastCoords: () => useStore($lastClickedCoords),
    useMinesCounter: () => {
        const cells = useStore($field)
        return MINES_COUNT - cells.flat().filter((cell) => cell.isFlagged).length
    },
}

export const events = {
    cellClick,
    rightCellClick,
}
