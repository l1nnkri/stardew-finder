import React from 'react';
import { Icon } from 'antd';

const getColorForIcon = ({ dead, done, daysToHarvest }) => {
  if (dead) {
    return 'black';
  }
  if (done) {
    return 'green';
  }
  return 'red';
};

const CropMapIcon = props => {
  const { dead, done, daysToHarvest } = props;
  return (
    <Icon type="check" style={{ color: getColorForIcon({ dead, done }) }} />
  );
};
export default CropMapIcon;
