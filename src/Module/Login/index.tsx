"use client";

import React, { useState } from "react";
import { Box, Flex, Heading, Text, Input, Button, VStack, Image } from "@chakra-ui/react";
import { dashboardApiClient } from "../DashboardServices/dashboardApiClient";
import useUserStore from "@/stores/useUserStore"
import * as AuthUtils from "@/utils/AuthUtils";
import { useRouter } from "next/router";
import { Paths } from "@/constant/paths";
import Loader from "@/Components/Loader";
import { toast } from "react-toastify";


export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { setAuthenticated, setToken, setUserProfile } = useUserStore();
    const router = useRouter();
    const [isPageLoading, setIsPageLoading] = useState(false);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Please fill in all fields");
            return;
        }

        if (!email.includes("@")) {
            setError("Please enter a valid email");
            return;
        }



        try {
            setIsPageLoading(true);
            const { ref: referredFrom } = router.query;
            const response = await dashboardApiClient.login({
                identifier: email,
                password: password,
            });
            toast.success("Logged in successfully!");
            const profileObject: AuthUtils.ProfileObject = {
                name: response.user.username,
                email: response.user.email,
                token: response.jwt,
                user_id: response.user.documentId,
            };
            setUserProfile(
                profileObject.name,
                profileObject.email,
                profileObject.user_id,
            );
            setToken(profileObject.token);
            setAuthenticated(true);

            // set state
            const status = AuthUtils.setProfileInStorage(profileObject);

            if (!status) {
                throw new Error("Something went wrong!");
            }

            if (referredFrom) {
                router.push(referredFrom as string);
                return;
            }
            router.push(`${Paths.home}`);
        } catch (err: any) {
            setIsPageLoading(false)
            toast.error(err.message || "Login failed");
        } finally {
            setIsPageLoading(false)
        }
    };

    return (
        <Flex align="center" justify="center" minH="100vh" px={4} bgGradient="linear(to-br, black, black, gray.900)">
            {isPageLoading && <Loader />}
            <Box
                maxW="md"
                w="full"
                bg="blackAlpha.600"
                border="1px solid"
                borderColor="primary"
                backdropFilter="blur(10px)"
                borderRadius="lg"
                p={6}
            >
                {/* HEADER */}
                <Box textAlign="center" mb={6}>
                    <VStack gap={4}>
                        <Box>
                            <Image
                                src="/logo.jpeg"
                                alt="Apna Gym Logo"
                                width={["100px", "150px", "180px"]}
                                height={"auto"}
                                style={{ filter: "drop-shadow(0 0 8px rgba(239,75,110,0.4))" }}
                                rounded={"full"}
                            />
                        </Box>

                        <Heading fontSize="3xl" fontWeight="bold" color="primary">
                            THE APNA GYM
                        </Heading>

                        <Text color="gray.300">Admin Dashboard Login</Text>
                    </VStack>
                </Box>

                {/* FORM */}
                <Box as="form" onSubmit={handleSubmit}>
                    <VStack gap={4} align="stretch">
                        {/* EMAIL */}
                        <Box aria-invalid={!!error && (!email || !email.includes("@"))} display="block">
                            <Text as="label" color="gray.200" fontSize="sm" display="block" mb={1}>
                                Email
                            </Text>
                            <Input
                                type="email"
                                placeholder="admin@apnagym.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                bg="gray.800"
                                color="white"
                                borderColor="primary"
                                _placeholder={{ color: "gray.500" }}
                                _focus={{ borderColor: "primary" }}
                            />
                        </Box>
                        {error && (!email || !email.includes("@")) && (
                            <Text color="red.400" fontSize="sm" mt={-2} role="alert">
                                {error}
                            </Text>
                        )}

                        {/* PASSWORD */}
                        <Box aria-invalid={!!error && !password} display="block">
                            <Text as="label" color="gray.200" fontSize="sm" display="block" mb={1}>
                                Password
                            </Text>
                            <Input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                bg="gray.800"
                                color="white"
                                borderColor="primary"
                                _placeholder={{ color: "gray.500" }}
                                _focus={{ borderColor: "primary" }}
                            />
                        </Box>
                        {error && !password && (
                            <Text color="red.400" fontSize="sm" mt={-2} role="alert">
                                {error}
                            </Text>
                        )}

                        {/* SUBMIT BUTTON */}
                        <Button
                            type="submit"
                            w="full"
                            bg="primary"
                            color="white"
                            _hover={{ bg: "primary" }}
                            py={6}
                            fontWeight="bold"
                        >
                            Sign In
                        </Button>
                    </VStack>
                </Box>

                <Text mt={4} textAlign="center" fontSize="xs" color="gray.400">
                    Enter email and password to access dashboard
                </Text>
            </Box>
        </Flex>
    );
}
