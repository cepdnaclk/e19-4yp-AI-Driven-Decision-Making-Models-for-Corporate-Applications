import { VStack, Heading, Text, Tag, HStack, Badge } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

function AgentPreviewCard({ agent }) {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");  // get role from localStorage

  return (
    <VStack
      p={4}
      borderWidth={1}
      borderRadius="md"
      align="start"
      boxShadow="sm"
      spacing={2}
      _hover={{
        boxShadow: 'lg',
        transform: 'translateY(-2px)',
      }}
      cursor="pointer"
      onClick={() => navigate(`/chat/${agent.id}`)}
    >
      <Heading size="md">{agent.name}</Heading>

      <Text fontSize="md">{agent.description}</Text>

      {role === "admin" && agent.assigned_users?.length > 0 && (
        <HStack flexWrap="wrap">
          <p>Users:</p>
          {agent.assigned_users.map((user) => (
            <Badge key={user.id} colorScheme="green">
              {user.name}
            </Badge>
          ))}
        </HStack>
      )}

      {agent.tools?.length > 0 && (
        <HStack flexWrap="wrap">
          <p>Tools:</p>
          {agent.tools.map((tool, index) => (
            <Tag key={index} colorScheme="blue" size="sm">
              {tool}
            </Tag>
          ))}
        </HStack>
      )}
    </VStack>
  );
}

export default AgentPreviewCard;
