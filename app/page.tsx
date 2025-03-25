import { ciiuService } from "@/app/ciiu/service";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Card, Code, Container, Flex, Heading } from "@radix-ui/themes";

export default async function Page() {
  const allCodes = await ciiuService.getClasses();
  const sortedCodes = allCodes.toSorted((a, b) =>
    a.class.localeCompare(b.class)
  );
  return (
    <Container size="2">
      <Flex direction="column" gap="4" asChild>
        <ul>
          {sortedCodes.map((code) => (
            <li key={code.id}>
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
                        {code.class}
                      </Code>
                      <Heading
                        as="h2"
                        size={{ initial: "3", sm: "4" }}
                        weight="regular"
                      >
                        <Link href={`/${code.class}`} prefetch={false}>
                          {code.name}
                        </Link>
                      </Heading>
                    </header>
                  </Flex>
                  <Flex direction="row" gap="0" align="center">
                    <Code
                      size="1"
                      variant="soft"
                      className="uppercase"
                      color="gray"
                    >
                      Sección {code.section}
                    </Code>
                    <ChevronRightIcon color="gray" />
                    <Code
                      size="1"
                      variant="soft"
                      className="uppercase"
                      color="gray"
                    >
                      División {code.division}
                    </Code>
                    <ChevronRightIcon color="gray" />
                    <Code
                      size="1"
                      variant="soft"
                      className="uppercase"
                      color="gray"
                    >
                      Grupo {code.group}
                    </Code>
                  </Flex>
                </Flex>
              </Card>
            </li>
          ))}
        </ul>
      </Flex>
    </Container>
  );
}
