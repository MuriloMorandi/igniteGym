import { Box, HStack, Heading, Icon, Image, ScrollView, Text, VStack, useToast } from "native-base"
import { TouchableOpacity } from "react-native"
import { Feather } from '@expo/vector-icons'
import { useNavigation, useRoute } from "@react-navigation/native"

import BodySvg from "@assets/body.svg"
import RepetitionsSvg from '@assets/repetitions.svg';
import SeriesSvg from '@assets/series.svg';
import { Button } from '@components/Button';
import { ExerciseDTO } from "@dtos/ExerciseDTO"
import { AppNavigatorRoutesProps } from "@routes/app.routes"
import { api } from "@services/api"
import { AppError } from "@utils/appError"
import { useEffect, useState } from "react"
import { Loading } from "@components/Loading"

type RouteParamsProps = {
    exerciseId: string   
}

export function Exercise() {
    const [sendingRegister, setSendingRegister] = useState(false);
    const [exercise, setExercise] = useState<ExerciseDTO>({} as ExerciseDTO)
    const [isLoading, setIsLoading] = useState(true)
    const { goBack, navigate } = useNavigation<AppNavigatorRoutesProps>()
    
    const route = useRoute()
    const { exerciseId } = route.params as RouteParamsProps;

    const toast = useToast();

    async function fetchExerciseDetails() {
        try
        {
            setIsLoading(true);
            const response = await api.get(`/exercises/${exerciseId}`);
            setExercise(response.data)

        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ?
                error.message :
                'Não foi possível carregar os detalhes do exercício.';

            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            })
        }
        finally
        {
            setIsLoading(false);
        }
    }
    
    function handleGoBack() {
        goBack()
    }

    async function handleExerciseHistoryRegister() {
        try {
          setSendingRegister(true);

          await api.post('/history', { exercise_id: exerciseId });

          toast.show({
            title: 'Parabéns! Exercício registrado no seu histórico.',
            placement: 'top',
            bgColor: 'green.500'
          });

          navigate('history');
        }
        catch (error){
          const isAppError = error instanceof AppError;
          const title = isAppError ? error.message : 'Não foi possível registrar exercício.';

          toast.show({
            title,
            placement: 'top',
            bgColor: 'red.500'
          })

        }
        finally{
          setSendingRegister(false);
        }
    }

    useEffect(() => {
        fetchExerciseDetails()
    }, [exerciseId])

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
                            {exercise.name}
                        </Heading>

                        <HStack alignItems={"center"}>
                            <BodySvg/>
                            <Text
                                color={"gray.200"}
                                ml={1}
                                textTransform={"capitalize"}>
                                    {exercise.group}
                            </Text>
                        </HStack>
                    
                    </HStack>

                </VStack>

                {isLoading ?
                    <Loading/>
                :
                    <VStack p={8}>
                        <Box
                            rounded={"lg"}
                            mb={3}
                            overflow={"hidden"}
                        >
                            <Image
                                w={"full"}
                                h={80}
                                source={{
                                    uri: `${api.defaults.baseURL}/exercise/demo/${exercise.demo}`
                                }}
                                alt={exercise.name}
                                resizeMode={"cover"}
                                
                            />
                        </Box>
                    
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
                                    {exercise.series} séries
                                    </Text>
                                </HStack>

                                <HStack>
                                    <RepetitionsSvg />
                                    <Text color="gray.200" ml="2">
                                    {exercise.repetitions} repetições
                                    </Text>
                                </HStack>
                            </HStack>

                            <Button 
                                title="Marcar como realizado"
                                isLoading={sendingRegister}
                                onPress={handleExerciseHistoryRegister}
                            />
                        </Box>
                    
                    </VStack>
                }
            </ScrollView>
        </VStack>
    )
    
}