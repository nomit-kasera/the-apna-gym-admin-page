"use client";

import React, { useState } from "react";
import { Box, Flex, Text, Button, VStack, HStack, IconButton, Icon, Image } from "@chakra-ui/react";
import { Menu, LogOut, BarChart3, Users, X } from "lucide-react";
import { useRouter } from "next/router";
import useUserStore from "@/stores/useUserStore";
import * as AuthUtils from "@/utils/AuthUtils";
import { Paths } from "@/constant/paths";

interface LayoutProps {
  children: React.ReactNode;
  pageTitle: string;
}

export default function Layout({
  children,
  pageTitle,
}: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const router = useRouter();
  const openMobileSidebar = () => setIsMobileSidebarOpen(true);
  const closeMobileSidebar = () => setIsMobileSidebarOpen(false);
  const { name, reset } = useUserStore();

  const handleSignOut = () => {
    AuthUtils.signOut();
    reset();
  };

  const SidebarContent = (isMobileView = false) => (
    <Box
      bg="black"
      borderRight="1px solid"
      borderColor="primary"
      h="100%"
      w={sidebarOpen ? "250px" : "80px"}
      transition="all 0.3s"
      display="flex"
      flexDirection="column"
    >
      {/* Logo */}
      <Flex
        h="16"
        align="center"
        justify="center"
        borderBottom="1px solid"
        borderColor="primary"
        gap={3}
      >
        <Image src="/logo.jpeg" alt="Apna Gym" boxSize={10} rounded="full" />

        {sidebarOpen && (
          <Text fontWeight="bold" fontSize="lg" color="primary">
            THE APNA GYM
          </Text>
        )}
      </Flex>

      {/* NAVIGATION */}
      <VStack gap={2} flex="1" p={4} align="stretch">
        <NavItem
          icon={<BarChart3 size={20} />}
          label="Dashboard"
          active={router.asPath.includes('home')}
          onClick={() => {
            closeMobileSidebar();
            router.push(Paths.home);
          }}
          sidebarOpen={sidebarOpen}
        />

        <NavItem
          icon={<Users size={20} />}
          label="Members"
          active={router.asPath.includes('members')}
          onClick={() => {
            closeMobileSidebar();
            router.push(Paths.members);
          }}
          sidebarOpen={sidebarOpen}
        />
      </VStack>

      {/* FOOTER */}
      {!isMobileView && (
        <Box p={4} borderTop="1px solid" borderColor="primary">
          <Button
            variant="ghost"
            w="full"
            color="primary"
            _hover={{ color: "primary" }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? "←" : <Menu size={20} />}
          </Button>
        </Box>
      )}
    </Box>
  );

  return (
    <Flex minH="100vh" bg="black">
      {/* DESKTOP SIDEBAR */}
      <Box display={{ base: "none", md: "block" }}>{SidebarContent(false)}</Box>

      {/* MOBILE SIDEBAR OVERLAY */}
      {isMobileSidebarOpen && (
        <Box position="fixed" inset={0} zIndex={1000}>
          <Box
            position="absolute"
            inset={0}
            bg="blackAlpha.600"
            onClick={closeMobileSidebar}
          />
          <Box
            position="absolute"
            top={0}
            left={0}
            h="100%"
            w="80%"
            maxW="320px"
            bg="black"
            borderRight="1px solid"
            borderColor="primary"
            boxShadow="2xl"
            overflow="hidden"
          >
            <IconButton
              aria-label="Close sidebar"
              variant="ghost"
              color="primary"
              position="absolute"
              top={2}
              right={2}
              onClick={closeMobileSidebar}
            >
              <X size={20} />
            </IconButton>
            <Box h="100%" overflowY="auto">{SidebarContent(true)}</Box>
          </Box>
        </Box>
      )}

      {/* MAIN CONTENT */}
      <Flex flex="1" flexDirection="column">
        {/* TOP BAR */}
        <Flex
          h="16"
          bg="black"
          borderBottom="1px solid"
          borderColor="primary"
          align="center"
          justify="space-between"
          px={4}
        >
          {/* MOBILE MENU BUTTON */}
          <IconButton
            aria-label="menu"
            display={{ base: "flex", md: "none" }}
            onClick={() => { openMobileSidebar(), setSidebarOpen(true) }}
            color="primary"
            variant="ghost"
          >
            <Menu size={22} />
          </IconButton>

          <Text
            fontSize={{ base: "lg", md: "xl" }}
            fontWeight="bold"
            color="white"
          >
            {pageTitle}
          </Text>

          {/* RIGHT SIDE */}
          <HStack gap={4} display={{ base: "none", sm: "flex" }}>
            <Text color="gray.300">
              Welcome,{" "}
              <Text as="span" color="primary" fontWeight="semibold">
                {name}
              </Text>
            </Text>

            <Button
              variant="ghost"
              color="gray.400"
              _hover={{ color: "primary" }}
              onClick={handleSignOut}
              size="sm"
              display="flex"
              alignItems="center"
              gap={2}
            >
              <LogOut size={18} /> Logout
            </Button>
          </HStack>
        </Flex>

        {/* PAGE BODY */}
        <Box
          flex="1"
          overflowY="auto"
          p={{ base: 4, md: 6 }}
          bgGradient="linear(to-br, gray.950, black, gray.900)"
        >
          {children}
        </Box>
      </Flex>
    </Flex>
  );
}

/* ----------------------------------------- */
/*                NAV ITEM                   */
/* ----------------------------------------- */

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  sidebarOpen: boolean;
}

function NavItem({ icon, label, active, onClick, sidebarOpen }: NavItemProps) {
  return (
    <Button
      onClick={onClick}
      justifyContent="flex-start"
      w="full"
      bg={active ? "primary" : "transparent"}
      color={active ? "white" : "gray.400"}
      _hover={{
        bg: active ? "primary" : "gray.900",
        color: active ? "gray.900" : "primary",
      }}
      rounded="lg"
      px={sidebarOpen ? 4 : 0}
      py={3}
      gap={sidebarOpen ? 3 : 0}
      fontWeight="medium"
      transition="0.2s"
    >
      <Icon>{icon}</Icon>
      {sidebarOpen && label}
    </Button>
  );
}
