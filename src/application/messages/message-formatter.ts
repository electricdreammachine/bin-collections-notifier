import { injectable } from 'inversify'
import { format } from 'date-fns'
import { IMessageFormatter } from '../../interfaces'
import { Collection } from '../../types'
import { Messages } from '../../constants'

@injectable()
export class MessageFormatter implements IMessageFormatter {
    createMessageFromCollection(collection: Collection, messageType: Messages) {
        switch (messageType) {
            case Messages.UPCOMING_COLLECTION:
                return `Your next bin collection is tomorrow (${format(new Date(collection.date), 'E do MMMM yyyy')}), and is a ${collection.type} collection.`
            default:
                return ''
        }
    }
}