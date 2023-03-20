import { useCallback, useState } from "react"
import {  Heading, SectionList, Text, VStack, useToast } from "native-base"
import { useFocusEffect } from "@react-navigation/native";

import { HistoryCard } from "@components/HistoryCard"
import { ScreenHeader } from "@components/ScreenHeader"
import { Loading } from '@components/Loading';
import { HistoryByDayDTO } from "@dtos/HistoryByDayDTO";
import { api } from "@services/api";
import { AppError } from "@utils/appError";

export function History() {
    const [isLoading, setIsLoading] = useState(true);
    const [exercises, setExercises] = useState<HistoryByDayDTO[]>([])

    const toast = useToast();

    async function fetchHistory() {
      try {
        setIsLoading(true);
        const response = await api.get('/history');

        setExercises(response.data);

      } catch (error) {
        const isAppError = error instanceof AppError;
        const title = isAppError ? error.message : 'Não foi possível carregar os detalhes do exercício';

        toast.show({
          title,
          placement: 'top',
          bgColor: 'red.500'
        });
      } finally {
        setIsLoading(false);
      }
    }

    useFocusEffect(
      useCallback(() => {
        fetchHistory()
      },[])
    )
    return (
        <VStack flex={1}>
            <ScreenHeader title="Histórico de exercícios" />
              {isLoading ?
                <Loading />
                  :
                <SectionList
                  sections={exercises}
                  keyExtractor={item => item.id}
                  renderItem={({ item }) => (
                      <HistoryCard data={item}/>
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
              }
        </VStack>   
    )
    
}