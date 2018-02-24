import { h, Component } from 'ink'
import PropTypes from 'prop-types'
import invariant from 'invariant'
import BroadcastPropType from './propType'

function createBroadcast(initialValue) {
  let currentValue = initialValue
  let subscribers = []

  const getValue = () => currentValue

  const publish = state => {
    currentValue = state
    subscribers.forEach(s => s(currentValue))
  }

  const subscribe = subscriber => {
    subscribers.push(subscriber)

    return () => {
      subscribers = subscribers.filter(s => s !== subscriber)
    }
  }

  return {
    getValue,
    publish,
    subscribe
  }
}

const makeBroadcaster = channel => {
  if (!channel) {
    throw new Error('Broadcast cannot be created without a channel name')
  }
  return class Broadcast extends Component {
    static componentName = `Broadcast(${channel})`

    static propTypes = {
      children: PropTypes.node.isRequired,
      compareValues: PropTypes.func,
      value: PropTypes.any
    }

    static defaultProps = {
      compareValues: (prevValue, nextValue) => prevValue === nextValue
    }

    broadcast = createBroadcast(this.props.value)

    static childContextTypes = {
      [`broadcast-${channel}`]: BroadcastPropType.isRequired
    }

    getChildContext() {
      return {
        [`broadcast-${channel}`]: this.broadcast
      }
    }

    componentWillReceiveProps(nextProps) {
      if (!this.props.compareValues(this.props.value, nextProps.value)) {
        this.broadcast.publish(nextProps.value)
      }
    }

    render() {
      return this.props.children
    }
  }
}

export default makeBroadcaster
