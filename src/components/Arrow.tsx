import {useCurrentFrame} from 'remotion';
import {fadeIn} from '../utils/animations';

interface ArrowProps {
  startFrame: number;
  direction: 'left' | 'right';
  x: number;
  y: number;
  width?: number;
  height?: number;
  fontSize?: number;
  letterSpacing?: number;
}

export const Arrow: React.FC<ArrowProps> = ({
  startFrame,
  direction,
  x,
  y,
  width = 151.3,
  height = 80.2,
  fontSize = 60,
  letterSpacing = 5,
}) => {
  const frame = useCurrentFrame();
  const opacity = fadeIn(frame, startFrame, 20);

  const arrowText = direction === 'left' ? '>>>' : '<<<';

  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
        opacity,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <span
        style={{
          fontSize: `${fontSize}px`,
          fontWeight: 'bold',
          color: '#ffbd59',
          fontFamily: 'Arial, sans-serif',
          letterSpacing: `${letterSpacing}px`,
        }}
      >
        {arrowText}
      </span>
    </div>
  );
};
