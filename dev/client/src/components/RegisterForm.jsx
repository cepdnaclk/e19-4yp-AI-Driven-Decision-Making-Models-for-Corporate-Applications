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
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await registerCustomer(username, password);
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

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="gray.100" p={4}>
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

              <Button colorScheme="blue" type="submit" isLoading={isLoading}>
                Register
              </Button>
            </VStack>
          </form>

          <Text mt={4} fontSize="sm" textAlign="center">
            Already have an account?{" "}
            <ChakraLink as={RouterLink} to="/login" color="blue.500" fontWeight="medium">
              Login
            </ChakraLink>
          </Text>
        </CardBody>
      </Card>
    </Box>
  );
}
