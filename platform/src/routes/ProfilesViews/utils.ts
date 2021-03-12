import React from 'react';

interface Empty {}

function isEmpty<A>(item: A | Empty): item is Empty {
  return !Object.entries(item as Empty).length;
}

const Nullable = <A>(E: React.FC<A>) => (props: A | Empty) => (isEmpty(props) ? null : E(props));

export { isEmpty, Nullable };
