import { Center, Heading, Image, ScrollView, Text, VStack } from 'native-base'
import { useNavigation } from '@react-navigation/native'

import LogoSvg from '@assets/logo.svg'
import BackgroundImg from '@assets/background.png'
import { Input } from '@components/Input'
import { Button } from '@components/Button'
import { AuthNavigatorRoutesProps } from '@routes/auth.routes'

export function SingIn() {
    const navigation = useNavigation<AuthNavigatorRoutesProps>();

    function handleNewAccount() {
        navigation.navigate("singUp")
    }

    return (
        <ScrollView 
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
        >
            <VStack flex={1} px={10} pb={16}>
                <Image
                    source={BackgroundImg}
                    defaultSource={BackgroundImg}
                    alt={"Pessoas treinando"}
                    resizeMode='contain'
                    position={"absolute"}
                />

                <Center my={24}>
                    <LogoSvg />
                    
                    <Text color={"gray.100"} fontSize={"sm"}>
                        Treine sua mente e o seu corpo
                    </Text>
                </Center>

                <Center>
                    <Heading
                        color={"gray.100"}
                        fontSize={"xl"}
                        mb={6}
                        fontFamily={"heading"}
                        >
                        Acesse sua conta
                    </Heading>

                    <Input
                        placeholder='Email'
                        keyboardType='email-address'
                        autoCapitalize='none'
                    />

                    <Input
                        placeholder='Senha'
                        secureTextEntry
                    />

                    <Button title='Acessar'/>
                </Center>

                <Center mt={24}>

                    <Text
                        color={"gray.100"}
                        fontSize={"md"}
                        mb={3}
                        fontFamily={"body"}
                    >
                        Ainda Não tem acesso?
                    </Text>

                    <Button
                        title='Acessar'
                        variant={"outline"}
                        onPress={handleNewAccount}
                    />
                </Center>
            </VStack>
        </ScrollView>
    )
}