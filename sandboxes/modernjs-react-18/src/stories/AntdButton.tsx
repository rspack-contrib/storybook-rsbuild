import { Button, type ButtonProps } from 'antd'
import React from 'react'
import '@my-src/alias'

interface AntdButtonProps extends ButtonProps {
  myButtonExtra: string
}

/**
 * An extended Ant Design button with an extra string.
 */
export const AntdButton: React.FC<AntdButtonProps> = ({
  children,
  myButtonExtra,
  ...props
}) => {
  return (
    <Button {...props}>
      {children}
      {myButtonExtra}
    </Button>
  )
}
