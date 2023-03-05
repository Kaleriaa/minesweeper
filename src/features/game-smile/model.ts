import { useStore } from 'effector-react'
import { createStore, createEvent, sample } from 'effector'

const update = createEvent<boolean>()
const $fieldClicked = createStore<boolean>(false)

sample({ clock: update, target: $fieldClicked })
export const selectors = { useFieldClicked: () => useStore($fieldClicked) }

export const events = {
    update,
}
