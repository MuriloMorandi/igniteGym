import { useState } from "react";
import { TouchableOpacity } from "react-native";
import {
    Center,
    Heading,
    ScrollView,
    Skeleton,
    Text,
    VStack,
    useToast
} from "native-base"
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system';

import { ScreenHeader } from "@components/ScreenHeader"
import { UserPhoto } from "@components/UserPhoto"
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { useAuth } from "@hooks/useAuth";
import { profileSchema } from "@schemas/profileSchema";
import { api } from "@services/api";
import { AppError } from "@utils/appError";

type FormDataProps = {
  name: string;
  email: string;
  old_password: string;
  password: string;
  rePassword: string;
}

export function Profile() {
    const [isUpdating, setIsUpdating] = useState(false);
    const [photoIsLoading, setPhotoIsLoading] = useState(false);
    const [userPhoto, setUserPhoto] = useState('https://github.com/murilomorandi.png')

    const { user, updateUserProfile } = useAuth();
    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm<FormDataProps>(
        {
            defaultValues: { 
                name: user.name,
                email: user.email
            },
            resolver: yupResolver(profileSchema) 
        }
    );

    const photoSize = 33;

    const toast = useToast();

    async function handleUserPhotoSelect() {
        setPhotoIsLoading(true)
        try{
            const photoSelected = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
            aspect: [4, 4],
            allowsEditing: true,
            });

        
            if (!photoSelected.canceled){
                const photoInfo = await FileSystem.getInfoAsync(photoSelected.assets[0].uri);
                
                if (photoInfo.size &&
                    (photoInfo.size / 1024 / 1024) > 5)
                {
                    return toast.show({
                        title: "Essa image é muito grande. Escolha uma de até 5MB. ",
                        placement: 'top',
                        bgColor: 'red.500'
                    })
                }

                setUserPhoto(photoSelected.assets[0].uri);
            }
            
        }catch(error){
            console.log(error)
        }
        finally
        {
            setPhotoIsLoading(false);
        }
    }

    async function handleProfileUpdate(data: FormDataProps) {
        try {
            setIsUpdating(true);

            const userUpdated = user;
            userUpdated.name = data.name;
            console.log(data);
            
            await api.put('/users', data);
            await updateUserProfile(userUpdated);
            
            toast.show({
                title: 'Perfil atualizado com sucesso!',
                placement: 'top',
                bgColor: 'green.500'
            });
        } catch (error) {
          const isAppError = error instanceof AppError;
            const title = isAppError ?
                error.message :
                'Não foi possível atualizar os dados. Tente novamente mais tarde.';

          toast.show({
            title,
            placement: 'top',
            bgColor: 'red.500'
          })
        } finally {
          setIsUpdating(false);
        }
    }
    
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
                            source={{ uri:userPhoto }}
                            alt={"Foto do usuário"}
                            size={photoSize}
                        />
                    }
                    
                    <TouchableOpacity onPress={handleUserPhotoSelect}>
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

                    <Controller 
                        control={control}
                        name="name"
                        render={({ field: { value, onChange } }) => (
                          <Input 
                            bg="gray.600" 
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
                        render={({ field: { value, onChange } }) => (
                            <Input 
                                bg="gray.600" 
                                placeholder="E-mail"
                                isDisabled
                                onChangeText={onChange}
                                value={value}
                            />
                        )}
                    />
                    
                    <Heading
                        color={"gray.200"}
                        fontSize={"md"}
                        fontFamily={"heading"}
                        alignSelf={"flex-start"}
                        mb={2}
                        mt={12}
                    >
                        Alterar senha
                    </Heading>
                    
                    <Controller 
                        control={control}
                        name="old_password"
                        render={({ field: { onChange } }) => (
                            <Input 
                                bg="gray.600"
                                placeholder="Senha antiga"
                                secureTextEntry
                                onChangeText={onChange}
                            />
                        )}
                    />

                    <Controller 
                        control={control}
                        name="password"
                        render={({ field: { onChange } }) => (
                            <Input 
                                bg="gray.600"
                                placeholder="Nova senha"
                                secureTextEntry
                                onChangeText={onChange}
                                errorMessage={errors.password?.message}
                            />
                        )}
                    />

                    <Controller 
                        control={control}
                        name="rePassword"
                        render={({ field: { onChange } }) => (
                            <Input 
                                bg="gray.600"
                                placeholder="Confirme a nova senha"
                                secureTextEntry
                                onChangeText={onChange}
                                errorMessage={errors.rePassword?.message}
                            />
                      )}
                    />
                    
                    <Button 
                        title="Atualizar" 
                        mt={4} 
                        onPress={handleSubmit(handleProfileUpdate)}
                        isLoading={isUpdating}
                    />

                
                </Center>

            </ScrollView>
        </VStack>
    )
    
}