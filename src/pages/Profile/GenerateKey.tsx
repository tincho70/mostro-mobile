// src/pages/GenerateKey.tsx
import React, { useState, useContext, useEffect } from "react";
import {
  IonPage,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonInput,
  IonCheckbox,
  IonFooter,
  IonIcon,
  IonItem,
  IonList,
  IonNote,
  IonText,
  IonToast,
} from "@ionic/react";
import { AuthContext } from "../../context/AuthProvider";
import { useHistory } from "react-router-dom";
import { generateSecretKey, getPublicKey, nip19 } from "nostr-tools";
import { copyOutline } from "ionicons/icons";
import { truncateText } from "../../utils";

const GenerateKey: React.FC = () => {
  const { authenticateWithPrivateKey } = useContext(AuthContext);
  const history = useHistory();

  const [nsec, setNsec] = useState<string>("");
  const [npub, setNpub] = useState<string>("");
  const [savedKeys, setSavedKeys] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);

  const handleLogin = () => {
    authenticateWithPrivateKey(nsec);
    history.push("/profile");
  };

  const handleSavedKeys = (event: CustomEvent): void => {
    setSavedKeys(event.detail.checked);
  };

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value).then(() => {
      setShowToast(true);
    });
  };

  useEffect(() => {
    const sk = generateSecretKey();
    const pk = getPublicKey(sk);
    setNsec(nip19.nsecEncode(sk));
    setNpub(nip19.npubEncode(pk));
  }, [nip19]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Generate a new key</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen={true} className="ion-padding ion-text-center">
        <h2>
          <IonText className="ion-color-warning">Save your keys!</IonText>
        </h2>
        <IonList className="ion-margin" lines="none">
          <IonItem>
            <IonInput
              label="Your NOSTR public key"
              labelPlacement="stacked"
              fill="solid"
              readonly={true}
              value={truncateText(npub, 25)}
              onClick={() => handleCopy(npub)}
            >
              <IonIcon
                slot="end"
                icon={copyOutline}
                aria-hidden="true"
              ></IonIcon>
            </IonInput>
          </IonItem>
          <IonItem>
            <IonInput
              label="Your NOSTR private key"
              labelPlacement="stacked"
              fill="solid"
              readonly={true}
              value={truncateText(nsec, 25)}
              onClick={() => handleCopy(nsec)}
            >
              <IonIcon
                slot="end"
                icon={copyOutline}
                aria-hidden="true"
              ></IonIcon>
            </IonInput>
          </IonItem>
        </IonList>
        <IonNote>
          Your private key is like your password. Copy and keep it in a safe
          place. There is no way to reset it.
        </IonNote>
      </IonContent>
      <IonFooter className="ion-no-border">
        <IonItem lines="none">
          <IonCheckbox
            slot="start"
            labelPlacement="end"
            onIonChange={handleSavedKeys}
          >
            I have saved my keys
          </IonCheckbox>
          <IonButton
            size="default"
            shape="round"
            disabled={!savedKeys}
            onClick={handleLogin}
            slot="end"
          >
            Login
          </IonButton>
        </IonItem>
      </IonFooter>
      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={`Copied`}
        duration={2000}
      />
    </IonPage>
  );
};

export default GenerateKey;
