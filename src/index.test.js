import { h, build, renderToString } from 'ink'
import makeBroadcastContext from './index'

describe('makeBroadcastContext', () => {
  it('should be a function', () => {
    expect(typeof makeBroadcastContext).toBe('function')
  })

  describe('when called with no arguments', () => {
    it('should throw an error', () => {
      expect(() => makeBroadcastContext()).toThrow()
    })
  })

  describe('when called with a channel name', () => {
    let result
    beforeEach(() => {
      result = makeBroadcastContext('test')
    })
    it('should generate a Broadcast/Subscriber pair', () => {
      expect(result).toHaveProperty('Broadcast')
      expect(result).toHaveProperty('Subscriber')
      const { Broadcast, Subscriber } = result
      const actual = renderToString(
        <Broadcast value="hey">
          <Subscriber>{value => value}</Subscriber>
        </Broadcast>
      )
      expect(actual).toBe('hey')
    })
  })
})

describe('when updating values', () => {
  it('should propagate updates to subscribers', () => {
    const { Broadcast, Subscriber } = makeBroadcastContext('context-test')
    const initialTree = build(
      <Broadcast value="hey">
        <span>
          <Subscriber>{value => value}</Subscriber>
        </span>
      </Broadcast>
    )
    expect(renderToString(initialTree)).toBe('hey')

    const mutatedTree = build(
      <Broadcast value="ho">
        <span>
          <Subscriber>{value => value}</Subscriber>
        </span>
      </Broadcast>,
      initialTree
    )
    expect(renderToString(mutatedTree)).toBe('ho')
  })

  describe('with multiple subscribers', () => {
    it('should propagate updates to subscribers', () => {
      const { Broadcast, Subscriber } = makeBroadcastContext('context-test')
      const initialTree = build(
        <Broadcast value="hey">
          <span>
            <Subscriber>{value => value}</Subscriber>
            <Subscriber>{value => value}</Subscriber>
          </span>
        </Broadcast>
      )
      expect(renderToString(initialTree)).toBe('heyhey')

      const mutatedTree = build(
        <Broadcast value="ho">
          <span>
            <Subscriber>{value => value}</Subscriber>
            <Subscriber>{value => value}</Subscriber>
          </span>
        </Broadcast>,
        initialTree
      )
      expect(renderToString(mutatedTree)).toBe('hoho')
    })
  })
})
