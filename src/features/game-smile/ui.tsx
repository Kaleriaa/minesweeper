import styled from 'styled-components'
import smile from '@shared/assets/emoji/smile.png'
import push from '@shared/assets/emoji/pushSmile.png'
import dead from '@shared/assets/emoji/deadSmile.png'
import click from '@shared/assets/emoji/clickSmile.png'
import cool from '@shared/assets/emoji/coolSmile.png'
import { gameModel } from '@entities/game'
import { GameState } from '@entities/game/types'
import { fieldClickedModel } from '.'

const getSmile = (state: GameState, clicked: boolean) => {
    if (clicked) return click
    if (state === 'win') return cool
    if (state === 'inProgress') return smile
    if (state === 'lose') return dead

    return smile
}

export const GameSmile = () => {
    const state = gameModel.selectors.useGameState()
    const clicked = fieldClickedModel.selectors.useFieldClicked()
    const src = getSmile(state, clicked)

    return <Smile src={src} />
}

const Smile = styled.button<{ src: string }>`
    background-image: url(${(props) => props.src});
    background-size: 42px;
    width: 42px;
    height: 42px;
    &:active {
        background-image: url(${push});
    }
`
