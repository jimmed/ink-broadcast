import makeBroadcaster from './broadcast'
import makeSubscriber from './subscriber'

const makeBroadcastContext = channel => ({
  Broadcast: makeBroadcaster(channel),
  Subscriber: makeSubscriber(channel)
})

export default makeBroadcastContext
