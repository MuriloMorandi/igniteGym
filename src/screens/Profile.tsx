import {
    Center,
    Heading,
    ScrollView,
    Skeleton,
    Text,
    VStack
} from "native-base"

import { ScreenHeader } from "@components/ScreenHeader"
import { UserPhoto } from "@components/UserPhoto"
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { Input } from "@components/Input";
import { Button } from "@components/Button";

export function Profile() {
    const [photoIsLoading, setPhotoIsLoading] = useState(true);
    const photoSize = 33;

    return (
        <VStack flex={1}>
            <ScreenHeader title="Perfil " />

            <ScrollView contentContainerStyle={{ paddingBottom: 36}}>
                <Center mt={6} px={10}>
                    {photoIsLoading ?
                        <Skeleton
                            w={photoSize}
                            h={photoSize}
                            rounded={"full"}
                            startColor={"gray.500"}
                            endColor={"gray.400"}
                        />
                        :
                        <UserPhoto
                            source={{ uri: 'https://github.com/murilomorandi.png'}}
                            alt={"Foto do usuário"}
                            size={photoSize}
                        />
                    }
                    
                    <TouchableOpacity>
                        <Text
                            color={"green.500"}
                            fontWeight={"bold"}
                            fontSize={"md"}
                            mt={2}
                            mb={6}
                        >
                            Alterar foto
                        </Text>

                    </TouchableOpacity>

                    <Input
                        placeholder="Nome"
                        bg={"gray.600"}
                    />
                    
                    <Input
                        placeholder="Email"
                        bg={"gray.600"}
                        isDisabled
                    />
                    
                    <Heading
                        color={"gray.200"}
                        fontSize={"md"}
                        alignSelf={"flex-start"}
                        mb={2}
                        mt={12}
                    >
                        Alterar senha
                    </Heading>
                    
                    <Input
                        placeholder="Senha antiga"
                        bg={"gray.600"}
                        secureTextEntry
                    />

                    <Input
                        placeholder="Nova senha"
                        bg={"gray.600"}
                        secureTextEntry
                    />

                    <Input
                        placeholder="Confirmar senha nova"
                        bg={"gray.600"}
                        secureTextEntry
                    />
                    
                    <Button
                        title="Atualizar"
                        mt={4}
                    />

                
                </Center>

            </ScrollView>
        </VStack>
    )
    
}