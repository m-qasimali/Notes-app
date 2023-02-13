import React from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useGlobalState } from "@/components/global-states";
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
  Input,
  Checkbox,
  Heading,
  InputGroup,
  InputLeftElement,
  useToast,
  FormErrorMessage,
} from "@chakra-ui/react";
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import { AiOutlineMail } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";

export default function signin() {
  const toast = useToast();
  const [isLoggedIn, setIsLoggedIn] = useGlobalState("isLoggedIn");
  const [user, setUser] = useGlobalState("user");
  const { isOpen, onToggle } = useDisclosure();
  const router = useRouter();
  const [data, setData] = React.useState({
    email: { value: "", error: "", isValid: true },
    password: { value: "", error: "", isValid: true },
  });

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: {
        value: e.target.value,
        error: "",
        isValid: true,
      },
    });
  };

  const isValidData = () => {
    let isValid = true;
    setData((prev) => {
      const updated = { ...prev };

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
      } else {
        updated.password.error = "";
        updated.password.isValid = true;
      }
      return updated;
    });
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isValidData()) {
      let res;
      try {
        res = await axios.get(`http://127.0.0.1:8000/users/${data.email.value}`);
        if (res.status === 200) {
          if (res.data.password === data.password.value) {
            setUser(res.data);
            setIsLoggedIn(true);
            router.push("/");
          }
          else{
            toast({
              description: "Invalid password",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom-right",
            });
          }
        }
      } catch (err) {
        toast({
          description: err.response.data.detail,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-right",
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
              fontSize={"sm"}
              fontWeight={400}
              variant={"link"}
              href={"#"}
              onClick={() => router.push("/signin")}
            >
              Sign In
            </Button>
            <Button
              as={"a"}
              display={{ base: "none", md: "inline-flex" }}
              fontSize={"sm"}
              fontWeight={600}
              color={"white"}
              bg={"pink.400"}
              href={"#"}
              _hover={{
                bg: "pink.300",
              }}
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
            <Heading fontSize={"4xl"}>Sign in to your account</Heading>
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
              <FormControl id="email" isInvalid={!data.email.isValid}>
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
                <Stack
                  direction={{ base: "column", sm: "row" }}
                  align={"start"}
                  justify={"space-between"}
                >
                  <Checkbox colorScheme="pink" defaultChecked>
                    Remember me
                  </Checkbox>
                  <Link color={"pink.400"}>Forgot password?</Link>
                </Stack>
                <Button
                  bg={"pink.400"}
                  color={"white"}
                  _hover={{
                    bg: "pink.500",
                  }}
                  onClick={handleSubmit}
                >
                  Sign in
                </Button>
              </Stack>
              <Link
                onClick={() => router.push("/signup")}
                align="center"
                color={"pink.400"}
              >
                Don't have an account? Sign Up
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
