import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #1d1d1b;

  @media screen and (max-width: 1080px) {
    background-color: #282826;
  }
`;

const HeaderWrapper = styled.div`
  position: absolute;
  top: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const Logo = styled.img`
  top: 20px;
  left: 40px;
  height: 50px;
  margin-left: 50px;
`;

const Image = styled.img`
  width: 50%;
  height: auto;
  position: absolute;
  top: -125px;
  right: -35px;
`;

const ContentWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  flex-basis: 50%;
  margin-top: 85px;
  margin-left: 40px;

  @media screen and (max-width: 1080px) {
    flex-direction: column;
    flex-basis: 80%;
    margin-top: 0;
    margin-left: 0;
  }
`;

const CardContent = styled.div`
  display: flex;
  width: 100%;
  background-color: #282826;
  align-items: center;
  flex-direction: row;
  padding: 40px;

  @media screen and (max-width: 1080px) {
    flex-direction: column;
    padding: 0px;
  }
`;

const CardInnerContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  width: 50%;

  @media screen and (max-width: 1080px) {
    justify-content: center;
    width: 100%;
  }
`;

export { Wrapper, HeaderWrapper, Logo, Image, ContentWrapper, CardContent, CardInnerContent };
