import React from "react";
import axios from "axios";
import { useGlobalState } from "@/components/global-states";
import { useRouter } from "next/router";
import validator from "validator";
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
  FormErrorMessage,
  Input,
  Checkbox,
  Heading,
  InputGroup,
  InputLeftElement,
  useToast,
} from "@chakra-ui/react";
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import { AiOutlineMail, AiOutlineUser } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";

export default function signup() {
  const toast = useToast();
  const [isLoggedIn, setIsLoggedIn] = useGlobalState('isLoggedIn');
  const [user, setUser] = useGlobalState("user");
  const { isOpen, onToggle } = useDisclosure();
  const router = useRouter();
  const [data, setData] = React.useState({
    username: { value: "", error: "", isValid: true },
    email: { value: "", error: "", isValid: true },
    password: { value: "", error: "", isValid: true },
  });

  const handleChange = (e) => {
    setData(prev => {
      const updated = { ...prev };
      updated[e.target.name].value = e.target.value;
      return updated;
    });
  };

  const isValidData = () => {
    let isValid = true;
    setData(prev => {
      const updated = { ...prev };
      if (data.username.value.trim().length == 0) {
        updated.username.error = "User name required!";
        updated.username.isValid = false;
        isValid = false;
      } else {
        updated.username.error = "";
        updated.username.isValid = true;
      }

      if (data.email.value.trim().length == 0) {
        updated.email.error = "Email required!";
        updated.email.isValid = false;
        isValid = false;
      } else if (!validator.isEmail(data.email.value)) {
        updated.email.error = "Email invalid!";
        updated.email.isValid = false;
        isValid = false;
      } else {
        updated.email.error = "";
        updated.email.isValid = true;
      }

      if (data.password.value.trim().length == 0) {
        updated.password.error = "Password required!";
        updated.password.isValid = false;
        isValid = false;
      } else if (
        !validator.isStrongPassword(data.password.value, {
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
      ) {
        updated.password.error = "Weak password!";
        updated.password.isValid = false;
        isValid = false;
      } else {
        updated.password.error = "";
        updated.password.isValid = true;
      }
      return updated;
    });
    return isValid;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(isValidData()){
      let res;
      try {
        res = await axios.post("http://127.0.0.1:8000/users", {
          username: data.username.value,
          email: data.email.value,
          password: data.password.value,
        });
        router.push("/signin");
      } catch (err) {
        toast({
          description: err.response.data.detail,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-right"
        });
      }
    }
  };

  return (
    <>
      <Box>
        <Flex
          bg={useColorModeValue("white", "gray.800")}
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
              color={useColorModeValue("gray.800", "white")}
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
            direction={"row"}
            spacing={6}
          >
            <Button
              as={"a"}
              display={{ base: "none", md: "inline-flex" }}
              color={"white"}
              bg={"pink.400"}
              href={"#"}
              _hover={{
                bg: "pink.300",
              }}
              fontSize={"sm"}
              fontWeight={400}
              onClick={() => router.push("/signin")}
            >
              Sign In
            </Button>
            <Button
              as={"a"}
              fontSize={"sm"}
              fontWeight={600}
              href={"#"}
              variant={"link"}
              onClick={() => router.push("/signup")}
            >
              Sign Up
            </Button>
          </Stack>
        </Flex>

        <Collapse in={isOpen} animateOpacity>
          <MobileNav />
        </Collapse>
      </Box>

      <Flex
        minH={"100vh"}
        align={"center"}
        justify={"center"}
        bg={useColorModeValue("gray.50", "gray.800")}
      >
        <Stack spacing={8} mx={"auto"} minW={"lg"} py={12} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"}>Sign up</Heading>
            <Text fontSize={"lg"} color={"gray.600"}>
              to enjoy all of our cool <Link color={"pink.400"}>features</Link>{" "}
              ✌️
            </Text>
          </Stack>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
          >
            <Stack spacing={4}>
              <FormControl id="name" isInvalid={!data.username.isValid}>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<Icon as={AiOutlineUser} color="gray.600" />}
                  />
                  <Input
                    focusBorderColor="pink.400"
                    type="text"
                    placeholder="User name"
                    name="username"
                    value={data.username.value}
                    onChange={handleChange}
                  />
                </InputGroup>
                <FormErrorMessage>{data.username.error}</FormErrorMessage>
              </FormControl>
              <FormControl id="email" isInvalid={!data.email.isValid}>
                {/* <FormLabel>Email address</FormLabel>
                <Input type="email" /> */}
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<Icon as={AiOutlineMail} color="gray.600" />}
                  />
                  <Input
                    focusBorderColor="pink.400"
                    type="email"
                    placeholder="Email address"
                    name="email"
                    value={data.email.value}
                    onChange={handleChange}
                  />
                </InputGroup>
                <FormErrorMessage>{data.email.error}</FormErrorMessage>
              </FormControl>
              <FormControl id="password" isInvalid={!data.password.isValid}>
                {/* <FormLabel>Password</FormLabel>
                <Input type="password" /> */}
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<Icon as={RiLockPasswordLine} color="gray.600" />}
                  />
                  <Input
                    focusBorderColor="pink.400"
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={data.password.value}
                    onChange={handleChange}
                  />
                </InputGroup>
                <FormErrorMessage>{data.password.error}</FormErrorMessage>
              </FormControl>
              <Stack spacing={10}>
                <Button
                  bg={"pink.400"}
                  color={"white"}
                  _hover={{
                    bg: "pink.500",
                  }}
                  onClick={handleSubmit}
                >
                  Sign up
                </Button>
              </Stack>
              <Link
                onClick={() => router.push("/signin")}
                align="center"
                color={"pink.400"}
              >
                Already have an account? Sign In
              </Link>
            </Stack>
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
