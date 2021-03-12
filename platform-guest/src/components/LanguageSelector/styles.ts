import styled from 'styled-components';
import { MediaQueryBreakpoint } from 'types/MediaQueryBreakpoint';
import { motion } from 'framer-motion';

const ColouredWrapper = styled(motion.div)`
  position: absolute;
  top: 0;
  right: 0;
  background: #5ac0b1;
  height: 100vh;
  z-index: 95;
`;

const InnerWrapper = styled.div`
  height: 100vh;
  padding: 35px 31px;
  box-sizing: border-box;
  background-color: #ffffff;
  position: relative;
  display: flex;
  flex-direction: column;
  border-bottom-left-radius: 100px;

  @media screen and (max-width: ${MediaQueryBreakpoint.Smartphone}px) {
    padding: 45px 31px;
  }
`;

const LanguageRow = styled(motion.div)`
  display: flex;
  margin-right: 25px;
  margin-left: 25px;
  margin-bottom: 35px;
  cursor: pointer;
  // to make animation works we have to give a fixed height, not necessarly exact
  width: 100px;

  & > :first-child {
    margin-right: 32px;
  }

  @media screen and (max-width: ${MediaQueryBreakpoint.Smartphone}px) {
    margin-left: 0px;
  }
`;

const SelectLanguageInfo = styled.div`
  margin-right: 25px;
  margin-left: 25px;
  padding-bottom: 15px;
  margin-top: 50px;
  margin-bottom: 45px;
  border-bottom: 1px solid #a3abb1;
  text-transform: uppercase;

  @media screen and (max-width: ${MediaQueryBreakpoint.Smartphone}px) {
    margin-left: 0px;
  }
`;

export { ColouredWrapper, InnerWrapper, LanguageRow, SelectLanguageInfo };
