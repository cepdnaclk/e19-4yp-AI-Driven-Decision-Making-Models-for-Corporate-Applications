import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  useToast,
  Card,
  CardBody,
  CardHeader,
  Text,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { useState } from "react";
import { registerCustomer } from "../services/auth";
import { useNavigate, Link as RouterLink } from "react-router-dom";

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    setEmailError("");

    setIsLoading(true);
    try {
      await registerCustomer(username, password, email);
      toast({
        title: "Registration Successful",
        description: "You can now log in.",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
      navigate("/login");
    } catch {
      toast({
        title: "Registration Failed",
        description: "Username may already exist or server error.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="gray.100"
      p={4}
    >
      <Card w="100%" maxW="400px" boxShadow="lg" borderRadius="xl">
        <CardHeader textAlign="center">
          <Heading size="lg">Register</Heading>
          <Text fontSize="sm" color="gray.500">
            Create a customer account
          </Text>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleRegister}>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel>Username</FormLabel>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter a username"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                />
              </FormControl>

              <FormControl isRequired isInvalid={emailError !== ""}>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
                {emailError && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {emailError}
                  </Text>
                )}
              </FormControl>

              <Button colorScheme="blue" type="submit" isLoading={isLoading}>
                Register
              </Button>
            </VStack>
          </form>

          <Text mt={4} fontSize="sm" textAlign="center">
            Already have an account?{" "}
            <ChakraLink
              as={RouterLink}
              to="/login"
              color="blue.500"
              fontWeight="medium"
            >
              Login
            </ChakraLink>
          </Text>
        </CardBody>
      </Card>
    </Box>
  );
}
