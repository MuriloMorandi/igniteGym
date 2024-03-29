import { useCallback, useEffect, useState } from "react"
import { FlatList, HStack, Heading, Text, VStack, useToast } from "native-base"

import { Group } from "@components/Group"
import { HomeHeader } from "@components/HomeHeader"
import { ExerciseCard } from "@components/ExerciseCard"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import { AppNavigatorRoutesProps } from "@routes/app.routes"
import { api } from "@services/api"
import { AppError } from "@utils/appError"
import { ExerciseDTO } from "@dtos/ExerciseDTO"
import { Loading } from "@components/Loading"

export function Home() {
    const [isLoading, setIsLoading] = useState(true);
    const [groups, setGroups] = useState<string[]>([])
    const [exercises, setExercises] = useState<ExerciseDTO[]>([])
    const [groupSelected, setGroupSelected] = useState('antebraço')

    const toast = useToast();
    const { navigate } = useNavigation<AppNavigatorRoutesProps>();

    function handleOpenExercisedetails(exerciseId: string) {
        navigate('exercise', { exerciseId })
    }

    async function fetchGroups() {
        try {
            const response = await api.get('/groups');
            setGroups(response.data);

        } catch (error) {
            const isAppError = error instanceof AppError;
                const title = isAppError ?
                    error.message :
                    'Não foi possível carregar os grupos musculares';

            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            })
        }
    }

    async function fecthExercisesByGroup() {
        try
        {
            setIsLoading(true);
            const response = await api.get(`/exercises/bygroup/${groupSelected}`);
            setExercises(response.data);

        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ?
                error.message :
                'Não foi possível carregar os exercícios';

            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            })
        }finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchGroups();
    })

    useFocusEffect(
        useCallback(() => {
            fecthExercisesByGroup()
        }, [groupSelected])
    )

    return (
        <VStack flex={1}>
            <HomeHeader />

            <FlatList
                data={groups}
                keyExtractor={item => item}
                horizontal
                showsHorizontalScrollIndicator={false}
                _contentContainerStyle={{ px: 8 }}
                my={10}
                maxH={10}
                minH={10}
                renderItem={({ item }) => (
                    <Group 
                        name={item} 
                        isActive={groupSelected === item} 
                        onPress={() => setGroupSelected(item)}
                    />
                )}
            />

            {isLoading ?
                <Loading /> :
                <VStack flex={1} px={8}>

                    <HStack justifyContent={"space-between"}>
                        <Heading
                            color={"gray.200"}
                            fontSize={"md"}
                            fontFamily="heading"
                        >
                            Exercicios
                        </Heading>
                        
                        <Text color={"gray.200"} fontSize={"sm"}>
                            {exercises.length}
                        </Text>
                    </HStack>

                    <FlatList
                        data={exercises}
                        keyExtractor={item => item.id}
                        showsVerticalScrollIndicator={false}
                        _contentContainerStyle={{ paddingBottom: 20 }}
                        renderItem={
                            ({item}) => (
                                <ExerciseCard
                                    onPress={() =>handleOpenExercisedetails(item.id)}
                                    data={item}
                                />
                            )
                        }
                    />
                
                </VStack>
            }
            
        </VStack>
    )
    
}