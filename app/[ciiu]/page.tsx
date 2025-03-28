import { ciiuService } from "@/app/ciiu/service";
import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import {
  Box,
  Callout,
  Code,
  Container,
  DataList,
  Flex,
  Grid,
  Heading,
  Section,
  Separator,
} from "@radix-ui/themes";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ ciiu: string }>;
}) {
  const { ciiu } = await params;
  const data = await ciiuService.getClass(ciiu);
  if (!data) {
    notFound();
  }
  const [section, division, group] = await Promise.all([
    ciiuService.getSection(data.section),
    ciiuService.getDivision(data.division),
    ciiuService.getGroup(data.group),
  ]);
  return (
    <Container>
      <Section>
        <header>
          <Heading>
            <Flex direction="row" gap="2" align="center">
              <Code variant="solid">{data.class}</Code>
              {data.name}
            </Flex>
          </Heading>
        </header>
        <Separator size="4" my="4" />
        <DataList.Root>
          <DataList.Item>
            <DataList.Label>Clase</DataList.Label>
            <DataList.Value>
              <Code>{data.class}</Code>
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label>Actividad Económica</DataList.Label>
            <DataList.Value>{data.name}</DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label>Palabras Clave</DataList.Label>
            <DataList.Value>{data.keyWords.join(", ")}</DataList.Value>
          </DataList.Item>
        </DataList.Root>
      </Section>
      <main>
        <Grid columns={{ initial: "1", sm: "2" }} gap="4">
          <Box>
            <Heading as="h2" size="4" mb="2" color="green">
              <Flex align="center" gap="2">
                <CheckCircledIcon />
                Incluye
              </Flex>
            </Heading>
            <Callout.Root color="green">
              <Callout.Text>{data.includes}</Callout.Text>
            </Callout.Root>
          </Box>
          <Box>
            <Heading as="h2" size="4" mb="2" color="red">
              <Flex align="center" gap="2">
                <CrossCircledIcon />
                No incluye
              </Flex>
            </Heading>
            <Callout.Root color="red">
              <Callout.Text>{data.excludes}</Callout.Text>
            </Callout.Root>
          </Box>
        </Grid>
        {section && (
          <PageSection
            title={`Sección ${section.section}`}
            description={section.name}
            includes={section.includes}
            excludes={section.excludes}
          />
        )}
        {division && (
          <PageSection
            title={`División ${division.division}`}
            description={division.name}
            includes={division.includes}
            excludes={division.excludes}
          />
        )}
        {group && (
          <PageSection
            title={`Grupo ${group.group}`}
            description={group.name}
            includes={group.includes}
            excludes={group.excludes}
          />
        )}
      </main>
    </Container>
  );
}

function PageSection({
  title,
  description,
  excludes,
  includes,
}: {
  title: string;
  description: string;
  excludes: string;
  includes: string;
}) {
  return (
    <article>
      <header>
        <Heading as="h3">{title}</Heading>
        <Heading as="h4" size="2">
          {description}
        </Heading>
      </header>
      <main>
        <Grid columns={{ initial: "1", sm: "2" }} gap="4">
          {includes && (
            <Callout.Root color="green">
              <Callout.Icon>
                <CheckCircledIcon />
              </Callout.Icon>
              <Callout.Text>{includes}</Callout.Text>
            </Callout.Root>
          )}
          {excludes && (
            <Callout.Root color="red">
              <Callout.Icon>
                <CrossCircledIcon />
              </Callout.Icon>
              <Callout.Text>{excludes}</Callout.Text>
            </Callout.Root>
          )}
        </Grid>
      </main>
    </article>
  );
}
