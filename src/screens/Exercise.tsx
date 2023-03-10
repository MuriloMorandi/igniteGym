import { Box, HStack, Heading, Icon, Image, ScrollView, Text, VStack } from "native-base"
import { TouchableOpacity } from "react-native"
import { Feather } from '@expo/vector-icons'
import { useNavigation } from "@react-navigation/native"

import { AppNavigatorRoutesProps } from "@routes/app.routes"
import { Button } from '@components/Button';

import BodySvg from "@assets/body.svg"
import SeriesSvg from '@assets/series.svg';
import RepetitionsSvg from '@assets/repetitions.svg';

export function Exercise() {
    const {goBack} = useNavigation<AppNavigatorRoutesProps>()

    function handleGoBack() {
        goBack()
    }

    return (
        <VStack flex={1}>
            <ScrollView>
                <VStack px={8} bg="gray.600" pt={12}>
                    <TouchableOpacity onPress={handleGoBack}>
                        <Icon
                            as={Feather}
                            name="arrow-left"
                            color={"green.400"}
                            size={6}
                        />
                        
                    </TouchableOpacity>

                    <HStack
                        justifyContent={"space-between"}
                        mt={4}
                        alignItems={"center"}
                    >
                        <Heading
                            color={"gray.100"}
                            fontSize={"lg"}
                            fontFamily={"heading"}
                            flexShrink={1}
                        >
                            Puxada Frontal
                        </Heading>

                        <HStack alignItems={"center"}>
                            <BodySvg/>
                            <Text
                                color={"gray.200"}
                                ml={1}
                                textTransform={"capitalize"}>
                                    Costa
                            </Text>
                        </HStack>
                    
                    </HStack>

                </VStack>

                <VStack p={8}>
                    <Image
                    w={"full"}
                    h={80}
                    source={{ uri: 'http://conteudo.imguol.com.br/c/entretenimento/0c/2019/12/03/remada-unilateral-com-halteres-1575402100538_v2_600x600.jpg' }}
                    alt={"Nome do exerc??cio"}
                    mb={3}
                    resizeMode={"cover"}
                    rounded={"lg"}
                    />

                    <Box
                        bg={"gray.600"}
                        rounded={"md"}
                        pb={4}
                        px={4}
                    >
                        <HStack
                            alignItems={"center"}
                            justifyContent={"space-around"}
                            mb={6}
                            mt={5}
                        >
                        <HStack>
                            <SeriesSvg />
                            <Text color={"gray.200"} ml={2}>
                            3 s??ries
                            </Text>
                        </HStack>

                        <HStack>
                            <RepetitionsSvg />
                            <Text color="gray.200" ml="2">
                            12 repeti????es
                            </Text>
                        </HStack>
                        </HStack>

                        <Button 
                        title="Marcar como realizado"
                        />
                    </Box>
                    
                </VStack>
            </ScrollView>
        </VStack>
    )
    
}