import type { PropFilter } from 'react-docgen-typescript/lib/parser'

export const defaultPropFilter: PropFilter = (prop) => {
  return !prop.parent?.fileName.includes('node_modules')
}
