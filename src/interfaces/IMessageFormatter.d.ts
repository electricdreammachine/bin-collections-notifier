import { Collection } from '../types'
import { Messages } from '../constants'

export interface IMessageFormatter {
    createMessageFromCollection(collection: Collection, messageType: Messages): string,
}