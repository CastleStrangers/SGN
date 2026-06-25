import * as Notifications from "expo-notifications";
import { registerPushToken } from "./news";
import { Platform } from "react-native";
import * as Device from "expo-device";

export async function requestAndRegisterPush() {
  if (!Device.isDevice) {
    console.log("Must use physical device for Push Notifications");
    return;
  }

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("Failed to get push token for push notification!");
      return;
    }

    const token = (await Notifications.getExpoPushTokenAsync({
      projectId: "e4e17603-f746-472c-80b4-2dd9a483cd53"
    })).data;

    await registerPushToken(token);
    console.log("Push token registered:", token);

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }
  } catch (e) {
    console.error("Error registering push token", e);
  }
}
