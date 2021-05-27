import { Collection, Messages } from '../types'

export interface IMessageFormatter {
    createMessageFromCollection(collection: Collection, messageType: Messages): string,
}