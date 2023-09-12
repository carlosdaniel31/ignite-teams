import { Header } from "@components/Header";
import { Alert } from "react-native"
import { useState } from "react"
import { Container, Content, Icon } from "./styles";
import { Highlight } from "@components/Highlight";
import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { useNavigation } from "@react-navigation/native";
import { groupCreate } from "@storage/group/groupCreate";
import { AppError } from "@utils/AppError";

export function NewGroup(){
  const navigation = useNavigation()
  const [group, setGroup] = useState("")

  async function handleNew(){
   try {
    if(!group.trim().length){
      return Alert.alert("Novo Grupo", "Informe o nome da turma")
    }
    await groupCreate(group)
    navigation.navigate("players", {group})
    
   } catch (error) {
    if(error instanceof AppError){
      Alert.alert("Novo grupo", error.message)
    }else {
      Alert.alert("Novo grupo", "Não foi possível criar uma nova turma")
    }
   }
  }

  return (
    <Container>
      <Header showBackButton/>
      <Content>
       <Icon />
       <Highlight 
        title="Nova turma"
        subtitle="Cria uma turma para adicionar pessoas"
       />
       <Input 
        placeholder="Nova turma"
        onChangeText={setGroup}
       />
       <Button 
        title="Criar"
        onPress={handleNew}
       />
      </Content>
    </Container>
  )
}