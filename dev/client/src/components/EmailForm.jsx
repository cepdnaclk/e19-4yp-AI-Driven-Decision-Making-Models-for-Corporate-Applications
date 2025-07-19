import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";

const EmailForm = ({ isOpen, onClose, token, setMessages }) => {
  const toast = useToast();
  const [emailTo, setEmailTo] = useState("");
  const [emailFrom, setEmailFrom] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const res = await fetch("http://localhost:8000/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setEmailFrom(data.email);
        }
      } catch (err) {
        console.error("Failed to fetch user email");
      }
    };

    if (isOpen) fetchEmail();
  }, [isOpen]);

  const handleSendEmail = async () => {
    if (!emailTo || !emailSubject || !emailBody) {
      toast({
        title: "Missing fields",
        description: "All fields are required.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("to", emailTo);
    formData.append("subject", emailSubject);
    formData.append("body", emailBody);
    for (let i = 0; i < attachments.length; i++) {
      formData.append("files", attachments[i]);
    }

    try {
      const res = await fetch("http://localhost:8000/send-email", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `📧 Email sent successfully!`,
          },
        ]);
        toast({ title: "Email Sent", status: "success" });
        setEmailTo("");
        setEmailSubject("");
        setEmailBody("");
        setAttachments([]);
        onClose();
      } else {
        const errData = await res.json();
        toast({
          title: "Email Failed",
          description: errData.detail,
          status: "error",
        });
      }
    } catch (err) {
      toast({
        title: "Request failed",
        description: err.message,
        status: "error",
      });
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Send Email</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={4}>
          <FormControl>
            <FormLabel>To</FormLabel>
            <Input
              value={emailTo}
              onChange={(e) => setEmailTo(e.target.value)}
            />
          </FormControl>

          <FormControl mt={3}>
            <FormLabel>From</FormLabel>
            <Input value={emailFrom} isReadOnly />
          </FormControl>

          <FormControl mt={3}>
            <FormLabel>Subject</FormLabel>
            <Input
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              placeholder="Subject"
            />
          </FormControl>

          <FormControl mt={3}>
            <FormLabel>Body</FormLabel>
            <Textarea
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
            />
          </FormControl>

          <FormControl mt={3}>
            <FormLabel>Attachments</FormLabel>
            <Input
              type="file"
              multiple
              onChange={(e) => setAttachments([...e.target.files])}
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSendEmail} isLoading={isLoading}>
            Send
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EmailForm;
