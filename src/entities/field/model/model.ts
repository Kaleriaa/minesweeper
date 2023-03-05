import { AroundMinesCount, Cell, CellCoords, CellType } from '@entities/cell/types'
import { createStore, createEvent, createEffect, sample } from 'effector'
import { useStore } from 'effector-react'
import { FIELD_SIZE, MINES_COUNT } from '../constants'

const defaultValue = [...Array(FIELD_SIZE).keys()].map(() =>
    [...Array(FIELD_SIZE).keys()].map(
        (): Cell => ({ hidden: true, type: CellType.Base, isFlagged: false, aroundMinesCount: 0 }),
    ),
)

const cellClick = createEvent<CellCoords>()
const cellClickFx = createEffect(({ x, y, field }: CellCoords & { field: Cell[][] }) => {
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
        }

        console.log(cells[x][y])

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

    const t = cells[x][y].type !== CellType.Mine ? calc(x, y) : cells

    return cells
})

const generateMines = createEffect((field: Cell[][]) => {
    const minedField: Cell[][] = JSON.parse(JSON.stringify(field))
    const mine: Cell = { hidden: true, type: CellType.Mine, isFlagged: false, aroundMinesCount: 0 }

    for (let index = 0; index < MINES_COUNT; index++) {
        const x = Math.floor(Math.random() * FIELD_SIZE)
        const y = Math.floor(Math.random() * FIELD_SIZE)

        minedField[x][y] = mine
    }
    return minedField
})

const $minesGenerated = createStore<boolean>(false)
sample({ clock: cellClick, fn: () => true, target: $minesGenerated })

const $field = createStore<Cell[][]>(defaultValue)
generateMines(defaultValue)

// $field.watch(console.log)
sample({
    clock: cellClick,
    source: { field: $field, minesGenerated: $minesGenerated },
    filter: ({ minesGenerated }) => minesGenerated,
    fn: ({ field }, coords) => ({ field, ...coords }),
    target: cellClickFx,
})

sample({ clock: generateMines.doneData, target: $field })

sample({ clock: cellClickFx.doneData, target: $field })

sample({ source: $field, clock: $minesGenerated, filter: (_, clock) => clock, target: generateMines })

export const selectors = {
    useFieldCell: ({ x, y }: CellCoords) => {
        const cells = useStore($field)

        return cells[x][y]
    },
}

export const events = {
    cellClick,
}
