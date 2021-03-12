import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Instruction = styled.div`
  margin-bottom: 20px;
  font-size: 13px;
  font-weight: 500;
`;

const SubInstruction = styled.div`
  font-size: 13px;
  margin-bottom: 20px;
`;

const EmailTemplate = styled.div`
  background-color: #f5f6f7;
  border: 1px solid #707070;
  border-radius: 4px;
  margin-bottom: 25px;
  padding: 15px;
  user-select: none;
`;

const Title = styled.p`
  font-size: 23px;
  font-weight: 700;
  line-height: 30px;
`;

const P = styled.p`
  margin-top: ${(props) => (props.withMargin ? '25px' : 0)};
  color: #1d1d1d;
  font-size: 14px;
  line-height: 21px;
`;

const Link = styled.span`
  color: #c61434;
  text-decoration: underline;
  cursor: pointer;
`;

const Signature = styled.p`
  margin-top: 25px;
  color: #1d1d1d;
  font-size: 12px;
  line-height: 15px;
  font-style: italic;
  text-align: right;
`;

export { Wrapper, Instruction, SubInstruction, EmailTemplate, Title, P, Link, Signature };
