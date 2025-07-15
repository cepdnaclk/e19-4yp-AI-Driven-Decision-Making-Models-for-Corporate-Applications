import {
  Box,
  Heading,
  VStack,
  Text,
  SimpleGrid,
  Button,
  useToast,
  HStack,
} from "@chakra-ui/react";
import Swal from "sweetalert2";
import { MdAdd, MdArrowBack } from "react-icons/md";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AgentCard from "../components/AgentCard";

function Dashboard() {
  const [agents, setAgents] = useState([]);
  const navigate = useNavigate();
  const toast = useToast();

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("access_token");

  const fetchAgents = () => {
    fetch("http://localhost:8000/agents", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Unauthorized");
        const data = await res.json();
        setAgents(data.agents || []);
      })
      .catch(() => {
        toast({
          title: "Failed to load agents.",
          description: "You may not be authorized or the server is down.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        localStorage.clear();
        navigate("/");
      });
  };

  const handleDelete = (agentId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:8000/agents/${agentId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => {
            if (!res.ok) throw new Error("Delete failed");

            Swal.fire({
              title: "Deleted!",
              text: "Your agent has been deleted.",
              icon: "success",
            });

            toast({
              title: "Agent deleted.",
              status: "success",
              duration: 3000,
              isClosable: true,
            });

            fetchAgents();
          })
          .catch(() => {
            toast({
              title: "Error deleting agent.",
              description: "You may not have permission.",
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          });
      }
    });
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  return (
    <VStack minHeight="100vh" spacing={8} p={5} background="#3182ce">
      <Box w="80%" p={8}>
        <Button
          leftIcon={<MdArrowBack />}
          onClick={() => navigate("/home")}
          mb={4}
        >
          Back to Home
        </Button>

        <Box textAlign="center" color="white" mb="10">
          <Heading size="2xl" mb={3}>
            Agents Dashboard
          </Heading>
          <Text fontSize={20} mb={5}>
            Manage and interact with your AI agents
          </Text>
        </Box>

        <Box color="black" background="white" p="10" borderRadius="10">
          <HStack justifyContent="space-between" mb="5">
            <Heading fontSize={25}>Your Agents</Heading>
            {role === "admin" && (
              <HStack spacing={4} mb={4}>
                <Button
                  leftIcon={<MdAdd />}
                  onClick={() => navigate("/create-user")}
                  colorScheme="green"
                >
                  Create New User
                </Button>

                <Button
                  leftIcon={<MdAdd />}
                  onClick={() => navigate("/create-agent")}
                  colorScheme="green"
                >
                  Create New Agent
                </Button>
              </HStack>
            )}
          </HStack>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            {agents.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                onDelete={role === "admin" ? handleDelete : null}
              />
            ))}
          </SimpleGrid>
        </Box>
      </Box>
    </VStack>
  );
}

export default Dashboard;
