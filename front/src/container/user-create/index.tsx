import React from "react";
import Title from "../../component/title"
import RegisterForm from '../../component/fields';
import Subtitle from "../../component/subtitle";
import warning from "../../svg/warning.svg"
import "./index.css";


export default function Container(
  {children}: {children?: React.ReactNode,
    onCreate?: boolean,
    placeholder?: string,
    button?: boolean,
    id?: string,    
  } ): JSX.Element {
    return (
    <section>
      <div className="head">     
        <Title>Sign up {children} </Title>
        <Subtitle> Choose a registration method </Subtitle>
      </div>
    <RegisterForm />
    <span className="warning">
      <img src={warning} alt="" /> <span>A user with the same name is already exist</span>
    </span>     
    </section>
  );
}
