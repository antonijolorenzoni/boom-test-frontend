import styled from 'styled-components';
import { motion } from 'framer-motion';

// Added !important on background beacause Firefox has some problems and without that it renders a white button
export const PlusButton = styled(motion.div)`
  position: fixed;
  right: 44px;
  bottom: 59px;
  border: none;
  z-index: 1201;
  cursor: pointer;
  display: inline-block;
  width: 45px;
  height: 45px;
  padding: 12px;
  box-sizing: border-box;
  background: linear-gradient(#fff, #fff) center center / 100% 3px no-repeat content-box content-box,
    linear-gradient(#fff, #fff) center center / 3px 100% no-repeat content-box content-box, #5ac0b1 !important;
  border-radius: 50%;
  box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.25);
`;

export const plusButtonVariants = {
  default: {
    rotate: 0,
    background: `linear-gradient(#fff, #fff) center center / 100% 3px no-repeat content-box content-box,
    linear-gradient(#fff, #fff) center center / 3px 100% no-repeat content-box content-box, #5ac0b1`,
    transition: {
      duration: 0.2,
    },
  },
  clicked: {
    rotate: -45,
    background: `linear-gradient(#5ac0b1, #5ac0b1) center center / 100% 3px no-repeat content-box content-box,
    linear-gradient(#5ac0b1, #5ac0b1) center center / 3px 100% no-repeat content-box content-box, #fff`,
    transition: {
      duration: 0.2,
    },
  },
};

export const AddOrderButton = styled(motion.div)`
  background: #5ac0b1;
  box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.25);
  border-radius: 100px;
  position: fixed;
  bottom: 66px;
  cursor: pointer;
  z-index: 1201;
  padding: 6px 12px;
  color: #fff;
`;

export const Overlay = styled(motion.div)`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1200;
`;
