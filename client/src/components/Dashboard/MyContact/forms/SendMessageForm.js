import React, { useContext } from "react";
import styled, { ThemeContext } from "styled-components";
import { useForm } from "react-hook-form";
import ErrorMessage from "../../../../helpers/ErrorMessage";
const SendMessageFormStyled = styled.form`
  input:required {
    box-shadow: none;
  }
  input:invalid {
    box-shadow: none;
  }
  input,
  textarea {
    background: none;
    width: 100%;
    color: black;
    font-size: ${({ theme }) => theme.input.fontSize} !important;
    display: block;
    border: none;
    border-radius: 1;
    border: none;
    outline: 0;
    border-bottom: 2px solid lightgrey;
    margin-top: 2.5em;
    margin-bottom: 2.5em;
  }
  input:focus,
  textarea:focus {
    border-color: ${({ theme }) => theme.input.focus.border.color};
    transition: 3s;
  }
  button {
    color: ${({ theme }) => theme.button.textColor.primary};
    font-size: ${({ theme }) => theme.button.fontSize} !important;
    background-color: lightgrey;
    border: none;
    box-shadow: 0px 3px 6px #908e8e;
    border-radius: ${({ theme }) => theme.button.borderRadius} !important;
  }
  button[type="submit"] {
    background-color: ${({ theme }) => theme.button.backgroundColor.primary};
    padding: 10px;
    display: block;
    margin: 10px auto;
    width: 100%;
    border: none;
  }
  @media (min-width: 600px) {
    button[type="submit"] {
      width: ${({ theme }) => theme.button.width.primary};
    }
  }
`;
export default function SendMessageForm({
  messageDetails,
  onSubmit,
  handleMessageDetailsChange
}) {
  const { register, handleSubmit, errors } = useForm({
    mode: "onSubmit",
    reValidateMode: "onBlur"
  });
  const theme = useContext(ThemeContext);
  return (
    <SendMessageFormStyled
      method="POST"
      onSubmit={handleSubmit(onSubmit)}
      theme={theme}
    >
      <textarea
        placeholder="Message"
        name="message"
        value={messageDetails.message}
        onChange={({ target }) => {
          handleMessageDetailsChange("message", target.value);
        }}
        ref={register({ required: true })}
      />
      <ErrorMessage
        field={errors.message}
        errorType="required"
        message="Message is required."
      />
      <button type="submit">Send</button>
    </SendMessageFormStyled>
  );
}
