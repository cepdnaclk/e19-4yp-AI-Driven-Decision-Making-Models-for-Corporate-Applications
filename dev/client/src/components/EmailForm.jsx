import {
  Box, Button, FormControl, FormLabel, Input, Textarea, VStack, useToast
} from "@chakra-ui/react";
import { useState, useEffect } from "react";

export default function EmailForm() {
  const toast = useToast();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    fetch("http://localhost:8000/profile", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setFrom(data.email || "");
      });
  }, []);

  const handleSend = async () => {
    const token = localStorage.getItem("access_token");

    const res = await fetch("http://localhost:8000/chat/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ to, subject, body })
    });

    if (res.ok) {
      toast({ title: "Success", description: "Email sent!", status: "success" });
      setTo(""); setSubject(""); setBody("");
    } else {
      toast({ title: "Error", description: "Failed to send email.", status: "error" });
    }
  };

  return (
    <Box maxW="600px" mx="auto" mt={6}>
      <VStack spacing={4} align="stretch">
        <FormControl>
          <FormLabel>From</FormLabel>
          <Input value={from} isReadOnly />
        </FormControl>
        <FormControl>
          <FormLabel>To</FormLabel>
          <Input value={to} onChange={(e) => setTo(e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>Subject</FormLabel>
          <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>Body</FormLabel>
          <Textarea value={body} onChange={(e) => setBody(e.target.value)} />
        </FormControl>
        <Button colorScheme="blue" onClick={handleSend}>
          Send Email
        </Button>
      </VStack>
    </Box>
  );
}
