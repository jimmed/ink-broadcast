# ink-broadcast

An implementation of [react-broadcast][react-broadcast] for [ink][ink].

# Installation

Using [yarn][yarn]:

```
$ yarn add ink-broadcast
```

Then, import using your preferred syntax:

```js
// using ES6 modules
import makeBroadcastContext from 'ink-broadcast'

// using CommonJS modules
var makeBroadcastContext = require('ink-broadcast').default
```

# Usage

The default exported method will return you a pair of components: a `Broadcast` and a `Subscriber`. The two of these can be used together to pass data between components via
context, while neatly sidestepping the issue of any other components blocking updates
further down the tree, much like [react-broadcast][react-broadcast] does for React.

```js
const { Broadcast, Subscriber } = makeBroadcastContext('someNewContextChannel')
```

## Example

In this example, we're going to build a context-powered theming engine for a fictional [ink][ink]
application. The use-case here is being able to write components that are theme-aware,
while allowing control of the overall application theme from the top level.

Below, we create a top-level broadcaster, and reusable subscriber higher-order
component, and export them to use elsewhere in our application.

```js
import { h, Component, Text } from 'ink'
import makeBroadcastContext from 'ink-broadcast'

const { Broadcast, Subscriber } = makeBroadcastContext('theme')

/**
 * This component will wrap our application, allowing any subscribers
 * in the child component tree to subscribe to any changes to the theme.
 **/
export class ThemeProvider extends Component {
  state = { colour: 'white' }

  render() {
    // This is the value we'll be broadcasting to any subscribers
    const value = {
      colour: this.state.colour,
      setTheme: colour => this.setState({ colour })
    }

    return <Broadcast value={value}>{this.props.children}</Broadcast>
  }
}

/**
 * This higher-order component will wrap any components that wish to subscribe
 * to the currently selected theme.
 **/
export const withTheme = WrappedComponent => props => (
  <Subscriber>
    {theme => <WrappedComponent {...props} theme={theme} />}
  </Subscriber>
)
```

Next, we wrap the top level of our application with our newly-created broadcaster:

```js
import { h, render } from 'ink'
import { ThemeProvider } from './theme'
import App from './App'

render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
)
```

Finally, let's make a theme-aware component:

```js
import { h, Text } from 'ink'
import { withTheme } from './theme'

const SelectedThemeDetails = ({ theme }) => (
  <div>
    <Text white>
      The currently selected theme is:
    </Text>
    {' '}
    <Text bold keyword={theme.colour}>{theme.colour}</Text>
  </div>
)

export default withTheme(SelectedThemeDetails)
```

Assuming our `<App />` contains our new `SelectedThemeDetails` component, it
will render the currently selected theme.


[react-broadcast]: https://github.com/ReactTraining/react-broadcast
[ink]: https://github.com/vadimdemedes/ink
[yarn]: https://yarnpkg.com
