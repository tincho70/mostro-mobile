// src/pages/Profile.tsx
import React, { useContext } from "react";
import {
  IonPage,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonLoading,
  IonFooter,
  IonText,
} from "@ionic/react";
import { AuthContext } from "../../context/AuthProvider";
import Login from "./Login";
import { truncateText } from "../../utils";

const Profile: React.FC = () => {
  const { npub, loading, logout } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await logout();
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <IonPage>
        <IonContent fullscreen>
          <IonLoading isOpen={loading} message="Loading..." />
        </IonContent>
      </IonPage>
    );
  }

  if (!npub) return <Login />;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen={true} className="ion-padding ion-text-center">
        <IonText>{truncateText(npub, 30)}</IonText>
      </IonContent>
      <IonFooter className="ion-text-center ion-no-border">
        <IonToolbar>
          <IonButton shape="round" disabled={loading} onClick={handleLogout}>
            Logout
          </IonButton>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default Profile;
