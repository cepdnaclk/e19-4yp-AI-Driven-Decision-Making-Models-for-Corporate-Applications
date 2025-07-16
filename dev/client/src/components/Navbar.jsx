import {
  Box,
  Flex,
  HStack,
  Spacer,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/logout";
import {
  FaHome,
  FaTachometerAlt,
  FaUserCircle,
  FaUser,
  FaSignOutAlt,
  FaChevronDown,
} from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <Box bg="blue.600" px={6} py={3} color="white" shadow="md">
      <Flex alignItems="center" ml="200" mr="200">
        {/* Left side: Home & Dashboard */}
        <HStack spacing={6}>
          <HStack
            spacing={1}
            cursor="pointer"
            onClick={() => navigate("/home")}
            _hover={{ color: "gray.200" }}
          >
            <FaHome />
            <Text>Home</Text>
          </HStack>

          <HStack
            spacing={1}
            cursor="pointer"
            onClick={() => navigate("/dashboard")}
            _hover={{ color: "gray.200" }}
          >
            <FaTachometerAlt />
            <Text>Dashboard</Text>
          </HStack>
        </HStack>

        <Spacer />

        {/* Right side: Profile dropdown */}
        <Menu placement="bottom-end">
          <MenuButton
            as={Button}
            variant="ghost"
            color="white"
            _hover={{ bg: "blue.700" }}
            leftIcon={<FaUserCircle />}
            rightIcon={<FaChevronDown />}
          >
            Profile
          </MenuButton>
          <MenuList color="black">
            <MenuItem icon={<FaUser />} onClick={() => navigate("/profile")}>
              View Profile
            </MenuItem>
            <MenuItem icon={<FaSignOutAlt />} onClick={() => logout(navigate)}>
              Logout
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Box>
  );
};

export default Navbar;
