"use client";

import React, { useState } from "react";
import { Box, Flex, Heading, Text, Input, Button, VStack, Image } from "@chakra-ui/react";

interface LoginPageProps {
    onLogin: (name: string) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
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

        const adminName = email.split("@")[0];
        onLogin(adminName);
    };

    return (
        <Flex align="center" justify="center" minH="100vh" px={4} bgGradient="linear(to-br, black, black, gray.900)">
            <Box
                maxW="md"
                w="full"
                bg="blackAlpha.600"
                border="1px solid"
                borderColor="brand.500"
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
                                boxSize={60}
                                style={{ filter: "drop-shadow(0 0 8px rgba(239,75,110,0.4))" }}
                                rounded={"full"}
                            />
                        </Box>

                        <Heading fontSize="3xl" fontWeight="bold" color="brand.400">
                            APNA GYM
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
                                borderColor="brand.500"
                                _placeholder={{ color: "gray.500" }}
                                _focus={{ borderColor: "brand.400" }}
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
                                borderColor="brand.500"
                                _placeholder={{ color: "gray.500" }}
                                _focus={{ borderColor: "brand.400" }}
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
                            bg="brand.400"
                            color="white"
                            _hover={{ bg: "brand.500" }}
                            py={6}
                            fontWeight="bold"
                        >
                            Sign In
                        </Button>
                    </VStack>
                </Box>

                <Text mt={4} textAlign="center" fontSize="xs" color="gray.400">
                    Demo: Use any email and password to login
                </Text>
            </Box>
        </Flex>
    );
}
