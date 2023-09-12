import { Header } from "@components/Header";
import { useNavigation, useFocusEffect } from "@react-navigation/native"
import { Container } from "./styles";
import { Highlight } from "@components/Highlight";
import { GroupCard } from "@components/GroupCard";
import { useState, useCallback } from "react";
import { FlatList } from "react-native";
import { ListEmpty } from "@components/ListEmpty";
import { Button } from "@components/Button";
import { groupsGetAll } from "@storage/group/groupsGetAll";

export function Groups(){
  const [groups, setGroups] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const navigation = useNavigation()

  function handleNewGroup(){
    navigation.navigate('new')
  }

  async function fetchGroups(){
    try {
      setIsLoading(true)
      const data = await groupsGetAll()
      setGroups(data)
    } catch (error) {
      console.log(error);    
    }finally{
      setIsLoading(false)
    }
  }

  function handleOpenGroup(group: string){
    navigation.navigate("players", {group})
  }

  useFocusEffect(useCallback(()=>{
    fetchGroups()
  }, []))

  return (
    <Container>
      <Header />
      <Highlight 
        title="Turmas"
        subtitle="Jogue com sua turma"
      />
      <FlatList 
        data={groups}
        keyExtractor={item => item}
        renderItem={({item})=> (
          <GroupCard 
            title={item}
            onPress={()=>handleOpenGroup(item)}
          />
        )}
        contentContainerStyle={!groups.length && {flex: 1}}
        ListEmptyComponent={()=> (
          <ListEmpty 
            message="Nenhuma turma cadastrada ainda"
          />
        )}
      />
      <Button 
        title="Criar nova turma"
        onPress={handleNewGroup}
      />
    </Container>
  )
}