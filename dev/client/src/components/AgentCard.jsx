import {
  VStack,
  Heading,
  Text,
  Button,
  HStack,
  Tag,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { MdChat, MdEdit, MdDelete } from "react-icons/md";

function AgentCard({ agent, onDelete }) {
  const navigate = useNavigate();
  const createdAt = new Date(agent.created_at).toLocaleDateString();

  const role = localStorage.getItem("role"); // fetch role from login

  return (
    <VStack
      p={4}
      borderWidth={1}
      borderRadius="md"
      align="start"
      boxShadow="md"
      spacing={3}
      width={375}
      height="100%"
      background="white"
      color="black"
      _hover={{
        boxShadow: "lg",
        transform: "translateY(-2px)",
      }}
    >
      <Heading size="md">{agent.name}</Heading>

      <Text fontSize={18} mb={2}>
        {agent.description}
      </Text>

      {agent.tools?.length > 0 && (
        <HStack mb={2} flexWrap="wrap">
          {agent.tools.map((tool, index) => (
            <Tag key={index} colorScheme="blue" size="sm">
              {tool}
            </Tag>
          ))}
        </HStack>
      )}

      <HStack spacing={3}>
        <Button
          leftIcon={<MdChat />}
          colorScheme="blue"
          onClick={() => navigate(`/chat/${agent.id}`)}
        >
          Chat
        </Button>

        {role === "admin" && (
          <>
            <Button
              leftIcon={<MdEdit />}
              colorScheme="gray"
              onClick={() => navigate(`/update/${agent.id}`)}
            >
              Edit
            </Button>

            <Button
              leftIcon={<MdDelete />}
              colorScheme="red"
              onClick={() => onDelete(agent.id)}
            >
              Delete
            </Button>
          </>
        )}
      </HStack>

      <Text fontSize="xs" color="gray.500">
        Created At: {createdAt}
      </Text>
    </VStack>
  );
}

export default AgentCard;
