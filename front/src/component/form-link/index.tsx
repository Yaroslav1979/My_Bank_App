import React from "react";
import { Link } from "react-router-dom";
import "./index.css";

interface FormLinkProps {
  text?: string; 
  linkText?: React.ReactNode; 
  linkHref: string; 
}

const FormLink: React.FC<FormLinkProps> = ({ text, linkText, linkHref }) => {
  return (
    <div className="form-link">
      <p className="form-link__text">
        {text}
        <Link to={linkHref} className="form-link__link">
          {linkText}
        </Link>
      </p>
    </div>
  );
};

export default FormLink;
