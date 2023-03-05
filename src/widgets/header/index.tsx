import { GameSmile } from '@features/game-smile/ui'
import React from 'react'
import styled from 'styled-components'

export const Header = () => {
    return (
        <GameMenu>
            <MinesCounter />
            <GameSmile />
            <Timer />
        </GameMenu>
    )
}

const GameMenu = styled.div`
    width: 100%;
    height: 70px;
    display: flex;
    justify-content: space-between;
    padding: 15px;
    box-shadow: var(--dark-shadow), var(--light-shadow);
`
const MinesCounter = styled.div`
    height: 100%;
    width: 70px;
    background-color: aliceblue;
`
const Timer = styled.div`
    height: 100%;
    width: 70px;
    background-color: aliceblue;
`
