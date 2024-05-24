import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import ReExportButton from './ReExportButton'

const meta: Meta<typeof ReExportButton> = {
  title: 'Example/Re-export Button',
  component: ReExportButton,
  parameters: {
    docs: {
      description: {
        component:
          'This story exists to show that re-exporting a component with a different name does not cause problems.',
      },
    },
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    backgroundColor: { control: 'color' },
  },
  args: { onClick: fn() },
}

export default meta

export const Primary: StoryObj<typeof meta> = {
  args: {
    primary: true,
    label: 'Button',
  },
}
