import {OffthreadVideo, useCurrentFrame} from 'remotion';
import {fadeIn} from '../utils/animations';
import backgroundVideo from '../assets/videos/background-fog.mp4';

export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = fadeIn(frame, 0, 45);

  return (
    <div
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: '#000000',
      }}
    >
      <OffthreadVideo
        src={backgroundVideo}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity,
        }}
        muted
      />
    </div>
  );
};
