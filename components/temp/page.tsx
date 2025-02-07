import Image from "next/image";
import { Button, For, Card, Icon, Text, Flex } from "@chakra-ui/react";
import { Avatar } from "@/components/ui/avatar";
import { HiPlus } from "react-icons/hi";
import { formatDate } from "@/util/format";
export default function Home() {

  return (
    <div className="min-h-screen pb-20 font-[family-name:var(--font-geist-sans)]">
      <main className="overflow-x-auto w-full whitespace-nowrap p-4">
        <For each={["subtle", "outline", "elevated"]}>
          {(variant) => (
            <Card.Root
              width="320px"
              variant="subtle"
              key={variant}
              className="inline-block mr-4"
            >
              <Card.Body gap="2">
                <Card.Root width="100%" variant="outline" key="1">
                  <Card.Body gap="1">
                    <Card.Title>Nue Camp</Card.Title>
                    <Flex justifyContent="space-between" alignItems="center">
                      <Text  textStyle="xs" color="gray.400">{formatDate()}</Text>
                      <Avatar
                        src="https://picsum.photos/200/300"
                        name="Nue Camp"
                        size="xs"
                      />
                    </Flex>
                  </Card.Body>
                </Card.Root>
              </Card.Body>
              <Card.Footer justifyContent="flex-start">
                <Button variant="plain" colorPalette="cyan">
                  <Icon fontSize="40px" color="teal">
                    <HiPlus />
                  </Icon>
                  Add a card
                </Button>
              </Card.Footer>
            </Card.Root>
          )}
        </For>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
