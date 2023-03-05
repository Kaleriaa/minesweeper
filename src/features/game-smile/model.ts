import { useStore } from 'effector-react'
import { createStore, createEvent, sample } from 'effector'

const clicked = createEvent()
const unClicked = createEvent()
const $fieldClicked = createStore<boolean>(false)

sample({ clock: clicked, fn: () => true, target: $fieldClicked })
sample({ clock: unClicked, fn: () => false, target: $fieldClicked })
export const selectors = { useFieldClicked: () => useStore($fieldClicked) }

export const events = {
    clicked,
    unClicked,
}
