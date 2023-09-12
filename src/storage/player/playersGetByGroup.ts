import AsyncStorage from "@react-native-async-storage/async-storage";
import { PlayerStorageDTO } from "./PlayerStorageDTO";
import { PLAYER_COLLECTION } from "@storage/storageConfig";

export async function playersGetByGroup(group: string){
  try {
    const storage = await AsyncStorage.getItem(`${PLAYER_COLLECTION}-${group}`)
    const players: PlayerStorageDTO[] = storage ? JSON.parse(storage) : []
    return players
  } catch (error) {
    throw error
  }
}