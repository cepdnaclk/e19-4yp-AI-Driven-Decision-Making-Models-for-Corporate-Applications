import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  HStack,
  useToast,
  SimpleGrid,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { MdVisibility, MdBuild, MdAdd } from "react-icons/md";
import AgentPreviewCard from "../components/AgentPreviewCard";

function Home() {
  const navigate = useNavigate();
  const toast = useToast();
  const [agents, setAgents] = useState([]);
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("access_token");

  const fetchAgents = () => {
    fetch("http://localhost:8000/agents", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("Unauthorized or server error");
        }
        const data = await res.json();
        setAgents(data.agents || []);
      })
      .catch((err) => {
        console.error(err);
        toast({
          title: "Failed to load agents.",
          description: "You may not be authorized or the server is down.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        if (err.message.includes("Unauthorized")) {
          localStorage.clear();
          navigate("/");
        }
      });
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  return (
    <VStack minHeight="100vh" spacing={8} p={10} background="#3182ce">
      <Flex w="80%" justify="space-between" align="flex-start" py="4" mt="5">
        <Box flex={1} textAlign="center" size="2xl" color="white">
          <Heading size="2xl" color="white">
            🤖 Agentic AI Platform
          </Heading>
          <Text fontSize="lg" mt="3">Build and deploy intelligent AI agents for your workflows</Text>
        </Box>
        <Button colorScheme="gray" onClick={handleLogout} mt="6">
          Logout
        </Button>
      </Flex>

      {role === "admin" && (
        <Box
          w="80%"
          textAlign="center"
          background="white"
          p="6"
          borderRadius="10"
        >
          <Heading size="lg" mb={4}>
            Get Started
          </Heading>
          <Text mb={6}>
            As an admin, you can build intelligent AI agents and manage your
            user base. Use the buttons below to begin.
          </Text>

          <HStack spacing={4} justify="center" flexWrap="wrap">
            <Button
              leftIcon={<MdBuild />}
              colorScheme="blue"
              size="lg"
              onClick={() => navigate("/create-agent")}
            >
              Build New Agent
            </Button>

            <Button
              leftIcon={<MdAdd />}
              colorScheme="blue"
              size="lg"
              onClick={() => navigate("/create-user")}
            >
              Create New User
            </Button>
          </HStack>
        </Box>
      )}

      <Box w="80%" background="white" p="10" borderRadius="10">
        <HStack mb={4} justifyContent="space-between">
          <Heading size="md">Your Agents</Heading>

          <Button
            leftIcon={<MdVisibility />}
            onClick={() => navigate("/dashboard")}
            colorScheme="blue"
            color="white"
          >
            View Dashboard
          </Button>
        </HStack>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} pb={4}>
          {agents.map((agent) => (
            <AgentPreviewCard key={agent.id} agent={agent} />
          ))}
        </SimpleGrid>
      </Box>
    </VStack>
  );
}

export default Home;
