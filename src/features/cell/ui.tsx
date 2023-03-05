import { fieldModel } from '@entities/field/model'
import { getImageUrl } from './utils'

type CellProps = {
    x: number
    y: number
}

export const Cell: React.FC<CellProps> = ({ x, y }) => {
    const cell = fieldModel.selectors.useFieldCell({ x, y })
    const source = getImageUrl(cell)

    // console.log(source)

    return <img onClick={() => fieldModel.events.cellClick({ x, y })} src={source} width={26} />
}
