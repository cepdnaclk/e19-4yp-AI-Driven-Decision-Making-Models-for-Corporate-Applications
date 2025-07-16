import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  useToast,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ViewProfile() {
  const navigate = useNavigate();
  const toast = useToast();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = () => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("No access token found. Please log in.");
      setLoading(false);
      return;
    }

    fetch("http://localhost:8000/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 401) {
          throw new Error("Unauthorized - Please log in again.");
        }
        if (!res.ok) {
          throw new Error("Failed to fetch profile");
        }
        return res.json();
      })
      .then((data) => setProfile(data))
      .catch((err) => {
        setError(err.message || "Failed to load profile");
        setProfile(null);
        toast({
          title: "Error",
          description: err.message || "Failed to load profile. Please log in again.",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading)
    return (
      <Center mt={10}>
        <Spinner size="xl" />
        <Text ml={3}>Loading profile...</Text>
      </Center>
    );

  if (error)
    return (
      <Center mt={10} flexDirection="column">
        <Text mb={4} color="red.500" fontWeight="bold">
          {error}
        </Text>
        <Button onClick={fetchProfile} colorScheme="blue">
          Retry
        </Button>
      </Center>
    );

  return (
    <Box maxW="600px" mx="auto" mt={8} p={6} borderWidth={1} borderRadius="md" boxShadow="md">
      <Heading mb={6} textAlign="center">
        Your Profile
      </Heading>
      <VStack spacing={4} align="start">
        <Text>
          <strong>Username:</strong> {profile.username}
        </Text>
        <Text>
          <strong>First Name:</strong> {profile.firstname || "Not set"}
        </Text>
        <Text>
          <strong>Last Name:</strong> {profile.lastname || "Not set"}
        </Text>
        <Text>
          <strong>Email:</strong> {profile.email || "Not set"}
        </Text>
        <Text>
          <strong>Role:</strong> {profile.role}
        </Text>
      </VStack>
      <Button mt={8} colorScheme="blue" width="full" onClick={() => navigate("/edit-profile")}>
        Edit Profile
      </Button>
    </Box>
  );
}
