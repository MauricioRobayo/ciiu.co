import { ciiuService, type CiiuData } from "@/app/ciiu/service";
import {
  Box,
  Code,
  Container,
  Flex,
  Link,
  Section,
  Text,
  Heading,
} from "@radix-ui/themes";
import NextLink from "next/link";
import { twJoin } from "tailwind-merge";

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

const LevelMap: Record<
  number,
  {
    singular: string;
    plural: string;
    cn: { group: string; rotate: string; font: string };
  }
> = {
  1: {
    singular: "División",
    plural: "Divisiones",
    cn: {
      group: "group/divisions",
      rotate: "group-open/divisions:rotate-90",
      font: "group-open/divisions:font-bold",
    },
  },
  2: {
    singular: "Grupo",
    plural: "Grupos",
    cn: {
      group: "group/groups",
      rotate: "group-open/groups:rotate-90",
      font: "group-open/groups:font-bold",
    },
  },
  3: {
    singular: "clase",
    plural: "Clases",
    cn: {
      group: "group/classes",
      rotate: "group-open/classes:rotate-90",
      font: "group-open/classes:font-bold",
    },
  },
};

function Tree({ tree, level = 1 }: { tree: CiiuData[]; level?: number }) {
  const levelData = LevelMap[level];
  return (
    <ul className={level > 3 ? "" : "divide-[var(--gray-6)] divide-y"}>
      {tree.map((section) => (
        <li key={`${section.code}-${section.description}`}>
          {section.children?.length ? (
            <Flex mx="2" my="2" direction="column" asChild>
              <details className={twJoin("cursor-pointer", levelData.cn.group)}>
                <summary className="list-none [&::-webkit-details-marker]:hidden">
                  <Flex direction="column" gap="1">
                    <Flex direction="row" align="center" gap="2">
                      <Code variant="solid">{section.code}</Code>
                      <Heading
                        size={{ initial: "1", sm: "2" }}
                        className="line-clamp-1"
                        as="h2"
                        weight="regular"
                      >
                        <Text className={levelData.cn.font}>
                          {section.description}
                        </Text>
                      </Heading>
                    </Flex>
                    <Flex align="center" gap="1">
                      <div
                        className={`transition-transform ${levelData.cn.rotate}`}
                      >
                        &rarr;
                      </div>
                      <Text size="2">
                        {section.children.length}{" "}
                        {section.children.length > 1
                          ? levelData.plural
                          : levelData.singular}
                      </Text>
                    </Flex>
                  </Flex>
                </summary>
                <Box my="2">
                  <Tree tree={section.children} level={level + 1} />
                </Box>
              </details>
            </Flex>
          ) : (
            <Flex direction="row" align="center" gap="2" my="1" mx="2">
              <Code variant="solid">{section.code}</Code>
              <Text size={{ initial: "1", sm: "2" }} className="line-clamp-1">
                <Link asChild>
                  <NextLink href={`./${section.code}`} prefetch={false}>
                    {section.description}
                  </NextLink>
                </Link>
              </Text>
            </Flex>
          )}
        </li>
      ))}
    </ul>
  );
}
