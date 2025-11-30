"use client";

import { Box, Grid, Flex, Text, Heading, VStack } from "@chakra-ui/react";
import { Users, Dumbbell, TrendingUp, Calendar } from "lucide-react";
import { dashboardApiClient, LatestRegistration } from "../DashboardServices/dashboardApiClient";
import { useEffect, useState, useMemo } from "react";
import Loader from "@/Components/Loader";

// TYPES
interface StatsResponse {
  totalMembers: number;
  activeMembers: number;
  monthlyRevenue: number;
  expiringByMonth: Record<string, number>;
  membershipBreakdown: {
    monthly: number;
    quarterly: number;
    yearly: number;
    halfyearly: number
  };
}

export default function DashboardOverview() {
  const [statsData, setStatsData] = useState<StatsResponse | null>(null);
  const [newRegistation, setNewRegistration] = useState<LatestRegistration[]>([]);
  const [isPageLoading, setIsPageLoading] = useState(false);

  const currentMonth = useMemo(
    () => new Date().toLocaleString("en-US", { month: "long" }),
    []
  );

  // Fetch Stats
  const getDashboardStats = async () => {
    setIsPageLoading(true);
    try {
      const response = await dashboardApiClient.getStats();
      setStatsData(response);
    } catch (err) {
      console.log(err);
    } finally {
      setIsPageLoading(false);
    }
  };

  const getLatestRegistation = async () => {
    try {
      const response = await dashboardApiClient.getLatestRegistation();
      setNewRegistration(response)
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getDashboardStats();
    getLatestRegistation();
  }, []);

  // EXPIRING COUNT LOGIC
  const expiringThisMonth =
    statsData?.expiringByMonth[currentMonth] ?? 0;

  // List Config (Clean)
  const statCards = useMemo(
    () => [
      {
        title: "Total Members",
        value: statsData?.totalMembers ?? 0,
        icon: <Users size={28} />,
        color: "primary",
        bgAlpha: "rgba(239,75,110,0.1)",
      },
      {
        title: "Active Members",
        value: statsData?.activeMembers ?? 0,
        icon: <Dumbbell size={28} />,
        color: "green.400",
        bgAlpha: "rgba(34,197,94,0.1)",
      },
      {
        title: "Revenue (Monthly)",
        value: statsData?.monthlyRevenue ?? 0,
        icon: <TrendingUp size={28} />,
        color: "primary",
        bgAlpha: "rgba(239,75,110,0.1)",
      },
      {
        title: "Expiring This Month",
        value: expiringThisMonth,
        icon: <Calendar size={28} />,
        color: "yellow.400",
        bgAlpha: "rgba(234,179,8,0.1)",
      },
    ],
    [statsData, expiringThisMonth]
  );

  const membershipBreakdownData = useMemo(() => {
    if (!statsData) return [];

    const total =
      statsData.membershipBreakdown.monthly +
      statsData.membershipBreakdown.quarterly +
      statsData.membershipBreakdown.yearly;

    const breakdown = [
      {
        name: "Monthly",
        count: statsData.membershipBreakdown.monthly,
        percentage: total ? (statsData.membershipBreakdown.monthly / total) * 100 : 0,
        color: "primary",
      },
      {
        name: "Quarterly",
        count: statsData.membershipBreakdown.quarterly,
        percentage: total ? (statsData.membershipBreakdown.quarterly / total) * 100 : 0,
        color: "blue.500",
      },
      {
        name: "Half Yearly",
        count: statsData.membershipBreakdown.halfyearly,
        percentage: total ? (statsData.membershipBreakdown.halfyearly / total) * 100 : 0,
        color: "yellow.700",
      },
      {
        name: "Yearly",
        count: statsData.membershipBreakdown.yearly,
        percentage: total ? (statsData.membershipBreakdown.yearly / total) * 100 : 0,
        color: "gray.500",
      },
    ];

    return breakdown;
  }, [statsData]);


  return (
    <VStack gap={6} align="stretch">
      {isPageLoading && <Loader />}
      {/* ==== STATS CARDS ==== */}
      <Grid
        templateColumns={{
          base: "1fr",
          md: "repeat(2, 1fr)",
          lg: "repeat(4, 1fr)",
        }}
        gap={4}
      >
        {statCards.map((item, index) => (
          <Box
            key={index}
            bg="gray.900"
            border="1px solid"
            borderColor="primary"
            borderRadius="lg"
            p={5}
          >
            <Flex justify="space-between" align="flex-start">
              <Box>
                <Text fontSize="sm" color="gray.400">
                  {item.title}
                </Text>
                <Text mt={2} fontSize="2xl" fontWeight="bold" color="white">
                  {item.value}
                </Text>
              </Box>

              <Flex
                p={3}
                rounded="lg"
                bg={item.bgAlpha}
                color={item.color}
                align="center"
                justify="center"
              >
                {item.icon}
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
            {newRegistation.map((user, idx) => (
              <Flex
                key={idx}
                justify="space-between"
                py={2}
                borderBottom="1px solid"
                borderColor={idx === 2 ? "transparent" : "primary"}
              >
                <Box>
                  <Text fontSize="sm" fontWeight="medium" color="white">
                    {user.full_name}
                  </Text>
                  <Text fontSize="xs" color="gray.400">
                    {new Date(user.createdAt)?.toDateString()}
                  </Text>
                </Box>

                <Box
                  fontSize="xs"
                  px={2}
                  py={1}
                  rounded="md"
                  bg={user.membership_type === "monthly" ? "primary" : user.membership_type === "yearly" ? "green.600" : user.membership_type === 'half yearly' ? "yellow.700" : "gray.700"}
                  color={user.membership_type === "quarterly" ? "white" : "white"}
                  alignSelf={"center"}
                  fontWeight={"bold"}
                >
                  {user.membership_type?.toUpperCase()}
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
            {membershipBreakdownData.map((type, idx) => (
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
