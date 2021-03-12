import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding-top: 125px;

  @media screen and (max-width: 1080px) {
    padding: 0 15px;
  }
`;

const Link = styled(NavLink)`
  color: #5ac0b1;
`;

const Hr = styled.hr`
  margin: 50px 0 35px 0;
  border: 0.5px solid #a3abb1;
  width: 60ch;

  @media screen and (max-width: 1080px) {
    width: 65%;
  }
`;

export { Wrapper, Link, Hr };
