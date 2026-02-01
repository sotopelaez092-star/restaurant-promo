import {OffthreadVideo, useCurrentFrame, useVideoConfig} from 'remotion';
import {riseAndBounce} from '../utils/animations';

interface CircleVideoProps {
  src: string;
  size: number;
  startFrame: number;
  style?: React.CSSProperties;
}

export const CircleVideo: React.FC<CircleVideoProps> = ({
  src,
  size,
  startFrame,
  style,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {translateY, scale, opacity} = riseAndBounce(frame, fps, startFrame);

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        border: '4px solid #ffbd59',
        overflow: 'hidden',
        boxShadow: '0 10px 40px rgba(234, 179, 8, 0.4)',
        transform: `translateY(${translateY}px) scale(${scale})`,
        opacity,
        ...style,
      }}
    >
      <OffthreadVideo
        src={src}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
        muted
      />
    </div>
  );
};
