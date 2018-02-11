import { h, Component } from 'ink'
import PropTypes from 'prop-types'
import invariant from 'invariant'

/**
 * A <Subscriber> pulls the value for a channel off of context.broadcasts
 * and passes it to its children function.
 */
export default class Subscriber extends Component {
  static propTypes = {
    channel: PropTypes.string.isRequired,
    children: PropTypes.func,
    quiet: PropTypes.bool
  }

  static defaultProps = {
    quiet: false
  }

  static contextTypes = {
    broadcasts: PropTypes.object
  }

  constructor(props, context) {
    super(props, context)
    this.state = { value: null }
  }

  getBroadcast(props = this.props, context = this.context) {
    const broadcasts = context.broadcasts || {}
    const broadcast = broadcasts[props.channel]

    invariant(
      props.quiet || broadcast,
      '<Subscriber channel="%s"> must be rendered in the context of a <Broadcast channel="%s">',
      props.channel,
      props.channel
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
