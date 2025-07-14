import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  Heading,
  Card,
  CardBody,
  CardHeader,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { createUserByAdmin } from "../services/auth";

export default function CreateUserForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await createUserByAdmin(username, password, role);
      toast({
        title: "User created",
        description: `${role} account successfully created.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setUsername("");
      setPassword("");
      setRole("employee");
      Navigate("/dashboard")
    } catch {
      toast({
        title: "Creation failed",
        description: "Unable to create user. Try again.",
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
      <Card w="100%" maxW="450px" boxShadow="lg" borderRadius="xl">
        <CardHeader textAlign="center">
          <Heading size="lg">Create User</Heading>
          <Text fontSize="sm" color="gray.500">
            Create new employees or customers accounts
          </Text>
        </CardHeader>

        <CardBody>
          <form onSubmit={handleCreate}>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel>Username</FormLabel>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Role</FormLabel>
                <Select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="employee">HR Staff</option>
                  <option value="customer">Others</option>
                </Select>
              </FormControl>

              <Button colorScheme="blue" type="submit" isLoading={isLoading}>
                Create User
              </Button>
            </VStack>
          </form>
        </CardBody>
      </Card>
    </Box>
  );
}
