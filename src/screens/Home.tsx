import { useState } from "react"
import { FlatList, HStack, Heading, Text, VStack } from "native-base"

import { Group } from "@components/Group"
import { HomeHeader } from "@components/HomeHeader"
import { ExerciseCard } from "@components/ExerciseCard"
import { useNavigation } from "@react-navigation/native"
import { AppNavigatorRoutesProps } from "@routes/app.routes"

export function Home() {
    const [groups, setGroups] = useState<string[]>(["Lombar", "Bíceps", "Dorsal", "Ombro", "Pernas"])
    const [exercises, setExercises] = useState(["Puxada frontal", "Remada curva", "Reamada unilateral", "Levantamento  terra"])
    const [groupSelected, setGroupSelected] = useState('Lombar')

    const { navigate } = useNavigation<AppNavigatorRoutesProps>();

    function handleOpenExercisedetails() {
        navigate('exercise')
    }

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

            <VStack flex={1} px={8}>

                <HStack justifyContent={"space-between"}>
                    <Heading color={"gray.200"} fontSize={"md"}>
                        Exercicios
                    </Heading>
                    
                    <Text color={"gray.200"} fontSize={"sm"}>
                        {exercises.length}
                    </Text>
                </HStack>

                <FlatList
                    data={exercises}
                    keyExtractor={item => item}
                    showsVerticalScrollIndicator={false}
                    _contentContainerStyle={{ paddingBottom: 20 }}
                    renderItem={
                        ({item}) => (
                            <ExerciseCard
                                onPress={handleOpenExercisedetails}
                            />
                        )
                    }
                />
                
            </VStack>
            
        </VStack>
    )
    
}