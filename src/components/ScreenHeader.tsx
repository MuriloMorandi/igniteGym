import { Heading, VStack } from "native-base";

interface ScreenHeaderProps{
    title: string
}

export function ScreenHeader({ title }: ScreenHeaderProps) {
    return (
        <VStack bg={"gray.600"} pb={6}  pt={16} alignItems={"center"}>
            <Heading
                color={"gray.100"}
                fontSize={"xl"}
                fontFamily={"heading"}
            >
                {title}
            </Heading>
        </VStack>
    )
}