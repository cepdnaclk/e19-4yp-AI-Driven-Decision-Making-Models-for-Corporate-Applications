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
  offer: [
    { name: "candidateName", label: "Candidate's Name" },
    { name: "jobRole", label: "Job Role" },
    { name: "startDate", label: "Start Date" },
    { name: "department", label: "Department" },
    { name: "salary", label: "Salary" },
    { name: "notes", label: "Additional Notes", textarea: true, optional: true },
  ],
  rejection: [
    { name: "candidateName", label: "Candidate's Name" },
    { name: "jobRole", label: "Job Role" },
    { name: "rejectionReason", label: "Rejection Reason", textarea: true },
  ],
  // onboarding: [
  //   { name: "candidateName", label: "Candidate's Name" },
  //   { name: "startDate", label: "Start Date" },
  //   { name: "orientationTime", label: "Orientation Time" },
  //   { name: "location", label: "Location" },
  // ],
};

function LetterForm({ onClose, onLetterGenerated }) {
  const toast = useToast();
  const [templateType, setTemplateType] = useState("offer");
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
    <Box p={5} bg="white" borderRadius="md" shadow="md">
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
            <option value="offer">Offer Letter</option>
            <option value="rejection">Rejection Letter</option>
            {/* <option value="onboarding">Onboarding Letter</option> */}
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
