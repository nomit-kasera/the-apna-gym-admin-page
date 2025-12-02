"use client";

import React, { useState, useEffect } from "react";
import {
    Box,
    Flex,
    Grid,
    Input,
    Button,
    Text,
    Heading,
    Badge,
    VStack,
    HStack,
    useBreakpointValue,
} from "@chakra-ui/react";
import { Card, CardHeader, CardBody } from "@chakra-ui/card";
import { Plus, Trash2, Edit2, Search, X } from "lucide-react";
import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/table";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@chakra-ui/modal";
import { InputGroup, InputLeftElement } from "@chakra-ui/input";
import { Select } from "@chakra-ui/select";
import { dashboardApiClient, Member } from "../DashboardServices/dashboardApiClient";
import Loader from "@/Components/Loader";
import { toast } from "react-toastify";
import members from "@/pages/dashboard/members";

const tableColumns = [
    "Name",
    "Email",
    "Phone",
    "Membership",
    "Join Date",
    "Expiry",
    "Status",
    "Action"
]

export default function UserManagement() {
    const [users, setUsers] = useState<Member[]>([]);

    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingUser, setEditingUser] = useState<Member | null>(null);
    const [deletingUserId, setDeletingUserId] = useState<string | "">("");
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(false);


    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        phone_number: "",
        membership_type: "monthly" as "monthly" | "quarterly" | "half yearly" | "yearly",
        start_date: "",
        end_date: "",
        membership_status: "active"
    });

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const isMobile = useBreakpointValue({ base: true, md: false });

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.full_name || !formData.phone_number || !formData.end_date
            || !formData.start_date || !formData.membership_type
        ) {
            alert("Please fill in all fields");
            return;
        }

        try {
            setIsPageLoading(true);
            if (editingUser) {
                // setUsers(users.map((u) => (u.documentId === editingUser.documentId ? { ...editingUser, ...formData } : u)));
                const response = await dashboardApiClient.updateMember({
                    data: {
                        full_name: formData.full_name,
                        email: formData.email || null,
                        phone_number: formData.phone_number,
                        membership_type: formData.membership_type,
                        start_date: formData.start_date,
                        end_date: formData.end_date,
                    }
                }, editingUser.documentId ?? "")
                toast.success("User updated successfully!");
                getMembersData();
                setEditingUser(null);
            } else {
                const response = await dashboardApiClient.addMember({
                    data: {
                        full_name: formData.full_name,
                        email: formData.email || null,
                        phone_number: formData.phone_number,
                        membership_type: formData.membership_type,
                        start_date: formData.start_date,
                        end_date: formData.end_date,
                    }
                })
                const newUser: Member = {
                    ...formData,
                    membership_status: "active",
                    membership_type: formData.membership_type
                };
                toast.success("User added successfully!");
                setUsers([newUser, ...users]);
                getMembersData();
            }

            setFormData({
                full_name: "",
                email: "",
                phone_number: "",
                membership_status: "active",
                start_date: new Date().toISOString().split("T")[0],
                end_date: "",
                membership_type: "monthly"
            });
            setShowForm(false);
        } catch (Error: any) {
            toast.error("" + Error);
        } finally {
            setIsPageLoading(false);
        }


    };

    const handleEditUser = (user: Member) => {
        setEditingUser(user);
        setFormData({
            full_name: user.full_name,
            email: user.email,
            phone_number: user.phone_number,
            membership_status: user.membership_status,
            start_date: user.start_date,
            end_date: user.end_date,
            membership_type: user.membership_type
        });
        setShowForm(true);
    };

    const confirmDeleteUser = (documentId: string) => {
        setDeletingUserId(documentId);
        setIsConfirmOpen(true);
    };

    const closeConfirmDialog = async () => {
        setDeletingUserId("");
        setIsConfirmOpen(false);
    };

    const handleDeleteUser = async () => {
        if (deletingUserId !== null) {
            setIsPageLoading(true)
            try {
                const response = await dashboardApiClient.deleteMember(deletingUserId);
                setUsers(users.filter((u) => u?.documentId !== deletingUserId));
                toast.success("User deleted successfully!");
                closeConfirmDialog();
            } catch (err: any) {
                toast.error("Failed to delete user!");
            } finally {
                setIsPageLoading(false);
            }
        }
    };

    // Filtered users based on search
    const filteredUsers = users.filter(
        (user) =>
            user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.phone_number.includes(searchTerm),
    );

    // Reset to page 1 when search term or rows-per-page changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, rowsPerPage]);

    // Pagination calculations
    const totalRows = filteredUsers.length;
    const totalPages = Math.max(1, Math.ceil(totalRows / rowsPerPage));
    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + rowsPerPage);
    const showingFrom = totalRows === 0 ? 0 : startIndex + 1;
    const showingTo = Math.min(startIndex + rowsPerPage, totalRows);

    const handleChangePage = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    const getStatusStyle = (status: Member["membership_status"]) => {
        switch (status) {
            case "active":
                return { bg: "rgba(22,163,74,0.18)", color: "green.300" };
            case "expiring_soon":
                return { bg: "rgba(234,179,8,0.16)", color: "yellow.300" };
            case "expired":
                return { bg: "rgba(239,75,110,0.2)", color: "#ef4b6e" };
            default:
                return { bg: "rgba(31,41,55,0.2)", color: "gray.300" };
        }
    };

    const getMembershipStyle = (membership: Member["membership_type"]) => {
        switch (membership) {
            case "monthly":
                return { bg: "#ef4b6e", color: "white" };
            case "quarterly":
                return { bg: "gray.700", color: "white" };
            case "half yearly":
                return { bg: "yellow.700", color: "white" };
            case "yearly":
            default:
                return { bg: "green.600", color: "white" };
        }
    };

    const getMembersData = async () => {
        setIsPageLoading(true);
        try {
            const response = await dashboardApiClient.getMembers(currentPage, rowsPerPage);
            setUsers(response.data)
        } catch (error: any) {
            console.log(error)
        } finally {
            setIsPageLoading(false);
        }
    }

    const getMembershipStatus = (endDate: string) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const expiry = new Date(endDate);
        expiry.setHours(0, 0, 0, 0);

        return expiry >= today ? "Active" : "Expired";
    };

    const calculateEndDate = (start: string, type: string) => {
        if (!start) return "";

        const startDate = new Date(start);
        const newDate = new Date(startDate);

        switch (type) {
            case "monthly":
                newDate.setMonth(startDate.getMonth() + 1);
                break;
            case "quarterly":
                newDate.setMonth(startDate.getMonth() + 3);
                break;
            case "half yearly":
                newDate.setMonth(startDate.getMonth() + 6);
                break;
            case "yearly":
                newDate.setFullYear(startDate.getFullYear() + 1);
                break;
        }

        return newDate.toISOString().split("T")[0];
    };



    useEffect(() => {
        getMembersData();
    }, [rowsPerPage, currentPage])

    return (
        <Box w="100%" py={{ base: 4, md: 6 }}>
            {isPageLoading && <Loader />}
            <VStack gap={6} align="stretch">
                {/* PAGE HEADER */}
                <Box>
                    <Heading
                        size={isMobile ? "lg" : "xl"}
                        color="white"
                        mb={2}
                        fontWeight="bold"
                    >
                        Member Management
                    </Heading>
                    <Text color="gray.400" fontSize="sm">
                        Manage registrations, track membership status, and keep your gym members up to date.
                    </Text>
                </Box>

                {/* Search + Add Member */}
                <Card
                >
                    <CardBody>
                        <Flex
                            direction={{ base: "column", md: "row" }}
                            gap={4}
                            align={{ base: "stretch", md: "center" }}
                            justify="space-between"
                        >
                            <Box flex="1" w="100%">
                                <Text mb={2} fontSize="sm" color="gray.300">
                                    Search Members
                                </Text>
                                <InputGroup>
                                    <InputLeftElement alignSelf={"anchor-center"} p={10} pointerEvents="none">
                                        <Search size={18} color="#6b7280" />
                                    </InputLeftElement>
                                    <Input
                                        type="text"
                                        placeholder="Search by name, email, or phone..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        bg="rgba(15,23,42,0.9)"
                                        borderColor="rgba(148,163,184,0.4)"
                                        color="white"
                                        _hover={{ borderColor: "#ef4b6e" }}
                                        _focus={{ borderColor: "#ef4b6e", boxShadow: "0 0 0 1px #ef4b6e" }}
                                        _placeholder={{ color: "gray.500" }}
                                        pl={10}
                                    />
                                </InputGroup>
                            </Box>

                            <Button
                                onClick={() => {
                                    setEditingUser(null);
                                    const today = new Date().toISOString().split("T")[0];
                                    const endDate = calculateEndDate(today, "monthly");
                                    setFormData({
                                        full_name: "",
                                        email: "",
                                        phone_number: "",
                                        membership_status: "active",
                                        start_date: new Date().toISOString().split("T")[0],
                                        end_date: endDate,
                                        membership_type: "monthly"
                                    });
                                    setShowForm((prev) => !prev);
                                }}
                                bg="#ef4b6e"
                                color="white"
                                _hover={{ bg: "#ef4b6e", opacity: 0.9 }}
                                display="flex"
                                alignItems="center"
                                gap={2}
                                w={{ base: "100%", md: "auto" }}
                                h="44px"
                                alignSelf={"flex-end"}
                            >
                                {!showForm ? <Plus size={16} /> : <X size={16} />}
                                {showForm ? "Cancel" : "Add Member"}
                            </Button>
                        </Flex>
                    </CardBody>
                </Card>

                {/* Registration Form */}
                {showForm && (
                    <Card
                        bg="rgba(15,23,42,0.8)"
                        borderWidth="1px"
                        borderColor="#ef4b6e"
                        sx={{ backdropFilter: "blur(14px)" }}
                        borderRadius={8}
                        p={20}
                    >
                        <CardHeader pb={2}>
                            <Heading size="md" color="white">
                                {editingUser ? "Edit Member" : "Register New Member"}
                            </Heading>
                            <Text fontSize="sm" color="gray.400" mt={1}>
                                Fill in the details below to {editingUser ? "update this member" : "add a new member"}.
                            </Text>
                        </CardHeader>
                        <CardBody pt={4}>
                            <Box as="form" onSubmit={handleAddUser}>
                                <Grid templateColumns={{ base: "1fr", md: "repeat(2, minmax(0, 1fr))" }} gap={4} mb={4}>
                                    <Box>
                                        <Text fontSize="sm" fontWeight="medium" color="gray.200" mb={2}>
                                            Full Name *
                                        </Text>
                                        <Input
                                            value={formData.full_name}
                                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                            placeholder="Enter full name"
                                            bg="rgba(15,23,42,0.9)"
                                            borderColor="rgba(148,163,184,0.4)"
                                            color="white"
                                            _hover={{ borderColor: "#ef4b6e" }}
                                            _focus={{ borderColor: "#ef4b6e", boxShadow: "0 0 0 1px #ef4b6e" }}
                                            _placeholder={{ color: "gray.500" }}
                                        />
                                    </Box>

                                    <Box>
                                        <Text fontSize="sm" fontWeight="medium" color="gray.200" mb={2}>
                                            Email
                                        </Text>
                                        <Input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="Enter email"
                                            bg="rgba(15,23,42,0.9)"
                                            borderColor="rgba(148,163,184,0.4)"
                                            color="white"
                                            _hover={{ borderColor: "#ef4b6e" }}
                                            _focus={{ borderColor: "#ef4b6e", boxShadow: "0 0 0 1px #ef4b6e" }}
                                            _placeholder={{ color: "gray.500" }}
                                        />
                                    </Box>

                                    <Box>
                                        <Text fontSize="sm" fontWeight="medium" color="gray.200" mb={2}>
                                            Phone Number *
                                        </Text>
                                        <Input
                                            value={formData.phone_number}
                                            onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                                            placeholder="Enter phone number"
                                            bg="rgba(15,23,42,0.9)"
                                            borderColor="rgba(148,163,184,0.4)"
                                            borderWidth={"1px solid"}
                                            color="white"
                                            _hover={{ borderColor: "#ef4b6e" }}
                                            _focus={{ borderColor: "#ef4b6e", boxShadow: "0 0 0 1px #ef4b6e" }}
                                            _placeholder={{ color: "gray.500" }}
                                        />
                                    </Box>

                                    <Box>
                                        <Text fontSize="sm" fontWeight="medium" color="gray.200" mb={2}>
                                            Membership Type *
                                        </Text>
                                        <Select
                                            width={"100%"}
                                            value={formData.membership_type}
                                            onChange={(e) => {
                                                const type = e.target.value as any;
                                                const newEndDate = calculateEndDate(formData.start_date, type);

                                                setFormData({
                                                    ...formData,
                                                    membership_type: type,
                                                    end_date: newEndDate,
                                                });
                                            }}
                                            bg="rgba(15,23,42,0.9)"
                                            border={"1px solid"}
                                            borderRadius={"5px"}
                                            height={"40px"}
                                            borderColor="rgba(148,163,184,0.4)"
                                            color="white"
                                            _hover={{ borderColor: "#ef4b6e" }}
                                            _focus={{ borderColor: "#ef4b6e" }}
                                        >
                                            <option style={{ backgroundColor: "#020617" }} value="monthly">
                                                Monthly
                                            </option>
                                            <option style={{ backgroundColor: "#020617" }} value="quarterly">
                                                Quarterly
                                            </option>
                                            <option style={{ backgroundColor: "#020617" }} value="half yearly">
                                                Half Yearly
                                            </option>
                                            <option style={{ backgroundColor: "#020617" }} value="yearly">
                                                Yearly
                                            </option>
                                        </Select>
                                    </Box>

                                    <Box>
                                        <Text fontSize="sm" fontWeight="medium" color="gray.200" mb={2}>
                                            Join Date *
                                        </Text>
                                        <Input
                                            type="date"
                                            value={formData.start_date}
                                            onChange={(e) => {
                                                const newStart = e.target.value;
                                                const newEnd = calculateEndDate(newStart, formData.membership_type);

                                                setFormData({ ...formData, start_date: newStart, end_date: newEnd });
                                            }}
                                            bg="rgba(15,23,42,0.9)"
                                            borderColor="rgba(148,163,184,0.4)"
                                            color="white"
                                            _hover={{ borderColor: "#ef4b6e" }}
                                            _focus={{ borderColor: "#ef4b6e", boxShadow: "0 0 0 1px #ef4b6e" }}
                                        />
                                    </Box>

                                    <Box>
                                        <Text fontSize="sm" fontWeight="medium" color="gray.200" mb={2}>
                                            Expiry Date *
                                        </Text>
                                        <Input
                                            type="date"
                                            value={formData.end_date}
                                            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                            bg="rgba(15,23,42,0.9)"
                                            borderColor="rgba(148,163,184,0.4)"
                                            color="white"
                                            _hover={{ borderColor: "#ef4b6e" }}
                                            _focus={{ borderColor: "#ef4b6e", boxShadow: "0 0 0 1px #ef4b6e" }}
                                        />
                                    </Box>
                                </Grid>

                                <Flex gap={3} flexWrap="wrap">
                                    <Button type="submit" bg="#ef4b6e" color="white" _hover={{ bg: "#ef4b6e", opacity: 0.9 }}>
                                        {editingUser ? "Update Member" : "Register Member"}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        borderColor="rgba(148,163,184,0.6)"
                                        color="gray.300"
                                        _hover={{ bg: "rgba(15,23,42,0.9)" }}
                                        onClick={() => {
                                            setShowForm(false);
                                            setEditingUser(null);
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </Flex>
                            </Box>
                        </CardBody>
                    </Card>
                )}

                {/* Users Table */}
                <Box
                    bg="rgba(15,23,42,0.8)"
                    borderWidth="1px"
                    borderColor="#ef4b6e"
                    // ={{ backdropFilter: "blur(14px)" }}
                    p={{ base: 4, md: 6, lg: 6 }}
                    borderRadius={8}
                    overflow="hidden"
                >
                    <Box pb={3}>
                        <Heading size="md" color="white">
                            Registered Members ({filteredUsers.length})
                        </Heading>
                    </Box>

                    <Box pt={0}>
                        {/* Mobile Cards View */}
                        <Box display={{ base: "block", lg: "none" }}>
                            {paginatedUsers.length > 0 ? (
                                <VStack gap={4} align="stretch">
                                    {paginatedUsers.map((user) => {
                                        const memStyle = getMembershipStyle(user.membership_type);
                                        const status = getMembershipStatus(user.end_date);

                                        const statusStyle = status === "Active"
                                            ? { bg: "green.500", color: "white" }
                                            : { bg: "red.500", color: "white" };
                                        return (
                                            <Box
                                                key={user.documentId}
                                                bg="rgba(15,23,42,0.6)"
                                                border="1px solid"
                                                borderColor="rgba(148,163,184,0.3)"
                                                borderRadius="md"
                                                p={4}
                                                _hover={{ bg: "rgba(15,23,42,0.95)" }}
                                            >
                                                <VStack align="stretch" gap={3}>
                                                    {/* Name & Actions */}
                                                    <Flex justify="space-between" align="flex-start">
                                                        <Text color="white" fontSize="sm" fontWeight="medium" flex={1}>
                                                            {user.full_name}
                                                        </Text>
                                                        <HStack gap={2}>
                                                            <Button
                                                                variant="ghost"
                                                                size="xs"
                                                                color="blue.300"
                                                                _hover={{ color: "blue.200", bg: "transparent" }}
                                                                onClick={() => handleEditUser(user)}
                                                            >
                                                                <Edit2 size={15} />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="xs"
                                                                color="#ef4b6e"
                                                                _hover={{ color: "#ff6b88", bg: "transparent" }}
                                                                onClick={() => confirmDeleteUser(user.documentId ?? "")}
                                                            >
                                                                <Trash2 size={15} />
                                                            </Button>
                                                        </HStack>
                                                    </Flex>

                                                    {/* Member Details */}
                                                    <VStack align="stretch" gap={2}>
                                                        <Flex justify="space-between">
                                                            <Text color="gray.400" fontSize="xs">Email:</Text>
                                                            <Text color="gray.300" fontSize="xs" textAlign="right" maxW="70%">
                                                                {user.email}
                                                            </Text>
                                                        </Flex>
                                                        <Flex justify="space-between">
                                                            <Text color="gray.400" fontSize="xs">Phone:</Text>
                                                            <Text color="gray.300" fontSize="xs">{user.phone_number}</Text>
                                                        </Flex>
                                                        <Flex justify="space-between">
                                                            <Text color="gray.400" fontSize="xs">Membership:</Text>
                                                            <Badge
                                                                fontSize="xs"
                                                                px={2.5}
                                                                py={1}
                                                                rounded="full"
                                                                bg={memStyle.bg}
                                                                color={memStyle.color}
                                                                fontWeight={"bold"}
                                                            >
                                                                {user.membership_type?.toUpperCase()}
                                                            </Badge>
                                                        </Flex>
                                                        <Flex justify="space-between">
                                                            <Text color="gray.400" fontSize="xs">Join Date:</Text>
                                                            <Text color="gray.300" fontSize="xs">{new Date(user.start_date)?.toDateString()}</Text>
                                                        </Flex>
                                                        <Flex justify="space-between">
                                                            <Text color="gray.400" fontSize="xs">Expiry Date:</Text>
                                                            <Text color="gray.300" fontSize="xs">{new Date(user.end_date)?.toDateString()}</Text>
                                                        </Flex>
                                                        <Flex justify="space-between">
                                                            <Text color="gray.400" fontSize="xs">Status:</Text>
                                                            <Badge
                                                                fontSize="xs"
                                                                px={2.5}
                                                                py={1}
                                                                rounded="full"
                                                                bg={statusStyle.bg}
                                                                color={statusStyle.color}
                                                            >
                                                                {status}
                                                            </Badge>
                                                        </Flex>
                                                    </VStack>
                                                </VStack>
                                            </Box>
                                        );
                                    })}
                                </VStack>
                            ) : (
                                <Box textAlign="center" py={8}>
                                    <Text color="gray.400" fontSize="sm">
                                        No members found matching your search.
                                    </Text>
                                </Box>
                            )}
                        </Box>

                        {/* Desktop Table View */}
                        <Box display={{ base: "none", lg: "block" }} overflowX="auto" mt={2}>
                            <Table width={"100%"} size="lg" variant="outline" minWidth="800px">
                                <Thead textAlign={"left"} borderBottom={"1px solid #ef4b6e"}>
                                    <Tr>
                                        {tableColumns?.map((col: string) =>
                                            <Th key={col} color="gray.300" fontSize="xs" textTransform="uppercase" fontWeight={"bold"} borderColor="rgba(148,163,184,0.4)">
                                                {col}
                                            </Th>
                                        )}
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {paginatedUsers.map((user) => {
                                        const memStyle = getMembershipStyle(user.membership_type);
                                        const status = getMembershipStatus(user.end_date);

                                        const statusStyle = status === "Active"
                                            ? { bg: "green.500", color: "white" }
                                            : { bg: "red.500", color: "white" };
                                        return (
                                            <Tr
                                                key={user.documentId}
                                                _hover={{ bg: "rgba(15,23,42,0.95)" }}
                                                borderColor="rgba(148,163,184,0.25)"
                                                borderTop={"1px solid #ef4b6e"}
                                                height={"55px"}
                                            >
                                                <Td color="white" fontSize="sm" maxW="160px" whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden">
                                                    {user.full_name}
                                                </Td>
                                                <Td
                                                    color="gray.300"
                                                    fontSize="sm"
                                                    maxW="220px"
                                                    whiteSpace="nowrap"
                                                    textOverflow="ellipsis"
                                                    overflow="hidden"
                                                >
                                                    {user.email}
                                                </Td>
                                                <Td color="gray.300" fontSize="sm" whiteSpace="nowrap">
                                                    {user.phone_number}
                                                </Td>
                                                <Td>
                                                    <Badge
                                                        fontSize="xs"
                                                        px={2.5}
                                                        py={1}
                                                        rounded="full"
                                                        bg={memStyle.bg}
                                                        color={memStyle.color}
                                                        fontWeight={"bold"}
                                                    >
                                                        {user.membership_type?.toUpperCase()}
                                                    </Badge>
                                                </Td>
                                                <Td color="gray.300" fontSize="sm" whiteSpace="nowrap">
                                                    {new Date(user.start_date)?.toDateString()}
                                                </Td>
                                                <Td color="gray.300" fontSize="sm" whiteSpace="nowrap">
                                                    {new Date(user.end_date)?.toDateString()}
                                                </Td>
                                                <Td>

                                                    <Badge
                                                        fontSize="xs"
                                                        px={2.5}
                                                        py={1}
                                                        rounded="full"
                                                        bg={statusStyle.bg}
                                                        color={statusStyle.color}
                                                    >
                                                        {status}
                                                    </Badge>

                                                </Td>
                                                <Td>
                                                    <HStack gap={1.5}>
                                                        <Button
                                                            variant="ghost"
                                                            size="xs"
                                                            color="blue.300"
                                                            _hover={{ color: "blue.200", bg: "transparent" }}
                                                            onClick={() => handleEditUser(user)}
                                                        >
                                                            <Edit2 size={15} />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="xs"
                                                            color="#ef4b6e"
                                                            _hover={{ color: "#ff6b88", bg: "transparent" }}
                                                            onClick={() => confirmDeleteUser(user.documentId ?? "")}
                                                        >
                                                            <Trash2 size={15} />
                                                        </Button>
                                                    </HStack>
                                                </Td>
                                            </Tr>
                                        );
                                    })}
                                </Tbody>
                            </Table>
                        </Box>

                        {filteredUsers.length === 0 && (
                            <Box display={{ base: "none", lg: "block" }} textAlign="center" py={8}>
                                <Text color="gray.400" fontSize="sm">
                                    No members found matching your search.
                                </Text>
                            </Box>
                        )}

                        {/* Pagination Controls */}
                        {filteredUsers.length > 0 && (
                            <Flex
                                mt={4}
                                pt={3}
                                borderTop="1px solid"
                                borderColor="rgba(148,163,184,0.3)"
                                direction={{ base: "column", md: "row" }}
                                justify="space-between"
                                align={{ base: "flex-start", md: "center" }}
                                gap={4}
                            >
                                {/* Left: rows per page + showing info */}
                                <VStack align="flex-start" gap={1}>
                                    <HStack gap={2} align="center">
                                        <Text fontSize="sm" color="gray.300">
                                            Rows per page:
                                        </Text>
                                        <Select
                                            value={rowsPerPage.toString()}
                                            onChange={(e) => setRowsPerPage(Number(e.target.value))}
                                            size="sm"
                                            width="80px"
                                            bg="rgba(15,23,42,0.95)"
                                            borderColor="rgba(148,163,184,0.6)"
                                            color="white"
                                        >
                                            <option style={{ backgroundColor: "#020617" }} value="5">
                                                5
                                            </option>
                                            <option style={{ backgroundColor: "#020617" }} value="10">
                                                10
                                            </option>
                                            <option style={{ backgroundColor: "#020617" }} value="20">
                                                20
                                            </option>
                                            <option style={{ backgroundColor: "#020617" }} value="50">
                                                50
                                            </option>
                                        </Select>
                                    </HStack>
                                    <Text fontSize="sm" color="gray.400">
                                        Showing {showingFrom}-{showingTo} of {totalRows} members
                                    </Text>
                                </VStack>

                                {/* Right: pagination buttons */}
                                <HStack
                                    gap={2}
                                    align="center"
                                    // justify="flex-end"
                                    flexWrap="wrap"
                                    w={{ base: "100%", md: "auto" }}
                                    justify={{ base: "center", md: "flex-end" }}
                                >
                                    <Button
                                        size={["xs", "sm"]}
                                        variant="outline"
                                        borderColor="rgba(148,163,184,0.6)"
                                        color="gray.300"
                                        _hover={{ bg: "rgba(15,23,42,0.95)" }}
                                        onClick={() => handleChangePage(1)}
                                        disabled={currentPage === 1}
                                    >
                                        <Text display={{ base: "none", sm: "block" }}>First</Text>
                                        <Text display={{ base: "block", sm: "none" }}>⇤</Text>
                                    </Button>
                                    <Button
                                        size={["xs", "sm"]}
                                        variant="outline"
                                        borderColor="rgba(148,163,184,0.6)"
                                        color="gray.300"
                                        _hover={{ bg: "rgba(15,23,42,0.95)" }}
                                        onClick={() => handleChangePage(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        <Text display={{ base: "none", sm: "block" }}>Prev</Text>
                                        <Text display={{ base: "block", sm: "none" }}>←</Text>
                                    </Button>

                                    <Text fontSize="sm" color="gray.300" minW="100px" textAlign="center">
                                        Page {currentPage} of {totalPages}
                                    </Text>

                                    <Button
                                        size={["xs", "sm"]}
                                        variant="outline"
                                        borderColor="rgba(148,163,184,0.6)"
                                        color="gray.300"
                                        _hover={{ bg: "rgba(15,23,42,0.95)" }}
                                        onClick={() => handleChangePage(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        <Text display={{ base: "none", sm: "block" }}>Next</Text>
                                        <Text display={{ base: "block", sm: "none" }}>→</Text>
                                    </Button>
                                    <Button
                                        size={["xs", "sm"]}
                                        variant="outline"
                                        borderColor="rgba(148,163,184,0.6)"
                                        color="gray.300"
                                        _hover={{ bg: "rgba(15,23,42,0.95)" }}
                                        onClick={() => handleChangePage(totalPages)}
                                        disabled={currentPage === totalPages}
                                    >
                                        <Text display={{ base: "none", sm: "block" }}>Last</Text>
                                        <Text display={{ base: "block", sm: "none" }}>⇥</Text>
                                    </Button>
                                </HStack>
                            </Flex>
                        )}
                    </Box>
                </Box>
            </VStack>

            {/* Delete Confirmation Modal */}
            <Modal isOpen={isConfirmOpen} onClose={closeConfirmDialog}>
                <ModalOverlay bg="blackAlpha.700" sx={{ backdropFilter: "blur(6px)" }}/>
                <ModalContent
                    bg="rgba(15,23,42,0.98)"
                    borderWidth="1px"
                    borderColor="#ef4b6e"
                    width={["100%", "100%"]}
                    borderRadius={8}
                    padding={"10px"}
                    top={300}
                    // left={["25%", "25%"]}
                // left={500}
                >
                    <ModalHeader>
                        <Flex align="center" gap={2} color="white" pb={"10px"}>
                            <Trash2 size={20} color="#ef4b6e" />
                            <Text>Delete Member</Text>
                        </Flex>
                    </ModalHeader>
                    <ModalBody pb={"10px"}>
                        <Text color="gray.300" fontSize="sm">
                            Are you sure you want to delete this member? This action cannot be undone.
                        </Text>
                    </ModalBody>
                    <ModalFooter gap={3} flexWrap="wrap" pt={"20px"}>
                        <Button
                            flex={{ base: "1 1 100%", sm: "1" }}
                            bg="#ef4b6e"
                            color="white"
                            _hover={{ bg: "#ef4b6e", opacity: 0.9 }}
                            onClick={handleDeleteUser}
                        >
                            Delete
                        </Button>
                        <Button
                            flex={{ base: "1 1 100%", sm: "1" }}
                            variant="outline"
                            borderColor="rgba(148,163,184,0.6)"
                            color="gray.300"
                            _hover={{ bg: "rgba(15,23,42,0.95)" }}
                            onClick={closeConfirmDialog}
                        >
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
}
