"use client";

import { Box, Grid, Flex, Text, Heading, VStack } from "@chakra-ui/react";
import { Users, Dumbbell, TrendingUp, Calendar } from "lucide-react";

export default function DashboardOverview() {
  // Mock data
  const stats = [
    {
      title: "Total Members",
      value: "1,245",
      icon: <Users size={28} />,
      color: "primary",
      bgColor: "primary",
      bgAlpha: "rgba(239,75,110,0.1)",
    },
    {
      title: "Active Members",
      value: "892",
      icon: <Dumbbell size={28} />,
      color: "green.400",
      bgColor: "green.500",
      bgAlpha: "rgba(34,197,94,0.1)",
    },
    {
      title: "Revenue (Monthly)",
      value: "₹4,85,000",
      icon: <TrendingUp size={28} />,
      color: "primary",
      bgColor: "primary",
      bgAlpha: "rgba(239,75,110,0.1)",
    },
    {
      title: "Expiring This Month",
      value: "24",
      icon: <Calendar size={28} />,
      color: "yellow.400",
      bgColor: "yellow.500",
      bgAlpha: "rgba(234,179,8,0.1)",
    },
  ];

  return (
    <VStack gap={6} align="stretch">
      {/* ==== STATS CARDS ==== */}
      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={4}>
        {stats.map((stat, index) => (
          <Box
            key={index}
            bg="gray.900"
            border="1px solid"
            borderColor="primary"
            backdropFilter="blur(6px)"
            borderRadius="lg"
            p={5}
          >
            <Flex justify="space-between" align="flex-start">
              <Box>
                <Text fontSize="sm" color="gray.400">
                  {stat.title}
                </Text>
                <Text mt={2} fontSize="2xl" fontWeight="bold" color="white">
                  {stat.value}
                </Text>
              </Box>

              <Flex
                p={3}
                rounded="lg"
                bg={stat.bgAlpha}
                color={stat.color}
                align="center"
                justify="center"
              >
                {stat.icon}
              </Flex>
            </Flex>
          </Box>
        ))}
      </Grid>

      {/* ==== BOTTOM SECTION ==== */}
      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6}>
        {/* Recent Registrations */}
        <Box bg="gray.900" border="1px solid" borderColor="primary" borderRadius="lg" p={5}>
          <Heading size="md" color="white" mb={4}>
            Recent Registrations
          </Heading>
          <VStack gap={4} align="stretch">
            {[
              { name: "Rajesh Kumar", date: "2025-11-20", membership: "Premium" },
              { name: "Priya Singh", date: "2025-11-19", membership: "Standard" },
              { name: "Amit Patel", date: "2025-11-18", membership: "Premium" },
            ].map((user, idx) => (
              <Flex
                key={idx}
                justify="space-between"
                py={2}
                borderBottom="1px solid"
                borderColor={idx === 2 ? "transparent" : "primary"}
              >
                <Box>
                  <Text fontSize="sm" fontWeight="medium" color="white">
                    {user.name}
                  </Text>
                  <Text fontSize="xs" color="gray.400">
                    {user.date}
                  </Text>
                </Box>

                <Box
                  fontSize="xs"
                  px={2}
                  py={1}
                  rounded="md"
                  bg={user.membership === "Premium" ? "primary" : "gray.700"}
                  color={user.membership === "Premium" ? "white" : "gray.300"}
                >
                  {user.membership}
                </Box>
              </Flex>
            ))}
          </VStack>
        </Box>

        {/* Membership Breakdown */}
        <Box bg="gray.900" border="1px solid" borderColor="primary" borderRadius="lg" p={5}>
          <Heading size="md" color="white" mb={4}>
            Membership Breakdown
          </Heading>
          <VStack gap={4} align="stretch">
            {[
              { name: "Premium", count: 450, percentage: 36, color: "primary" },
              { name: "Standard", count: 650, percentage: 52, color: "blue.500" },
              { name: "Basic", count: 145, percentage: 12, color: "gray.500" },
            ].map((type, idx) => (
              <Box key={idx}>
                <Flex justify="space-between" mb={2}>
                  <Text fontSize="sm" color="gray.300">
                    {type.name}
                  </Text>
                  <Text fontSize="sm" fontWeight="medium" color="white">
                    {type.count}
                  </Text>
                </Flex>

                <Box
                  height="6px"
                  bg="gray.800"
                  rounded="full"
                  overflow="hidden"
                  position="relative"
                  aria-label={`${type.name} ${type.percentage}%`}
                >
                  <Box
                    height="100%"
                    bg={type.color}
                    width={`${type.percentage}%`}
                    transition="width 0.3s ease"
                  />
                </Box>
              </Box>
            ))}
          </VStack>
        </Box>
      </Grid>
    </VStack>
  );
}
