/** @jsx jsx */
import { jsx } from '@emotion/core';
import styled from '@emotion/styled';

const Container = styled.div`
  display: grid;
  grid-template-columns: 90px auto;
  grid-template-rows: auto auto auto;
  border-bottom: 1px solid;
  padding-bottom: 20px;
  margin-bottom: 20px;
`;

const Avatar = styled.img`
  width: 90px;
  grid-row: 1 / span 3;
  grid-column: 1;
`;

const Contact = styled.span`
  text-align: left;
  font-size: x-large;
  padding-left: 30px;
`;

const Date = styled.span`
  text-align: right;
  grid-row: 2;
  grid-column: 2 / span 1;
  font-size: small;
`;

const MessagePreview = styled.span`
  padding-left: 30px;
  text-align: left;
  grid-row: 3;
  grid-column: 2 / span 1;
`;

export default function SmsItem(props) {
  console.log(props)
  return (
    <Container>
      <Avatar src={require('./avatar.png')} alt="avatar" />
      <Contact>{props.contact}</Contact>
      <Date>{props.date}</Date>
      <MessagePreview>{props.message.substring(0, 60)}...</MessagePreview>
    </Container>
  )
};