"use client";

import { Flex, Spinner } from "@chakra-ui/react";

export default function FullScreenLoader() {
    return (
        <Flex
            position="fixed"
            top="0"
            left="0"
            right="0"
            bottom="0"
            bg="blackAlpha.700"
            align="center"
            justify="center"
            zIndex="9999"
        >
            <Spinner
                size="xl"
                color="primary"
            />
        </Flex>
    );
}
