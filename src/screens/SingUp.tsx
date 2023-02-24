import {
    Center,
    Heading,
    Image,
    ScrollView,
    Text,
    VStack,
    useToast
} from 'native-base';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';

import BackgroundImg from '@assets/background.png';
import LogoSvg from '@assets/logo.svg';
import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { signUpSchema } from '@schemas/signUpSchema';
import { api } from '@services/api';
import { AppError } from '@utils/appError';

type FormDataProps = {
  name: string;
  email: string;
  password: string;
  rePassword: string;
}

export function SingUp() {
    const toast = useToast();
    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm<FormDataProps>({
        resolver: yupResolver(signUpSchema)
    });
    const navigation = useNavigation();
    
    function handleGoBack() {
       navigation.goBack()
    }

    function handleSignUp({ name, email, password }: FormDataProps) {
        console.log(name, email, password);
        
        api.post('/users', { name, email, password })
            .then(() => {
                console.log("sucesso");
                
             })
            .catch((error) => {
                const isAppError = error instanceof AppError;

                const title = isAppError ?
                    error.message :
                    'Não foi possível criar a conta. Tente novamente mais tarde';

                toast.show({
                    title,
                    placement: 'top',
                    bgColor: 'red.500'
                })
            })
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
                        Crie sua Conta
                    </Heading>

                    <Controller 
                        control={control}
                        name="name"
                        render={({ field: { onChange, value } }) => (    
                            <Input
                                placeholder='Nome'
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.name?.message}
                            />
                        )}
                    />

                    <Controller 
                        control={control}
                        name="email"
                        render={({ field: { onChange, value } }) => (
                            <Input 
                                placeholder="E-mail" 
                                keyboardType="email-address"
                                autoCapitalize="none"
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.email?.message}
                            />
                        )}
                    />

                    <Controller 
                        control={control}
                        name="password"
                        render={({ field: { onChange, value } }) => (
                            <Input
                                placeholder='Senha'
                                secureTextEntry
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.password?.message}
                            />
                        )}
                    />
                    
                    <Controller 
                        control={control}
                        name="rePassword"
                        render={({ field: { onChange, value } }) => (
                            <Input
                                placeholder='Confirmar a Senha'
                                secureTextEntry
                                onChangeText={onChange}
                                value={value}
                                onSubmitEditing={handleSubmit(handleSignUp)}
                                returnKeyType="send"
                                errorMessage={errors.rePassword?.message}
                            />
                        )}
                    />

                    

                    <Button
                        title='Criar e acessar'
                        onPress={handleSubmit(handleSignUp)}
                    />
                </Center>

                <Button
                    title='Voltar para o login'
                    variant={"outline"}
                    mt={12}
                    onPress={handleGoBack}
                />
                
            </VStack>
        </ScrollView>
    )
}