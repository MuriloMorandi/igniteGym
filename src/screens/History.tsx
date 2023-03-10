import { HistoryCard } from "@components/HistoryCard"
import { ScreenHeader } from "@components/ScreenHeader"
import {  Heading, SectionList, Text, VStack } from "native-base"
import { useState } from "react"

export function History() {
    const [exercises, setExercises] = useState([
        {
            title: '07.02.2022',
            data:["Puxada frontal", "Reamada unilateral"]
        },
        {
            title: '08.02.2022',
            data:["Puxada frontal"]
        }
    ])

    return (
        <VStack flex={1}>
            <ScreenHeader title="Histórico de exercícios" />
            
             <SectionList
                sections={exercises}
                keyExtractor={item => item}
                renderItem={({ item }) => (
                    <HistoryCard/>
                )}
                renderSectionHeader={({ section }) => (
                    <Heading
                        color={"gray.200"}
                        fontSize={"md"}
                        fontFamily={"heading"}
                        mt={10}
                        mb={3}
                    >
                        {section.title}
                    </Heading>
                )}
                ListEmptyComponent={() => (
                    <Text color={"gray.100"} textAlign={"center"}>
                        Não há exercícios registrados ainda.{'\n'}
                        Vamos malhar hoje?
                    </Text>  
                )}
                contentContainerStyle={
                    !exercises.length && {
                        flex: 1,
                        justifyContent:"center"
                    }
                }
                px={8}
            />
        </VStack>   
    )
    
}