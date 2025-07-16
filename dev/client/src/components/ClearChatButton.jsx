import { Button, useToast } from "@chakra-ui/react";

function ClearChatButton({ onClear, isLoading }) {
  const toast = useToast();

  const handleClick = () => {
    if (typeof onClear === "function") {
      onClear()
        .then(() => {
          toast({
            title: "Chat cleared",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        })
        .catch(() => {
          toast({
            title: "Failed to clear chat",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        });
    }
  };

  return (
    <Button onClick={handleClick} isLoading={isLoading}>
      Clear Chat
    </Button>
  );
}

export default ClearChatButton;
