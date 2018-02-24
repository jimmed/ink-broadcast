import { h, Component, renderToString } from 'ink'
import makeBroadcaster from './broadcast'

describe('makeBroadcaster', () => {
  it('should be a function', () => {
    expect(typeof makeBroadcaster).toBe('function')
  })
  describe('when given no arguments', () => {
    it('should throw an error', () => {
      expect(() => makeBroadcaster()).toThrow()
    })
  })

  describe('when given a channel name', () => {
    it('should return an Ink component', () => {
      expect(() => makeBroadcaster('test')).not.toThrow()
      const Broadcaster = makeBroadcaster('test')
      expect(typeof Broadcaster).toBe('function')
    })
  })
})

describe('<Broadcast />', () => {
  let Broadcast
  beforeEach(() => {
    Broadcast = makeBroadcaster('test')
  })
  describe('when rendered with no children', () => {
    it('should render nothing', () => {
      const actual = renderToString(<Broadcast />)
      expect(actual).toBe('')
    })
  })

  describe('when rendered with a child', () => {
    it('should render its child', () => {
      const actual = renderToString(<Broadcast>child text</Broadcast>)
      expect(actual).toBe('child text')
    })
    it('the broadcast object should be accessible via the context API', () => {
      let lastContext
      class RenderContext extends Component {
        render(props, state, context) {
          lastContext = context
          return ''
        }
      }
      renderToString(
        <Broadcast value="hey">
          <RenderContext />
        </Broadcast>
      )
      expect(typeof lastContext).toBe('object')
      expect(lastContext).toHaveProperty('broadcast-test')
      const broadcast = lastContext['broadcast-test']
      expect(typeof broadcast.getValue).toBe('function')
      expect(broadcast.getValue()).toBe('hey')
    })
  })

  describe('when rendered inside another, different broadcast', () => {
    const OtherBroadcast = makeBroadcaster('other')
    it('should render its child', () => {
      const actual = renderToString(
        <OtherBroadcast>
          <Broadcast>child text</Broadcast>
        </OtherBroadcast>
      )
      expect(actual).toBe('child text')
    })
    it('the broadcast object should be accessible via the context API', () => {
      let lastContext
      class RenderContext extends Component {
        render(props, state, context) {
          lastContext = context
          return ''
        }
      }
      renderToString(
        <OtherBroadcast>
          <Broadcast value="hey">
            <RenderContext />
          </Broadcast>
        </OtherBroadcast>
      )
      expect(typeof lastContext).toBe('object')
      expect(lastContext).toHaveProperty('broadcast-test')
      const broadcast = lastContext['broadcast-test']
      expect(typeof broadcast.getValue).toBe('function')
      expect(broadcast.getValue()).toBe('hey')
    })
  })

  describe('when rendered outside another, different broadcast', () => {
    const OtherBroadcast = makeBroadcaster('other')
    it('should render its child', () => {
      const actual = renderToString(
        <Broadcast>
          <OtherBroadcast>child text</OtherBroadcast>
        </Broadcast>
      )
      expect(actual).toBe('child text')
    })
    it('the broadcast object should be accessible via the context API', () => {
      let lastContext
      class RenderContext extends Component {
        render(props, state, context) {
          lastContext = context
          return ''
        }
      }
      renderToString(
        <Broadcast value="hey">
          <OtherBroadcast value="ho">
            <RenderContext />
          </OtherBroadcast>
        </Broadcast>
      )
      expect(typeof lastContext).toBe('object')
      expect(lastContext).toHaveProperty('broadcast-test')
      const broadcast = lastContext['broadcast-test']
      expect(typeof broadcast.getValue).toBe('function')
      expect(broadcast.getValue()).toBe('hey')
    })
  })
})
