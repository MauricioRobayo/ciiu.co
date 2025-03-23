import { Flex, Text, Button, Container } from "@radix-ui/themes";

export default function MyApp() {
  return (
    <Container>
      <Flex direction="column" gap="2">
        <Text>Hello from Radix Themes :)</Text>
        <Button>Let&apos;s go</Button>
      </Flex>
    </Container>
  );
}
