import { fieldModel } from '@entities/field/model'
import { gameModel } from '@entities/game'
import { fieldClickedModel } from '@features/game-smile'
import styled from 'styled-components'
import { getImageUrl } from './utils'

type CellProps = {
    x: number
    y: number
}

export const Cell: React.FC<CellProps> = ({ x, y }) => {
    const cell = fieldModel.selectors.useFieldCell({ x, y })
    const lastCoords = fieldModel.selectors.useLastCoords()
    const isLastClicked = x === lastCoords?.x && y === lastCoords.y
    const source = getImageUrl(cell, isLastClicked)

    const isGameEnd = gameModel.selectors.useIsGameEnd()

    return (
        <CellWrapper
            onClick={() => !isGameEnd && cell.hidden && fieldModel.events.cellClick({ x, y })}
            onContextMenu={(e) => {
                e.preventDefault()
                e.stopPropagation()
                !isGameEnd && cell.hidden && fieldModel.events.rightCellClick({ x, y })
            }}
            src={source}
            onMouseDown={() => fieldClickedModel.events.clicked()}
            onMouseUp={() => fieldClickedModel.events.unClicked()}
        />
    )
}

const CellWrapper = styled.div<{ src: string }>`
    width: 26px;
    height: 26px;
    background-image: url(${({ src }) => src});
    background-size: 26px;
`
