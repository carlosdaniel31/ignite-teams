import AsyncStorage from "@react-native-async-storage/async-storage"
import { playersGetByGroup } from "./playersGetByGroup"
import { PLAYER_COLLECTION } from "@storage/storageConfig"

export async function playerRemoveByGroup(playerName: string, group: string){
  try {
    const storage = await playersGetByGroup(group)
    const filtered = storage.filter(player => player.name !== playerName)
    const players = JSON.stringify(filtered)

    await AsyncStorage.setItem(`${PLAYER_COLLECTION}-${group}`, players)
  } catch (error) {
    throw error
  }
}