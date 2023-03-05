import styled from 'styled-components'
import { Header, Field } from '@widgets'

export const App = () => {
    return (
        <PlayGround>
            <Header />
            <Field />
        </PlayGround>
    )
}

const PlayGround = styled.div`
    width: 500px;
    height: 590px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-shadow: inset 10px 10px 1px -8px #cccc, inset -10px -10px 1px -8px #6666;
    padding: 20px;
    background-color: var(--primary-color);
`
