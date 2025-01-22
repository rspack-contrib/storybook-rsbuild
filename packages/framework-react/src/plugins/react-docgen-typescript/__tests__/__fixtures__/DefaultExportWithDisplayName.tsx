import * as React from 'react'

interface DefaultExportComponentProps {
  /** Button color. */
  color: 'blue' | 'green'
}

/**
 * A simple component.
 */
const DefaultExportComponent: React.FC<DefaultExportComponentProps> = (
  props,
) => <button style={{ backgroundColor: props.color }}>{props.children}</button>

DefaultExportComponent.displayName = 'DefaultExportComponentWithDisplayName'

export default DefaultExportComponent
