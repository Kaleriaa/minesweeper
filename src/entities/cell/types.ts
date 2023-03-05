export type AroundMinesCount = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

export type Cell = {
    hidden: boolean
    type: CellType
    aroundMinesCount: AroundMinesCount
    isFlagged: boolean
    isQuestion: boolean
}

export enum CellType {
    Mine,
    Base,
    Empty,
}

export type CellCoords = {
    x: number
    y: number
}
