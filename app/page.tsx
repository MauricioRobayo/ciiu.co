import { ciiuService, type CiiuData } from "@/app/ciiu/service";
import {
  Box,
  Card,
  Code,
  Container,
  Flex,
  Heading,
  Section,
  Text,
} from "@radix-ui/themes";

export default async function Page() {
  const ciiuTree = await ciiuService.getTree();
  return (
    <Container>
      <Section size="2">
        <Tree tree={ciiuTree} />
      </Section>
    </Container>
  );
}

const LevelMap: Record<number, string> = {
  1: "Divisiones",
  2: "Grupos",
  3: "Clases",
};

function Tree({ tree, level = 1 }: { tree: CiiuData[]; level?: number }) {
  return (
    <Flex direction="column" gap="4" asChild>
      <ul>
        {tree.map((section) => (
          <li key={section.code}>
            <Card variant="surface">
              <Flex gap="2" direction="column">
                <Flex direction="row" align="center" gap="2">
                  <Code variant="solid">{section.code}</Code>
                  <Heading
                    as="h2"
                    size={{ initial: "1", sm: "2" }}
                    weight="regular"
                    className="line-clamp-1"
                  >
                    {section.description}
                  </Heading>
                </Flex>
                <Box>
                  {section.children?.length ? (
                    <details>
                      <summary>
                        <Text size="2" color="gray">
                          {LevelMap[level]}: {section.children.length}
                        </Text>
                      </summary>
                      <Box>
                        <Tree tree={section.children} level={level + 1} />
                      </Box>
                    </details>
                  ) : null}
                </Box>
              </Flex>
            </Card>
          </li>
        ))}
      </ul>
    </Flex>
  );
}
