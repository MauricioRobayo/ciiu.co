import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import {
  Box,
  Container,
  Flex,
  Heading,
  TextField,
  Theme,
} from "@radix-ui/themes";
import type { Metadata } from "next";
import { useId } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Consulta Código CIIU",
  description: "Consulta y descripción de códigos CIIU",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const id = useId();
  return (
    <html lang="es-CO">
      <body>
        <Theme accentColor="green">
          <Box className="bg-[var(--green-4)]">
            <header>
              <Container size="1" py="4" mx={{ initial: "2", sm: "0" }}>
                <Flex gap="2" justify="center">
                  <Heading color="green">
                    <label htmlFor={id}>CIIU</label>
                  </Heading>
                  <TextField.Root
                    placeholder="Buscar código CIIU"
                    id={id}
                    className="w-full"
                  >
                    <TextField.Slot>
                      <MagnifyingGlassIcon height="16" width="16" />
                    </TextField.Slot>
                  </TextField.Root>
                </Flex>
              </Container>
            </header>
          </Box>
          <Box px="2">{children}</Box>
        </Theme>
      </body>
    </html>
  );
}
