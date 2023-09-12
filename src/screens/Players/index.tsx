import { FlatList, Alert } from "react-native";
import { useEffect, useState, useRef } from "react";
import { Header } from "@components/Header";
import { Highlight } from "@components/Highlight";
import { ButtonIcon } from "@components/ButtonIcon";
import { Input } from "@components/Input";
import { Filter } from "@components/Filter";
import { Container, Form, HeaderList, NumbersOfPlayers } from "./styles";
import { PlayerCard } from "@components/PlayerCard";
import { ListEmpty } from "@components/ListEmpty";
import { Button } from "@components/Button";
import { useRoute, useNavigation } from "@react-navigation/native";
import { AppError } from "@utils/AppError";
import { playerAddByGroup } from "@storage/player/playerAddByGroup";
import { playeresGetByGroupAndTeam } from "@storage/player/playersGetByGroupAndTeam";
import { PlayerStorageDTO } from "@storage/player/PlayerStorageDTO";
import { TextInput } from "react-native";
import { playerRemoveByGroup } from "@storage/player/playerRemoveByGroup";
import { groupRemoveByName } from "@storage/group/groupRemoveByName";

type RouteParams = {
  group: string
}

export function Players(){
  const [team, setTeam] = useState("Time A")
  const [newPlayerName, setNewPlayerName] = useState("")
  const [players, setPlayers] = useState<PlayerStorageDTO[]>([])
  const navigation = useNavigation()
  const route = useRoute()
  const { group } = route.params as RouteParams

  const newPlayerNameInputRef = useRef<TextInput>(null)

  async function handleAddPlayer(){
    if(!newPlayerName.trim().length){
      return Alert.alert("Nova pessoa", "Informe um nome")
    }

    const newPlayer = {
      name: newPlayerName,
      team
    }

    try {
      await playerAddByGroup(newPlayer, group)
      fetchPlayersByTeam()
      newPlayerNameInputRef.current?.blur()
      setNewPlayerName("")
      // const players = await playersGetByGroup(group)
      // console.log(players);  
    } catch (error) {
      if(error instanceof AppError){
        Alert.alert("Nova Pessoa", error.message)
      }else{
        console.log(error);
        Alert.alert("Nova Pessoa", "Não foi possível adicionar")
      }
    }
  }

  async function fetchPlayersByTeam(){
    try {
      const playersByTeam = await playeresGetByGroupAndTeam(group, team)
      setPlayers(playersByTeam)
    } catch (error) {
      Alert.alert("Pesssoas", "Não foi possível carregar")
    }
  }

  async function handlePlayerRemove(playerName: string){
    try {
      await playerRemoveByGroup(playerName, group)
      fetchPlayersByTeam()
    } catch (error) {
      Alert.alert("Remover pessoa", "Não foi possível remover")
    }
  }

  async function groupRemove(){
    try {
      await groupRemoveByName(group)
      navigation.navigate("groups")
    } catch (error) {
      Alert.alert("Remover grupo", "Não foi possível remover")
    }
  }

  async function handleGroupRemove(){
    Alert.alert(
      "Remover",
      "Deseja remover esse grupo?",
      [
        {text: "Não", style: "cancel"},
        {text: "Sim", onPress: ()=> groupRemove()}
      ]
    )
  }
  
  useEffect(()=> {
    fetchPlayersByTeam()
  },[team])

  return (
    <Container>
      <Header showBackButton/>
      <Highlight 
        title={group}
        subtitle="Adicione a galera e separe os times"
      />
      <Form>
        <Input 
          inputRef = {newPlayerNameInputRef}
          placeholder="Nome da pessoa"
          autoCorrect={false}
          onChangeText={setNewPlayerName}
          value={newPlayerName}
          onSubmitEditing={handleAddPlayer}
          returnKeyType="done"
        />
        <ButtonIcon 
          icon="add"
          onPress={handleAddPlayer}
        />
      </Form>
      <HeaderList>
        <FlatList 
          data={["Time A", "Time B"]}
          keyExtractor={item => item}
          renderItem={({item})=>(
            <Filter 
              title={item}
              isActive={item === team}
              onPress={()=> setTeam(item)}
            />
          )}
          horizontal
        />
        <NumbersOfPlayers>
          {players.length}
        </NumbersOfPlayers>
      </HeaderList>
      <FlatList 
        data={players}
        keyExtractor={item => item.name}
        renderItem={({item})=> (
          <PlayerCard 
            name={item.name}
            onRemove={()=> handlePlayerRemove(item.name)}
          />
        )}
        ListEmptyComponent={()=>(
          <ListEmpty 
            message="Não há ninguém nesse time"
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          {paddingBottom: 100},
          !players.length && {flex: 1}
        ]}
      />
      <Button 
        title="Remover turma"
        type="SECONDARY"
        onPress={handleGroupRemove}
      />
    </Container>
  )
}