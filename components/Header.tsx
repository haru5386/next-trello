import { Button, Icon, HStack } from "@chakra-ui/react";
import { HiSupport } from "react-icons/hi";
import Link from "next/link";
import AddBoardModal from "@/components/modal/addBoardModal";

export default function Header() {
  return (
    <header className="h-14 flex justify-between items-center bg-teal-600 p-4">
      <div>
      <Link href='/' passHref>
      <Icon fontSize="40px" color="white">
          <HiSupport />
        </Icon>
      </Link>

      </div>
      <AddBoardModal />

      {/* <div>
        <HStack>
          <Button colorPalette="teal" variant="solid">
            登入
          </Button>
          <Button bg="white" color="teal" 
          borderColor="none"
          _hover={{
          bg: "teal.100",
        }}  variant="surface">
            註冊
          </Button>
        </HStack>
      </div> */}
    </header>
  );
}
