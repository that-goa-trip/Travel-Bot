import React, { useRef, useCallback } from 'react';
import Context from '../Context';

const PubSubContextProvider = props => {
  const subscriptions = useRef({});

  const publish = useCallback((event, data) => {
    const subscribers = subscriptions.current[event];

    if (!subscribers) return;

    for (const subscriber of subscribers) subscriber(data);
  }, []);

  const subscribe = useCallback((event, callback) => {
    const subs = subscriptions.current[event] || [];

    subscriptions.current = {
      ...subscriptions.current,
      [event]: [...subs, callback],
    };
  }, []);

  const unsubscribe = useCallback((event, callback) => {
    const subs = subscriptions.current[event] ? subscriptions.current[event].filter(sub => sub !== callback) : [];
    subscriptions.current = {
      ...subscriptions.current,
      [event]: subs,
    };
  }, []);

  return <Context.Provider value={{ publish, subscribe, unsubscribe }}>{props.children}</Context.Provider>;
};

export default PubSubContextProvider;
