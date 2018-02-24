import { h, renderToString } from 'ink'
import makeSubscriber from './subscriber'
import makeBroadcaster from './broadcast'

describe('makeSubscriber', () => {
  it('should be a function', () => {
    expect(typeof makeSubscriber).toBe('function')
  })
  describe('when given no arguments', () => {
    it('should throw an error', () => {
      expect(() => makeSubscriber()).toThrow()
    })
  })

  describe('when given a channel name', () => {
    it('should return an Ink component', () => {
      expect(() => makeSubscriber('test')).not.toThrow()
      const Subscriber = makeSubscriber('test')
      expect(typeof Subscriber).toBe('function')
    })
  })
})

describe('<Subscriber />', () => {
  let Subscriber
  beforeEach(() => {
    Subscriber = makeSubscriber('test')
  })

  describe('when rendered alone', () => {
    it('should throw an error', () => {
      expect(() =>
        renderToString(<Subscriber>{() => ''}</Subscriber>)
      ).toThrow()
    })

    it('should not throw an error if its quiet prop is true', () => {
      expect(() =>
        renderToString(<Subscriber quiet>{() => ''}</Subscriber>)
      ).not.toThrow()
    })
  })

  describe('when rendered inside a matching <Broadcast />', () => {
    let Broadcast
    beforeEach(() => {
      Broadcast = makeBroadcaster('test')
    })
    it('should render the value passed by context', () => {
      const actual = renderToString(
        <Broadcast value="hey">
          <span>
            <Subscriber>{value => value}</Subscriber>
          </span>
        </Broadcast>
      )
      expect(actual).toBe('hey')
    })

    describe('when inside another, matching <Subscriber />', () => {
      it('should render the value passed by context', () => {
        const actual = renderToString(
          <Broadcast value="hey">
            <Subscriber>
              {value => (
                <span>
                  {value}
                  <Subscriber>{value => value}</Subscriber>
                </span>
              )}
            </Subscriber>
          </Broadcast>
        )
        expect(actual).toBe('heyhey')
      })
    })

    describe('when inside another, different <Subscriber />', () => {
      let OtherBroadcast
      let OtherSubscriber
      beforeEach(() => {
        OtherBroadcast = makeBroadcaster('other')
        OtherSubscriber = makeSubscriber('other')
      })
      it('should render the values passed by each context', () => {
        const actual = renderToString(
          <OtherBroadcast value="hey">
            <Broadcast value="ho">
              <Subscriber>
                {value => (
                  <OtherSubscriber>
                    {otherValue => otherValue + value}
                  </OtherSubscriber>
                )}
              </Subscriber>
            </Broadcast>
          </OtherBroadcast>
        )
        expect(actual).toBe('heyho')
      })
    })
  })
})
