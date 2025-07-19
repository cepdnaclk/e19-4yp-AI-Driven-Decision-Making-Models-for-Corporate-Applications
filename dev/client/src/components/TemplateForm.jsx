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
  offer_letter: [
    { name: "date", label: "Today Date" },
    { name: "fullName", label: "Full Name" },
    { name: "address", label: "Address" },
    { name: "salutation", label: "Salutation" },
    { name: "fName", label: "First Name" },
    { name: "designation", label: "Designation" },
    { name: "startDate", label: "Start Date" },
    { name: "endDate", label: "End Date" },
    { name: "salary", label: "Basic Salary" },
    { name: "allowance", label: "Fixed Allowance" },
    { name: "reportDate", label: "Report Date" },
  ],
  confirmation_letter: [
    { name: "date", label: "Today Date" },
    { name: "fullName", label: "Full Name" },
    { name: "address", label: "Address" },
    { name: "saltation", label: "Salutation" },
    { name: "fName", label: "First Name" },
    { name: "designation", label: "Designation" },
    { name: "effectiveDate", label: "Effective From" },
    { name: "boardNo", label: "Board No." },
    { name: "meetingDate", label: "Date of Meeting" },
    { name: "salary", label: "Basic Salary" },
    { name: "allowance", label: "Allowance" },
  ],
};

function TemplateForm({ onClose, onLetterGenerated, userRole }) {
  const toast = useToast();
  const [templateType, setTemplateType] = useState("offer_letter");
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

      if (
        templateType === "offer_letter" ||
        templateType === "confirmation_letter"
      ) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "letter.docx";
        a.click();
        window.URL.revokeObjectURL(url);
        toast({ title: "Letter Downloaded", status: "success" });

        onLetterGenerated({
          type: "docx",
          url: url,
        });

        onClose();
      } else {
        const data = await res.json();
        if (res.ok) {
          onLetterGenerated(data.content);
          toast({ title: "Letter Generated", status: "success" });
          onClose();
        } else {
          toast({ title: "Error", description: data.detail, status: "error" });
        }
      }

      onClose();
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
            {userRole !== "customer" && (
              <>
                <option value="offer_letter">Offer Letter</option>
                <option value="confirmation_letter">Confirmation Letter</option>
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
          Generate Template
        </Button>
      </VStack>
    </Box>
  );
}

export default TemplateForm;
