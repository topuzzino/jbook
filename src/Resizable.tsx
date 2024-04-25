import { ResizableBox, ResizableBoxProps } from 'react-resizable'
import './Resizable.css'

interface ResizableProps {
  direction: 'horizontal' | 'vertical'
  children?: React.ReactNode
}

const Resizable: React.FC<ResizableProps> = ({ direction, children }) => {
  let resizableProps: ResizableBoxProps

  if (direction === 'horizontal') {
    resizableProps = {
      className: 'resize-horizontal',
      height: Infinity,
      width: window.innerWidth * 0.75,
      resizeHandles: ['e'],
      maxConstraints: [window.innerWidth * 0.75, Infinity],
      minConstraints: [window.innerWidth * 0.2, Infinity],

    }
  } else {
    resizableProps = {
      height: 300,
      width: Infinity,
      resizeHandles: ['w'],
      maxConstraints: [Infinity, window.innerHeight * 0.9],
      minConstraints: [Infinity, 24],
    }
  }

  return (
    <ResizableBox {...resizableProps}>
      {children}
    </ResizableBox>
  )
}

export default Resizable
