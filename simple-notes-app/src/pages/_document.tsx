import { Html, Head, Main, NextScript } from "next/document";
import Header from "@/components/main-Layout/header";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Header />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
