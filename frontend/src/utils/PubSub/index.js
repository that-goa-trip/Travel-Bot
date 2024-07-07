import { useEffect, useContext } from 'react';
import Context from './Context';

/**
 *
 * @param {string} e Event name
 * @param {*} cb A callback created using useCallback
 * @returns
 */

function usePubSub(e, cb) {
  const { publish, subscribe, unsubscribe } = useContext(Context);

  useEffect(() => {
    if (e && cb) {
      subscribe(e, cb);
    }

    return () => {
      // Remove subscription when the component using this hook is unmounted or the callback updates
      if (e && cb) unsubscribe(e, cb);
    };
  }, [subscribe, unsubscribe, e, cb]);

  return { publish, subscribe, unsubscribe };
}

export default usePubSub;
