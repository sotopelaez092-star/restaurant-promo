import {Audio, AbsoluteFill} from 'remotion';
import {Background} from '../components/Background';
import {GoldenDots} from '../components/GoldenDots';
import {TitleFlip} from '../components/TitleFlip';
import {DescriptionMerge} from '../components/DescriptionMerge';
import {CircleVideo} from '../components/CircleVideo';
import {SideImage} from '../components/SideImage';
import {OrderButton} from '../components/OrderButton';
import {Arrow} from '../components/Arrow';

// 导入素材
import mainDishVideo from '../assets/images/main-dish.jpg';
import dishLeftVideo from '../assets/images/dish-bottom-left.jpg';
import dishRightVideo from '../assets/images/dish-bottom-right.jpg';
import sideLeftImage from '../assets/images/side-left.png';
import sideRightImage from '../assets/images/side-right.png';
import bgMusic from '../assets/audio/bg-music.mp3';

export const RestaurantPromo: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#000000',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      {/* 背景音乐 */}
      <Audio src={bgMusic} />

      {/* 背景雾效 */}
      <Background />

      {/* 金色点装饰 */}
      <GoldenDots />

      {/* 主标题 "SPECIAL" - 从第30帧开始 (1s) */}
      <div
        style={{
          position: 'absolute',
          top: '60px',
          left: 0,
          right: 0,
        }}
      >
        <TitleFlip text="SPECIAL" startFrame={30} letterDelay={3} fontSize={260} />
      </div>

      {/* 主标题 "DINNER" - 从第60帧开始 (2s) */}
      <div
        style={{
          position: 'absolute',
          top: '302.4px',
          left: '66.6px',
          width: '946.8px',
          height: '365.8px',
        }}
      >
        <TitleFlip text="DINNER" startFrame={60} letterDelay={3} fontSize={300} />
      </div>

      {/* 描述文字 - 从第90帧开始 (3s) */}
      <div
        style={{
          position: 'absolute',
          top: '643.6px',
          left: '142.5px',
          width: '795px',
          height: '153.7px',
        }}
      >
        <DescriptionMerge
          text="Craving Indian flavors? Experience our authentic cuisine with every bite.Visit us today!"
          startFrame={90}
          fontSize={46.15}
        />
      </div>

      {/* 两侧半圆图片 - 从第105帧开始 (3.5s) */}
      <SideImage
        src={sideLeftImage}
        side="left"
        startFrame={105}
        width={355.6}
        height={349.3}
        x={-150}
        y={729}
      />
      <SideImage
        src={sideRightImage}
        side="right"
        startFrame={105}
        width={355.6}
        height={349.3}
        x={875}
        y={729}
      />

      {/* 中间大圆形视频 - 从第105帧开始 (3.5s) */}
      <div
        style={{
          position: 'absolute',
          top: '881.8px',
          left: '218.2px',
        }}
      >
        <CircleVideo src={mainDishVideo} size={643.2} startFrame={105} />
      </div>

      {/* 底部左圆形视频 */}
      <div
        style={{
          position: 'absolute',
          top: '1174.9px',
          left: '39.1px',
        }}
      >
        <CircleVideo src={dishLeftVideo} size={358.6} startFrame={105} />
      </div>

      {/* 底部右圆形视频 */}
      <div
        style={{
          position: 'absolute',
          top: '1174.9px',
          left: '682.3px',
        }}
      >
        <CircleVideo src={dishRightVideo} size={358.6} startFrame={105} />
      </div>

      {/* ORDER NOW 按钮 - 从第135帧开始 (4.5s) */}
      <div
        style={{
          position: 'absolute',
          top: '1609.5px',
          left: '286.3px',
        }}
      >
        <OrderButton startFrame={135} width={507.5} height={136.5} />
      </div>

      {/* 箭头 - 从第150帧开始 (5s) */}
      <Arrow
        startFrame={150}
        direction="left"
        x={66.8}
        y={1625.2}
        width={151.3}
        height={80.2}
        fontSize={90}
      />
      <Arrow
        startFrame={150}
        direction="right"
        x={861.8}
        y={1625.2}
        width={151.3}
        height={80.2}
        fontSize={90}
      />

      {/* 底部联系信息 */}
      <div
        style={{
          position: 'absolute',
          bottom: '100px',
          left: 0,
          right: 0,
          textAlign: 'center',
          color: '#ffbd59',
          fontSize: '43px',
          fontFamily: 'Poppins, sans-serif',
        }}
      >
        reallygreatsite.com / +123 456 7890
      </div>
    </AbsoluteFill>
  );
};
