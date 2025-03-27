import { ciiuService } from "@/app/ciiu/service";
import {
  Card,
  Code,
  Container,
  Flex,
  Heading,
  Section,
} from "@radix-ui/themes";

export default async function Page() {
  const sections = await ciiuService.getSections();
  return (
    <Container size="2">
      <Section>
        <Flex direction="column" gap="4" asChild>
          <ul>
            {sections.map((section) => (
              <li key={section.section}>
                <Card>
                  <Flex direction="column" gap="2">
                    <Flex
                      asChild
                      direction={{ initial: "column", sm: "row" }}
                      gap="2"
                      align={{ initial: "start", sm: "center" }}
                    >
                      <header>
                        <Code variant="solid" size="2">
                          Sección {section.section}
                        </Code>
                        <Heading
                          as="h2"
                          size={{ initial: "3", sm: "4" }}
                          weight="regular"
                        >
                          {section.name}
                        </Heading>
                      </header>
                    </Flex>
                  </Flex>
                </Card>
              </li>
            ))}
          </ul>
        </Flex>
      </Section>
    </Container>
  );
}
