import React from 'react';
import { useLocation, Link } from 'react-router-dom';

export default function KeepQueryLink(props) {
  const location = useLocation();
  return (
    <Link to={{ pathname: props.to, search: location.search }}>
      {props.children}
    </Link>
  );
}
