import React, { useState, useEffect } from "react";
import { Feather as Icon } from "@expo/vector-icons";
import {
  View,
  ImageBackground,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import api from "../../services/api";
import RNPickerSelect from "react-native-picker-select";
import axios from "axios";

interface IBGEUFResponse {
  sigla: string;
  nome: string;
}

interface IBGECityResponse {
  nome: string;
}

interface PickerItem {
  label: string;
  value: string;
}

const Home = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ufs, setUfs] = useState<PickerItem[]>([]);
  const [cities, setCities] = useState<PickerItem[]>([]);
  const [selectedUf, setSelectedUf] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  const navigation = useNavigation();

  async function handleNavigateToPoints() {
    try {
      const user = await api.get(`users/${email}/${password}`);

      navigation.navigate("Points", {
        selectedUf,
        selectedCity,
        user_id: user.data.user.id,
      });
    } catch (error) {
      Alert.alert("Erro", "E-mail ou senha inválidas. Tente novamente.");
    }
  }

  function handleNavigateToCreateAccount() {
    navigation.navigate("CreateAccount");
  }

  useEffect(() => {
    axios
      .get<IBGEUFResponse[]>(
        "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome"
      )
      .then((response) => {
        const ufInitials = response.data.map((uf) => ({
          label: uf.nome,
          value: uf.sigla,
        }));
        setUfs(ufInitials);
      });
  }, []);

  useEffect(() => {
    if (selectedUf === null) return;

    axios
      .get<IBGECityResponse[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`
      )
      .then((response) => {
        const cityNames = response.data.map((city) => ({
          label: city.nome,
          value: city.nome,
        }));
        setCities(cityNames);
      });
  }, [selectedUf]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ImageBackground
        source={require("../../assets/home-background.png")}
        style={styles.container}
        imageStyle={{ width: 274, height: 368 }}
      >
        <View style={styles.main}>
          <View>
            <Text style={styles.title}>
              Seu marketplace de coleta de resíduos
            </Text>
            <Text style={styles.description}>
              Ajudamos pessoas a encontrarem pontos de coleta de forma
              eficiente.
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <TextInput
            style={styles.input}
            placeholder="Digite o e-mail"
            value={email}
            autoCorrect={false}
            onChangeText={setEmail}
          />

          <TextInput
            secureTextEntry
            style={styles.input}
            placeholder="Digite a senha"
            value={password}
            autoCorrect={false}
            onChangeText={setPassword}
          />

          <RNPickerSelect
            style={pickerSelectStyles}
            onValueChange={(value) => setSelectedUf(value)}
            placeholder={{ label: "Selecione um estado", value: null }}
            items={ufs}
            Icon={() => <Icon name="chevron-down" size={20} color="#A0A0B2" />}
          />

          <RNPickerSelect
            style={pickerSelectStyles}
            onValueChange={(value) => setSelectedCity(value)}
            placeholder={{ label: "Selecione uma cidade", value: null }}
            items={cities}
            disabled={cities.length === 0}
            Icon={() => <Icon name="chevron-down" size={20} color="#A0A0B2" />}
          />

          <RectButton style={styles.button} onPress={handleNavigateToPoints}>
            <View style={styles.buttonIcon}>
              <Text>
                <Icon name="arrow-right" color="#FFF" size={24} />
              </Text>
            </View>
            <Text style={styles.buttonText}>Entrar</Text>
          </RectButton>

          <RectButton
            style={styles.button}
            onPress={handleNavigateToCreateAccount}
          >
            <View style={styles.buttonIcon}>
              <Text>
                <Icon name="log-in" color="#FFF" size={24} />
              </Text>
            </View>
            <Text style={styles.buttonText}>Criar Conta</Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: "center",
  },

  title: {
    color: "#322153",
    fontSize: 32,
    fontFamily: "Ubuntu_700Bold",
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: "#6C6C80",
    fontSize: 16,
    marginTop: 16,
    fontFamily: "Roboto_400Regular",
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: "#34CB79",
    height: 60,
    flexDirection: "row",
    borderRadius: 10,
    overflow: "hidden",
    alignItems: "center",
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    flex: 1,
    justifyContent: "center",
    textAlign: "center",
    color: "#FFF",
    fontFamily: "Roboto_500Medium",
    fontSize: 16,
  },
});

const pickerSelectStyles = StyleSheet.create({
  viewContainer: {
    display: "flex",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 2,
    height: 56,
    paddingLeft: 20,
  },
});

export default Home;
