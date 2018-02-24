const PropTypes = require('prop-types')

const BroadcastPropType = PropTypes.shape({
  getValue: PropTypes.func.isRequired,
  publish: PropTypes.func.isRequired,
  subscribe: PropTypes.func.isRequired
})

export default BroadcastPropType
