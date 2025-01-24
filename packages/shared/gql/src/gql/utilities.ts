import { gql } from "@apollo/client";

export const queryOembedInfo = gql`
  query queryOembedInfo($url: String!) {
    queryOembedInfo(url: $url) {
      html
      width
      height
    }
  }
`;
