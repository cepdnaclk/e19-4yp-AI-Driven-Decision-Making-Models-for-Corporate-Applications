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
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  Spacer,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { MdAttachFile, MdEditNote, MdArrowBack } from "react-icons/md";
import LetterForm from "../components/LetterForm";
import ClearChatButton from "../components/ClearChatButton";

function Chat() {
  const { agentId } = useParams();
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [agent, setAgent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const [isClearing, setIsClearing] = useState(false);

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
        const agentRes = await fetch(
          `http://localhost:8000/agents/${agentId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
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

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    await fetch(`http://localhost:8000/chat/${agentId}/upload`, {
      method: "POST",
      body: formData,
    });

    toast({ title: "Document uploaded!", status: "success" });
  };

  const handleLetterGenerated = (letterContent) => {
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: letterContent }
    ]);
  };

  const clearChat = async () => {
    setIsClearing(true);
    try {
      const response = await fetch(
        `http://localhost:8000/agents/${agentId}/clear-chat`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to clear chat");

      // Clear frontend chat state after backend clears chat history
      setMessages([]);
    } catch (err) {
      toast({
        title: "Failed to clear chat",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsClearing(false);
    }
  };

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
        <Box background="white" p="10" borderRadius="10">
          <Box color="white" background="#3182ce" p="15" borderTopRadius={15}>
            <HStack>
              <Box>
                <Heading color="white" mb={2}>
                  Chat with {agent.name}
                </Heading>
                <Text mb={2} color="white.300">
                  {agent?.description}
                </Text>
              </Box>
              <Spacer />
              <ClearChatButton onClear={clearChat} isLoading={isClearing} />
            </HStack>
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
                    👋 Hello! I'm {agent?.name || "your AI agent"}. How can I
                    help you today?
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
                  <Text>
                    <strong>
                      {msg.role === "user" ? "You" : agent?.name || "Agent"}:
                    </strong>{" "}
                    {msg.content}
                  </Text>
                </Box>
              ))}
              <div ref={messagesEndRef} />
            </VStack>
          </Box>

          <HStack spacing={2}>
            <IconButton
              icon={<MdAttachFile />}
              onClick={() => document.getElementById("fileInput").click()}
              aria-label="Attach file"
            />
            <input
              id="fileInput"
              type="file"
              accept="application/pdf"
              style={{ display: "none" }}
              onChange={handleFileUpload}
            />
            <IconButton
              icon={<MdEditNote />}
              onClick={onOpen}
              aria-label="Create letter"
              title="Create letter"
            />
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

      {/* Modal for letter form */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Letter</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <LetterForm
              onClose={onClose}
              onLetterGenerated={handleLetterGenerated}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  );
}

export default Chat;
