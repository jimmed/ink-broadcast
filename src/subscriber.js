import { h, Component } from 'ink'
import PropTypes from 'prop-types'
import invariant from 'invariant'
import BroadcastPropType from './propType'

/**
 * A <Subscriber> pulls the value for a channel off of context.broadcasts
 * and passes it to its children function.
 */
const makeSubscriber = channel => {
  if (!channel) {
    throw new Error('makeSubscriber expects a channel')
  }
  return class Subscriber extends Component {
    static componentName = `Subscriber(${channel})`
    static propTypes = {
      children: PropTypes.func,
      quiet: PropTypes.bool
    }

    static defaultProps = {
      quiet: false
    }

    static contextTypes = {
      [`broadcast-${channel}`]: BroadcastPropType
    }

    state = { value: null }

    getBroadcast(props = this.props, context = this.context) {
      const broadcast = context[`broadcast-${channel}`]

      invariant(
        props.quiet || broadcast,
        'A <Subscriber(%s) /> must be rendered in the context of a <Broadcast(%s) />',
        channel,
        channel
      )

      return broadcast
    }

    componentWillMount() {
      const broadcast = this.getBroadcast()

      if (broadcast) {
        // Mutating state here is icky and I hate it, but this is the only way
        // I can find of passing value on first render
        Object.assign(this.state, { value: broadcast.getValue() })
      }
    }

    componentDidMount() {
      const broadcast = this.getBroadcast()

      if (broadcast) {
        this.setState({ value: broadcast.getValue() })
        this.unsubscribe = broadcast.subscribe(value => {
          this.setState({ value })
        })
      }
    }

    componentWillUnmount() {
      if (this.unsubscribe) this.unsubscribe()
    }

    render() {
      const { children } = this.props
      return children ? children(this.state.value) : null
    }
  }
}

export default makeSubscriber
