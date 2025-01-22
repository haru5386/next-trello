'use client';

import { ChakraProvider, defaultSystem } from '@chakra-ui/react'

export default function ThemeProvider({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ChakraProvider value={defaultSystem}>
      {children}
    </ChakraProvider >
  );
}