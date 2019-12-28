import React from 'react';
import farmUrl from '../img/Farm.png';

export default function FarmView(props) {
  return (
    <div>
      <img src={farmUrl} style={{ maxWidth: '100%' }} />
    </div>
  );
}
