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
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";

function EditAgentForm() {
  const { agentId } = useParams();
  const [agentData, setAgentData] = useState(null);
  const [tools, setTools] = useState([]);
  const [selectedTools, setSelectedTools] = useState([]);
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
        title: "Access denied",
        description: "Only admins can edit agents.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      navigate("/home");
      return;
    }

    const fetchAgent = async () => {
      try {
        const agentRes = await fetch(
          `http://localhost:8000/agents/${agentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!agentRes.ok) throw new Error("Unauthorized");

        const agent = await agentRes.json();
        setAgentData(agent);
        setSelectedTools(agent.tools);
        setSelectedUserIds(agent.assigned_user_ids || []);
      } catch (err) {
        console.error("Failed to fetch agent:", err);
        toast({
          title: "Failed to fetch agent",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
        navigate("/dashboard");
      }
    };

    const fetchTools = async () => {
      try {
        const toolRes = await fetch("http://localhost:8000/tools", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const toolData = await toolRes.json();
        setTools(toolData.tools || []);
      } catch {
        toast({
          title: "Failed to load tools",
          status: "warning",
          duration: 4000,
          isClosable: true,
        });
      }
    };

    const fetchUsers = async () => {
      const userRes = await fetch("http://localhost:8000/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = await userRes.json();
      setUsers(userData.users || []);
    };

    fetchAgent();
    fetchTools();
    fetchUsers();
  }, [agentId]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const form = e.target;

    const updatedAgent = {
      name: form.name.value,
      description: form.description.value,
      tools: selectedTools,
      assigned_user_ids: selectedUserIds
    };

    try {
      const res = await fetch(`http://localhost:8000/agents/${agentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedAgent),
      });

      if (res.ok) {
        toast({
          title: "Agent updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        navigate("/dashboard");
      } else {
        toast({
          title: "Update failed",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      }
    } catch {
      toast({
        title: "Unexpected error occurred",
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
        <Box textAlign="center" color="white" mb="10">
          <Heading size="2xl" mb={3}>
            Edit Agent
          </Heading>
          <Text fontSize={20} mb={5}>
            Update your agent configuration
          </Text>
        </Box>

        <Box color="black" background="white" p="10" borderRadius="10">
          {!agentData ? (
            <Box textAlign="center">
              <Spinner size="xl" color="blue.500" />
            </Box>
          ) : (
            <form onSubmit={handleUpdate}>
              <VStack spacing={8} align="stretch">
                <FormControl isRequired>
                  <FormLabel>Agent Name</FormLabel>
                  <Input name="name" defaultValue={agentData.name} />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Agent Description</FormLabel>
                  <Textarea
                    name="description"
                    defaultValue={agentData.description}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Available Tools</FormLabel>
                  <SimpleGrid
                    background="#eef1f3ff"
                    columns={[1, 2]}
                    spacing={2}
                    p={3}
                  >
                    {tools.map((tool) => (
                      <Checkbox
                        key={tool}
                        value={tool}
                        isChecked={selectedTools.includes(tool)}
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
                    ))}
                  </SimpleGrid>
                </FormControl>

                <FormControl>
                  <FormLabel>Assign Users</FormLabel>
                  <SimpleGrid
                    columns={[1, 3]}
                    spacing={2}
                    p={2}
                    background="#edf2f7"
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
                        isChecked={selectedUserIds.includes(user.id)}
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
                  Update Agent
                </Button>
              </VStack>
            </form>
          )}
        </Box>
      </Box>
    </VStack>
  );
}

export default EditAgentForm;
