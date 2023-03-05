import { FIELD_SIZE } from '@entities/field/constants'
import { Cell } from '@features/cell'
import React, { useMemo } from 'react'
import styled from 'styled-components'

export const Field = () => {
    const board = useMemo(() => {
        const t = []
        for (let i = 0; i < FIELD_SIZE; i++) {
            for (let j = 0; j < FIELD_SIZE; j++) {
                t.push(<Cell key={i + 'cell' + j} x={i} y={j} />)
            }
        }

        return t
    }, [])

    return <Block>{board}</Block>
}

const Block = styled.div`
    width: 100%;
    height: calc(100% - 90px);
    display: grid;
    grid-gap: 2px;
    padding: 4px;
    background-color: var(--dark-color);
    grid-template-columns: repeat(16, 1fr);
    grid-template-rows: repeat(16, 1fr);
    box-shadow: var(--dark-shadow), var(--light-shadow);
`
