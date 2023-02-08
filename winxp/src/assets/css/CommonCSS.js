import { createGlobalStyle } from "styled-components";

const CommonCSS = createGlobalStyle`
  *{
    color: #fff;
  }
  .hidden{
    position: absolute !important;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(1px 1px 1px 1px);
    clip: rect(1px, 1px, 1px, 1px);
  }
`;

export default CommonCSS;
