import "@/styles/globals.css";
import theme from "@/Theme/theme";
import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";


export default function App({ Component, pageProps }: AppProps) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  return (
    <ChakraProvider value={theme}>
      {isMounted ? <><Component {...pageProps} /><ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="dark" /></> : null}
    </ChakraProvider>
  );
}
