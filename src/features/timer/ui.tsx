import { numberMap } from '@shared/constants/numberMap'
import React from 'react'
import styled from 'styled-components'
import { timerModel } from '.'

export const Timer = () => {
    const timer = timerModel.selectors.useTimer()
    const seconds = timer.toString().padStart(3, '0').split('')

    return (
        <Wrapper>
            {seconds.map((sec, i) => (
                <img key={i} src={numberMap[sec]} width="33%" height="100%" />
            ))}
        </Wrapper>
    )
}
const Wrapper = styled.div`
    height: 100%;
    width: 69px;
    background-color: aliceblue;
    color: black;
`
