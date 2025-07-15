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
import { loginUser } from "../services/auth";
import { useNavigate, Link as RouterLink } from "react-router-dom";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await loginUser(username, password);
      toast({
        title: "Login successful",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/home");
    } catch (err) {
      toast({
        title: "Login failed",
        description: "Invalid username or password",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="gray.100" p={4}>
      <Card w="100%" maxW="400px" boxShadow="lg" borderRadius="xl">
        <CardHeader textAlign="center">
          <Heading size="lg">Login</Heading>
          <Text fontSize="sm" color="gray.500">
            Access your account
          </Text>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleLogin}>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel>Username</FormLabel>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
              </FormControl>

              <Button colorScheme="blue" type="submit" isLoading={isLoading}>
                Login
              </Button>
            </VStack>
          </form>

          <Text mt={4} fontSize="sm" textAlign="center">
            Don't have an account?{" "}
            <ChakraLink as={RouterLink} to="/" color="blue.500" fontWeight="medium">
              Register
            </ChakraLink>
          </Text>
        </CardBody>
      </Card>
    </Box>
  );
}
