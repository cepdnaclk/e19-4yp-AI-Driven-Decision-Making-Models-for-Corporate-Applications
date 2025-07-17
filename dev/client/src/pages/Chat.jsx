import {
  Box,
  Heading,
  Input,
  Button,
  VStack,
  Text,
  HStack,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { MdArrowBack } from "react-icons/md";

function Chat() {
  const { agentId } = useParams();
  const toast = useToast();
  const navigate = useNavigate();

  const [agent, setAgent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const [showWhatsappButton, setShowWhatsappButton] = useState(false);

  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("role");

  // Fetch agent details and chat history
  useEffect(() => {
    if (!token || !agentId) {
      toast({
        title: "Unauthorized",
        description: "You must be logged in to chat.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      navigate("/"); // redirect to login
      return;
    }

    async function fetchData() {
      setInitialLoading(true);
      try {
        // Fetch agent
        const agentRes = await fetch(`http://localhost:8000/agents/${agentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!agentRes.ok) throw new Error("Unauthorized to access agent");

        const agentData = await agentRes.json();
        setAgent(agentData);

        // Fetch chat history
        const chatRes = await fetch(`http://localhost:8000/chat/${agentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const chatData = await chatRes.json();
        setMessages(chatData.chat_history || []);
      } catch (err) {
        toast({
          title: "Access denied",
          description: "You may not be authorized to view this chat.",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
        navigate("/home");
      } finally {
        setInitialLoading(false);
      }
    }

    fetchData();
  }, [agentId]);

  useEffect(() => {
    if (!messages || messages.length === 0) return;

    const lastMessage = messages[messages.length - 1];
    if (
      lastMessage.role === "assistant" &&
      lastMessage.content.includes("Sorry, I can't provide a valid answer for that question. Would you like to chat with a live agent?")
    ) {
      setShowWhatsappButton(true);
    } else {
      setShowWhatsappButton(false);
    }
  }, [messages]);

  // Scroll to latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`http://localhost:8000/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          agent_id: agentId,
          message: input,
          chat_history: messages,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages(data.chat_history || []);
      } else {
        throw new Error("Failed to chat");
      }
    } catch (err) {
      toast({
        title: "Chat failed",
        description: "Unable to send message.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Error: I couldn't process that. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // console.log("showWhatsappButton", showWhatsappButton);

  if (initialLoading) {
    return (
      <Box p={8} textAlign="center">
        <Spinner size="xl" />
        <Text mt={2}>Loading agent...</Text>
      </Box>
    );
  }

  return (
    <VStack minHeight="100vh" spacing={8} p={5} background="#3182ce">
      <Box w="80%" p={8}>
        <Button leftIcon={<MdArrowBack />} onClick={() => navigate("/dashboard")} mb={6}>
          Back to Dashboard
        </Button>

        <Box background="white" p="10" borderRadius="10">
          <Box color="white" background="#3182ce" p="15" borderTopRadius={15}>
            <Heading color="white" mb={2}>Chat with {agent.name}</Heading>
            <Text mb={2} color="white.300">
              {agent?.description}
            </Text>
          </Box>

          <Box background="#f8f9f9ff" p="15">
            <VStack
              spacing={4}
              align="stretch"
              maxH="60vh"
              overflowY="auto"
              mb={4}
            >
              {messages.length === 0 && (
                <Box p={3} bg="blue.100" borderRadius="md">
                  <Text>
                    👋 Hello! I'm {agent?.name || "your AI agent"}. How can I help you today?
                  </Text>
                </Box>
              )}
              {messages.map((msg, idx) => (
                <Box
                  key={idx}
                  p={3}
                  borderRadius="md"
                  bg={msg.role === "user" ? "gray.100" : "blue.100"}
                >
                  <Text whiteSpace="pre-line">
                    <strong>{msg.role === "user" ? "You" : agent?.name || "Agent"}:</strong>{"\n"}
                    {msg.content
                      .replace(/\*\*/g, "")        // Remove all ** 
                      .replace(/(\d+)\.\s*/g, "\n$1. ") // Add newline before numbered list items
                    }
                  </Text>
                </Box>
              ))}
              <div ref={messagesEndRef} />
            </VStack>
            {showWhatsappButton && (
              <Button
                as="a"                  // this whatsapp number should be changed to the relevant number
                href="https://wa.me/94771234567?text=Hi,%20I%20need%20some%20help%20regarding%20LEARN.%20Could%20you%20assist%20me%3F"
                target="_blank"
                rel="noopener noreferrer"
                colorScheme="whatsapp"
                leftIcon={<span>📞</span>}
                mt={1}
                size="md"
                color="black"
              >
                Contact Live Agent on WhatsApp
              </Button>
            )}
          </Box>

          <HStack>
            <Input
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !loading) sendMessage();
              }}
              isDisabled={loading}
            />
            <Button
              onClick={sendMessage}
              colorScheme="blue"
              isLoading={loading}
              isDisabled={!input.trim() || loading}
            >
              Send
            </Button>
          </HStack>
        </Box>
      </Box>
    </VStack>
  );
}

export default Chat;
