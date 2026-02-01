import {useCurrentFrame} from 'remotion';
import {fadeIn} from '../utils/animations';

interface ArrowsProps {
  startFrame: number;
}

export const Arrows: React.FC<ArrowsProps> = ({startFrame}) => {
  const frame = useCurrentFrame();
  const opacity = fadeIn(frame, startFrame, 20);

  const arrowStyle: React.CSSProperties = {
    fontSize: '60px',
    color: '#EAB308',
    fontWeight: 'bold',
    textShadow: '0 5px 20px rgba(234, 179, 8, 0.6)',
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '60px',
        opacity,
      }}
    >
      {/* 左箭头 */}
      <div style={arrowStyle}>
        {'>>>'}
      </div>

      {/* 按钮占位（由父组件渲染） */}
      <div style={{flex: '0 0 auto'}} />

      {/* 右箭头 */}
      <div style={{...arrowStyle, transform: 'scaleX(-1)'}}>
        {'>>>'}
      </div>
    </div>
  );
};
