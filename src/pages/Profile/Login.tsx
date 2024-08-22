// src/pages/LoginForm.tsx
import React, { useState, useContext } from "react";
import {
  InputChangeEventDetail,
  InputCustomEvent,
  IonButton,
  IonContent,
  IonFooter,
  IonHeader,
  IonInput,
  IonInputPasswordToggle,
  IonNote,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { AuthContext } from "../../context/AuthProvider";
import { useHistory } from "react-router-dom";

const Login: React.FC = () => {
  const [inputValue, setInputValue] = useState("");
  const [isTouched, setIsTouched] = useState(false);
  const [isValid, setIsValid] = useState<boolean>();
  const [waitAuth, setWaitAuth] = useState<boolean>(false);
  const { authenticateWithPrivateKey } = useContext(AuthContext);
  const history = useHistory();

  const handleLogin = () => {
    setIsValid(undefined);
    if (inputValue.length < 63) {
      setIsValid(false);
      return;
    }
    setWaitAuth(true);
    try {
      authenticateWithPrivateKey(inputValue);
      history.push("/profile");
    } catch (error) {
      setIsValid(false);
      console.error(error);
    }
    setWaitAuth(false);
  };
  const handleChangeInput = (
    event: InputCustomEvent<InputChangeEventDetail>
  ) => {
    setInputValue(event.detail.value as string);
  };

  const markTouched = () => {
    setIsTouched(true);
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen={true} className="ion-padding ion-text-center">
        <h1>Log with your NOSTR keys</h1>
        <h3>Insert your Private Key to operate.</h3>
        <IonNote>
          You can type or paste your NOSTR private key or generate a new one
          below.
        </IonNote>
        <div className="ion-margin">
          <IonInput
            className={`${isValid && "ion-valid"} ${
              isValid === false && "ion-invalid"
            } ${isTouched && "ion-touched"}`}
            errorText="Invalid nsec or hex key"
            type="password"
            label="Insert your key"
            placeholder="nsec / hex private key"
            labelPlacement="stacked"
            fill="solid"
            counter={true}
            maxlength={64}
            onIonInput={handleChangeInput}
            onIonBlur={() => markTouched()}
          >
            <IonInputPasswordToggle slot="end"></IonInputPasswordToggle>
          </IonInput>
        </div>
        <div>
          <IonButton
            shape="round"
            disabled={!inputValue.length || waitAuth}
            onClick={handleLogin}
          >
            Login
          </IonButton>
        </div>
      </IonContent>
      <IonFooter className="ion-text-center ion-no-border">
        <IonToolbar>
          <IonText>
            <IonButton routerLink="/generate-key">Generate a new key</IonButton>
          </IonText>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default Login;
