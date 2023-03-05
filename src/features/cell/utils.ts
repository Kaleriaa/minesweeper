import { Cell, CellType } from '@entities/cell/types'
import base from '@shared/assets/field/base.png'
import empty from '@shared/assets/field/empty.png'
import one from '@shared/assets/field/one.png'
import two from '@shared/assets/field/two.png'
import three from '@shared/assets/field/three.png'
import four from '@shared/assets/field/four.png'
import five from '@shared/assets/field/five.png'
import six from '@shared/assets/field/six.png'
import seven from '@shared/assets/field/seven.png'
import eight from '@shared/assets/field/eight.png'
import mine from '@shared/assets/field/mine.png'
import foundMine from '@shared/assets/field/found-mine.png'
import flag from '@shared/assets/field/flag.png'
import quest from '@shared/assets/field/quest.png'
import explodedMine from '@shared/assets/field/exploded-mine.png'

export const getImageUrl = (cell: Cell, isBombed: boolean) => {
    if (!cell.hidden) {
        if (cell.type === CellType.Empty) {
            switch (cell.aroundMinesCount) {
                case 0:
                    return empty
                case 1:
                    return one
                case 2:
                    return two
                case 3:
                    return three
                case 4:
                    return four
                case 5:
                    return five
                case 6:
                    return six
                case 7:
                    return seven
                case 8:
                    return eight
            }
        }

        if (cell.type === CellType.Mine) {
            if (cell.isFlagged) {
                return foundMine
            }
            if (isBombed) return explodedMine
            return mine
        }
    }

    if (cell.isFlagged) {
        return flag
    }

    if (cell.isQuestion) {
        return quest
    }

    return base
}
