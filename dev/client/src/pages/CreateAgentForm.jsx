import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  Heading,
  Text,
  Checkbox,
  SimpleGrid,
  useToast,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";

function CreateAgentForm() {
  const [tools, setTools] = useState([]);
  const [selectedTools, setSelectedTools] = useState([]);
  const [files, setFiles] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (role !== "admin") {
      toast({
        title: "Access Denied",
        description: "Only admins can create agents.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      navigate("/home");
      return;
    }

    // Fetch available tools
    fetch("http://localhost:8000/tools", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setTools(data.tools))
      .catch(() => setTools([]));

    // Fetch users for assignment
    fetch("http://localhost:8000/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setUsers(data.users))
      .catch(() => setUsers([]));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const form = e.target;
    const formData = new FormData();

    formData.append("name", form.name.value);
    formData.append("description", form.description.value);
    formData.append("tools", JSON.stringify(selectedTools));
    formData.append("assigned_user_ids", JSON.stringify(selectedUserIds));
    for (let i = 0; i < files?.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      const res = await fetch("http://localhost:8000/agents", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        toast({
          title: "Agent created",
          description: "Agent created and assigned successfully.",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
        navigate("/dashboard");
      } else {
        toast({
          title: "Agent creation failed",
          description: "You may not have permission or some data is invalid.",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Agent creation failed:", error);
      toast({
        title: "Agent creation error",
        description: "An unexpected error occurred.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <VStack minHeight="100vh" spacing={8} p={5} background="#3182ce">
      <Box w="60%" p={8}>
        <Button
          leftIcon={<MdArrowBack />}
          onClick={() => navigate("/home")}
          mb={4}
        >
          Back to Home
        </Button>

        <Box textAlign="center" color="white" mb="10">
          <Heading size="2xl" mb={3}>
            Create Your AI Agent
          </Heading>
          <Text fontSize={20} mb={5}>
            Configure your intelligent assistant
          </Text>
        </Box>

        <Box color="black" background="white" p="10" borderRadius="10">
          <form onSubmit={handleSubmit}>
            <VStack spacing={8} align="stretch">
              <FormControl isRequired>
                <FormLabel>Agent Name</FormLabel>
                <Input
                  name="name"
                  placeholder="e.g. Customer Support Assistant"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Agent Description</FormLabel>
                <Textarea
                  name="description"
                  placeholder="What should the agent do?"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Knowledge Documents (PDFs)</FormLabel>
                <Box
                  background="gray.100"
                  p={4}
                  borderRadius="md"
                  border="1px solid #CBD5E0"
                >
                  <Input
                    type="file"
                    multiple
                    accept=".pdf"
                    onChange={(e) => setFiles(e.target.files)}
                    variant="unstyled"
                  />
                  <Text fontSize="sm" color="gray.600">
                    Upload PDF files to create a knowledge base for your agent
                    (optional)
                  </Text>
                </Box>
              </FormControl>

              <FormControl>
                <FormLabel>Available Tools</FormLabel>
                <SimpleGrid
                  background="#edf2f7"
                  columns={[1, 3]}
                  spacing={2}
                  p={3}
                >
                  {tools.length === 0 ? (
                    <Text color="red.500">
                      No tools available or failed to load.
                    </Text>
                  ) : (
                    tools.map((tool) => (
                      <Checkbox
                        key={tool}
                        value={tool}
                        sx={{
                          ".chakra-checkbox__control": {
                            borderColor: "blue.500",
                            borderWidth: "1px",
                            borderRadius: "md",
                            _checked: {
                              bg: "blue.500",
                              borderColor: "blue.600",
                            },
                            _hover: {
                              borderColor: "blue.400",
                            },
                          },
                        }}
                        onChange={(e) => {
                          const value = e.target.value;
                          setSelectedTools((prev) =>
                            e.target.checked
                              ? [...prev, value]
                              : prev.filter((t) => t !== value)
                          );
                        }}
                      >
                        {tool.replace(/_/g, " ").toUpperCase()}
                      </Checkbox>
                    ))
                  )}
                </SimpleGrid>
              </FormControl>

              {/* New User Assignment Section */}
              <FormControl>
                <FormLabel>Assign Agent to Users</FormLabel>
                <SimpleGrid
                  background="#edf2f7"
                  columns={[1, 3]}
                  spacing={2}
                  maxHeight="150px"
                  overflowY="auto"
                  p={3}
                  borderRadius="md"
                >
                  {users
                    .filter(
                      (user) =>
                        user.role === "employee" || user.role === "customer"
                    )
                    .map((user) => (
                      <Checkbox
                        key={user.id}
                        value={user.id}
                        sx={{
                          ".chakra-checkbox__control": {
                            borderColor: "blue.500",
                            borderWidth: "1px",
                            borderRadius: "md",
                            _checked: {
                              bg: "blue.500",
                              borderColor: "blue.600",
                            },
                            _hover: {
                              borderColor: "blue.400",
                            },
                          },
                        }}
                        onChange={(e) => {
                          const value = e.target.value;
                          setSelectedUserIds((prev) =>
                            e.target.checked
                              ? [...prev, value]
                              : prev.filter((id) => id !== value)
                          );
                        }}
                      >
                        {user.name} ({user.role})
                      </Checkbox>
                    ))}
                </SimpleGrid>
              </FormControl>

              <Button colorScheme="blue" type="submit" isLoading={isLoading}>
                Create Agent
              </Button>
            </VStack>
          </form>
        </Box>
      </Box>
    </VStack>
  );
}

export default CreateAgentForm;
