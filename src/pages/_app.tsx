import "@/styles/globals.css";
import theme from "@/Theme/theme";
import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";


export default function App({ Component, pageProps }: AppProps) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  return (
    <ChakraProvider value={theme}>
      {isMounted ? <Component {...pageProps} /> : null}
    </ChakraProvider>
  );
}
