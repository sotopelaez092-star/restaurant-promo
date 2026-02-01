import {Composition} from 'remotion';
import {RestaurantPromo} from './compositions/RestaurantPromo';

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="RestaurantPromo"
        component={RestaurantPromo}
        durationInFrames={300} // 10秒 * 30fps
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
