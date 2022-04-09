import Lottie from 'react-lottie';
import loadData from './loading.json';

function MyLoading() {
  return (
    <Lottie options={{
      loop: true,
      autoplay: true,
      animationData: loadData,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
      }
    }}
      height={400}
      width={400}
      isStopped={false}
      isPaused={false} />
  );
}

export default MyLoading;
