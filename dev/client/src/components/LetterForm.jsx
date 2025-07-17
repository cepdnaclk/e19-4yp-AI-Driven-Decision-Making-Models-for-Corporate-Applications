import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";

const templateFields = {
  leave: [
    { name: "managerName", label: "Manager's Name" },
    { name: "leaveType", label: "Leave Type" },
    { name: "numberOfDays", label: "No. of Days" },
    { name: "startDate", label: "Start Date" },
    { name: "endDate", label: "End Date" },
    { name: "reason", label: "Reason", textarea: true },
    { name: "employeeName", label: "Employee Name" },
  ],
  offer: [
    { name: "candidateName", label: "Candidate's Name" },
    { name: "jobRole", label: "Job Role" },
    { name: "startDate", label: "Start Date" },
    { name: "department", label: "Department" },
    { name: "salary", label: "Salary" },
  ],
  rejection: [
    { name: "candidateName", label: "Candidate's Name" },
    { name: "jobRole", label: "Job Role" },
    { name: "rejectionReason", label: "Rejection Reason", textarea: true },
  ],
};

function LetterForm({ onClose, onLetterGenerated, userRole }) {
  const toast = useToast();
  const [templateType, setTemplateType] = useState("leave");
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("access_token");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/letters/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          template_type: templateType,
          fields: formData,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        onLetterGenerated(data.content);
        toast({ title: "Letter Generated", status: "success" });
        onClose(); // close the form
      } else {
        toast({ title: "Error", description: data.detail, status: "error" });
      }
    } catch (err) {
      toast({ title: "Error", description: err.message, status: "error" });
    } finally {
      setLoading(false);
    }
  };

  const fields = templateFields[templateType] || [];

  return (
    <Box
      p={5}
      bg="white"
      borderRadius="md"
      shadow="md"
      maxH="75vh"
      overflowY="auto"
      w="100%"
    >
      <VStack spacing={2} align="stretch">
        <FormControl>
          <FormLabel>Template Type</FormLabel>
          <Select
            value={templateType}
            onChange={(e) => {
              setTemplateType(e.target.value);
              setFormData({});
            }}
          >
            <option value="leave">Leave Application</option>

            {userRole !== "customer" && (
              <>
                <option value="offer">Offer Letter</option>
                <option value="rejection">Rejection Letter</option>
              </>
            )}
          </Select>
        </FormControl>

        {fields.map((field) => (
          <FormControl key={field.name} isRequired={!field.optional}>
            <FormLabel>{field.label}</FormLabel>
            {field.textarea ? (
              <Textarea
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleChange}
              />
            ) : (
              <Input
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleChange}
              />
            )}
          </FormControl>
        ))}

        <Button colorScheme="blue" onClick={handleSubmit} isLoading={loading}>
          Generate Letter
        </Button>
      </VStack>
    </Box>
  );
}

export default LetterForm;
