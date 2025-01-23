'use client'
import { Button, Input, Stack, Box, VStack } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { redirect } from "next/navigation";
import { FormEvent } from "react";

export default function Login() {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log("handleSubmit");
    redirect('/')
  };
  return (
    <form
      className="min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]"
      onSubmit={handleSubmit}
    >
      <VStack>
      <Stack gap="8" w="50%" >
      <Stack gap="8">
        <Field label="Email" required invalid errorText="This is an error text">
          <Input placeholder="me@example.com" />
        </Field>
      </Stack>
      <Stack gap="8">
        <Field label="Password" required invalid errorText="This is an error text">
          <Input type="password" placeholder="password" />
        </Field>
      </Stack>
      <Box h="30px" bg="pink.100">
      <Button type="submit" alignSelf="flex-start" colorPalette="teal" width="100%"> login </Button>
      </Box>
      </Stack>
      </VStack>
      
    </form>
  );
}
