import React from "react";
import { useRouter } from "next/router";
import { useGlobalState } from "@/components/global-states";
import axios from "axios";
import { Player } from "@lottiefiles/react-lottie-player";
import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Heading,
  InputGroup,
  InputLeftElement,
  MenuButton,
  InputRightElement,
  Avatar,
  Divider,
} from "@chakra-ui/react";
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import { RiPencilFill } from "react-icons/ri";
import { IoSendSharp } from "react-icons/io5";

export default function index() {
  const [isLoggedIn, setIsLoggedIn] = useGlobalState("isLoggedIn");
  const [user, setUser] = useGlobalState("user");

  const fetchNotes = async () => {
    try{
      const response = await axios.get(`http://127.0.0.1:8000/notes/${user.email}`);
      setNotes(response.data);
    }
    catch(err){
      console.log(err);
    }
  }

  React.useEffect(() => {
    if (!isLoggedIn) {
      router.push("/signin");
    }
    else{
      fetchNotes();
    }
  }, []);
  const { isOpen, onToggle } = useDisclosure();
  const router = useRouter();
  const [note, setNote] = React.useState();
  const [notes, setNotes] = React.useState([]);

  const handleChange = (e) => {
    setNote(e.target.value);
  };

  const getDate = () => {
    let today = new Date();
    let date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    let time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let dateTime = date + " " + time;
    return dateTime;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newNote = {
      content: note,
      date: getDate(),
      owner: user.email,
    };
    setNotes([newNote, ...notes]);
    try{
      const res = await axios.post(`http://127.0.0.1:8000/notes/`,newNote);
      if(res.status === 201){
        console.log("Note added successfully");
      }
    }
    catch(err){
      console.log(err);
    }
    setNote("");
  };

  const logoutHandler = () => {
    setUser(null);
    router.push("/signin");
  }


  if(!isLoggedIn) {
    return (
      <div style={{ width: "100vw", height:"100vh" }}>
        <Player
          style={{
            display: "flex",
            width: "500px",
            alignItems: "center",
            justifyContent: "center",
          }}
          src="./lottieFiles/loading.json"
          className="player"
          loop
          autoplay
          speed={2}
        />
      </div>
    );
  }


  return (
    <>
      <Box>
        <Flex
          bg={useColorModeValue("pink.400", "gray.800")}
          color={useColorModeValue("gray.600", "white")}
          minH={"60px"}
          py={{ base: 2 }}
          px={{ base: 4 }}
          borderBottom={1}
          borderStyle={"solid"}
          borderColor={useColorModeValue("gray.200", "gray.900")}
          align={"center"}
        >
          <Flex
            flex={{ base: 1, md: "auto" }}
            ml={{ base: -2 }}
            display={{ base: "flex", md: "none" }}
          >
            <IconButton
              onClick={onToggle}
              icon={
                isOpen ? (
                  <CloseIcon w={3} h={3} />
                ) : (
                  <HamburgerIcon w={5} h={5} />
                )
              }
              variant={"ghost"}
              aria-label={"Toggle Navigation"}
            />
          </Flex>
          <Flex flex={{ base: 1 }} justify={{ base: "center", md: "start" }}>
            <Text
              textAlign={useBreakpointValue({ base: "center", md: "left" })}
              fontFamily={"heading"}
              color={useColorModeValue("white")}
            >
              Note-App
            </Text>

            <Flex display={{ base: "none", md: "flex" }} ml={10}>
              <DesktopNav />
            </Flex>
          </Flex>

          <Stack
            flex={{ base: 1, md: 0 }}
            justify={"flex-end"}
            align={"center"}
            direction={"row"}
            spacing={6}
          >
            <Avatar
              size={"sm"}
              src={
                "https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9"
              }
            />
            <Button
              as={"a"}
              display={{ base: "none", md: "inline-flex" }}
              fontSize={"sm"}
              fontWeight={600}
              color={"white"}
              bg={"pink.400"}
              href={"#"}
              variant={"outline"}
              _hover={{
                bg: "white",
                color: "pink.400",
              }}
              onClick={logoutHandler}
            >
              Log out
            </Button>
          </Stack>
        </Flex>

        <Collapse in={isOpen} animateOpacity>
          <MobileNav />
        </Collapse>
      </Box>

      <Flex align={"center"} justify={"center"}>
        <Stack spacing={8} mx={"auto"} style={{ width: "45vw" }} py={5}>
          <InputGroup align={"center"} justify={"center"} size={"lg"}>
            <InputLeftElement
              pointerEvents="none"
              color="black"
              children={<Icon fontSize="1.5rem" as={RiPencilFill} />}
            />
            <Input
              fontSize="1.2rem"
              size={"lg"}
              focusBorderColor="pink.400"
              placeholder="Enter a new note"
              type="text"
              _placeholder={{ opacity: 0.5, color: "gray.500" }}
              borderColor="pink.400"
              _hover={{ borderColor: "pink.400" }}
              onChange={handleChange}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSubmit(e);
                }
              }}
              value={note}
              name="note"
            />
            <InputRightElement
              style={{ cursor: "pointer" }}
              pointer={"cursor"}
              onClick={handleSubmit}
              children={
                <Icon fontSize="1.5rem" as={IoSendSharp} color="pink.500" />
              }
            />
          </InputGroup>

          <Box p={4}>
            {notes.map((note, index) => {
              return (
                <Box
                  mb={4}
                  borderWidth="1px"
                  borderRadius="md"
                  overflow="hidden"
                >
                  <Box p={4}>
                    <Text fontSize="md" mb={2}>
                      Note {index + 1}
                    </Text>
                    <Divider mb={2} />
                    <Text fontSize="sm" color="gray.500" mb={2}>
                      Created on {note.date}
                    </Text>
                    <Text fontSize="sm">{note.content}</Text>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Stack>
      </Flex>
    </>
  );
}

const DesktopNav = () => {
  const linkColor = useColorModeValue("gray.600", "gray.200");
  const linkHoverColor = useColorModeValue("gray.800", "white");
  const popoverContentBgColor = useColorModeValue("white", "gray.800");

  return (
    <Stack direction={"row"} spacing={4}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={"hover"} placement={"bottom-start"}>
            <PopoverTrigger>
              <Link
                p={2}
                href={navItem.href ?? "#"}
                fontSize={"sm"}
                fontWeight={500}
                color={linkColor}
                _hover={{
                  textDecoration: "none",
                  color: linkHoverColor,
                }}
              >
                {navItem.label}
              </Link>
            </PopoverTrigger>

            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow={"xl"}
                bg={popoverContentBgColor}
                p={4}
                rounded={"xl"}
                minW={"sm"}
              >
                <Stack>
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};

const DesktopSubNav = ({ label, href, subLabel }) => {
  return (
    <Link
      href={href}
      role={"group"}
      display={"block"}
      p={2}
      rounded={"md"}
      _hover={{ bg: useColorModeValue("pink.50", "gray.900") }}
    >
      <Stack direction={"row"} align={"center"}>
        <Box>
          <Text
            transition={"all .3s ease"}
            _groupHover={{ color: "pink.400" }}
            fontWeight={500}
          >
            {label}
          </Text>
          <Text fontSize={"sm"}>{subLabel}</Text>
        </Box>
        <Flex
          transition={"all .3s ease"}
          transform={"translateX(-10px)"}
          opacity={0}
          _groupHover={{ opacity: "100%", transform: "translateX(0)" }}
          justify={"flex-end"}
          align={"center"}
          flex={1}
        >
          <Icon color={"pink.400"} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Link>
  );
};

const MobileNav = () => {
  return (
    <Stack
      bg={useColorModeValue("white", "gray.800")}
      p={4}
      display={{ md: "none" }}
    >
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href }) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={Link}
        href={href ?? "#"}
        justify={"space-between"}
        align={"center"}
        _hover={{
          textDecoration: "none",
        }}
      >
        <Text
          fontWeight={600}
          color={useColorModeValue("gray.600", "gray.200")}
        >
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={"all .25s ease-in-out"}
            transform={isOpen ? "rotate(180deg)" : ""}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: "0!important" }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={"solid"}
          borderColor={useColorModeValue("gray.200", "gray.700")}
          align={"start"}
        >
          {children &&
            children.map((child) => (
              <Link key={child.label} py={2} href={child.href}>
                {child.label}
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

const NAV_ITEMS = [];
