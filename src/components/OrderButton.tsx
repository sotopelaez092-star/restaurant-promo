import {useCurrentFrame, useVideoConfig} from 'remotion';
import {buttonBounceIn} from '../utils/animations';

interface OrderButtonProps {
  startFrame: number;
  width?: number;
  height?: number;
}

export const OrderButton: React.FC<OrderButtonProps> = ({
  startFrame,
  width = 507.5,
  height = 136.5,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {translateY, scale, opacity} = buttonBounceIn(frame, fps, startFrame);

  return (
    <div
      style={{
        display: 'inline-block',
        transform: `translateY(${translateY}px) scale(${scale})`,
        opacity,
      }}
    >
      <div
        style={{
          backgroundColor: '#ffbd59',
          color: '#000000',
          fontFamily: 'Anton, Impact, sans-serif',
          fontSize: '75px',
          fontWeight: '900',
          width: `${width}px`,
          height: `${height}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50px',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          boxShadow: '0 15px 40px rgba(234, 179, 8, 0.5)',
          cursor: 'pointer',
          WebkitTextStroke: '1.5px #000000',
          paintOrder: 'stroke fill',
        }}
      >
        ORDER NOW
      </div>
    </div>
  );
};
