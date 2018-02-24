import { h, renderToString } from 'ink'
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
    })
    describe('generated pair', () => {
      it('should share a channel', () => {
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
})
