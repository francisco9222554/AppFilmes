import { useRouter } from "expo-router";
import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput } from "react-native";
import { db } from "../../firebaseConfig";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [ano, setAno] = useState("");
  const [idadeIndicativa, setIdadeIndicativa] = useState("");
  const [genero, setGenero] = useState("");
  const [diretor, setDiretor] = useState("");
  const [salvando, setSalvando] = useState(false);

  const router = useRouter();

  async function salvar() {
    if (
      !nome.trim() ||
      !ano.trim() ||
      !idadeIndicativa.trim() ||
      !genero.trim() ||
      !diretor.trim()
    ) {
      Alert.alert("Atenção", "Preencha todos os campos.");
      return;
    }

    const anoNumero = parseInt(ano, 10);
    if (
      isNaN(anoNumero) ||
      anoNumero < 1888 ||
      anoNumero > new Date().getFullYear() + 5
    ) {
      Alert.alert("Atenção", "Informe um ano de lançamento válido.");
      return;
    }

    try {
      setSalvando(true);

      await addDoc(collection(db, "filmes"), {
        nome: nome.trim(),
        ano: anoNumero,
        idadeIndicativa: idadeIndicativa.trim(),
        genero: genero.trim(),
        diretor: diretor.trim(),
      });

      Alert.alert("Sucesso", "Filme cadastrado com sucesso!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (e) {
      console.error(e);
      Alert.alert("Erro", "Não foi possível cadastrar o filme.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Nome do filme</Text>
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={setNome}
          placeholder="Ex: O Poderoso Chefão"
        />

        <Text style={styles.label}>Ano de lançamento</Text>
        <TextInput
          style={styles.input}
          value={ano}
          onChangeText={setAno}
          placeholder="Ex: 1972"
          keyboardType="numeric"
          maxLength={4}
        />

        <Text style={styles.label}>Idade indicativa</Text>
        <TextInput
          style={styles.input}
          value={idadeIndicativa}
          onChangeText={setIdadeIndicativa}
          placeholder="Ex: 16 anos, Livre, 18 anos..."
        />

        <Text style={styles.label}>Gênero</Text>
        <TextInput
          style={styles.input}
          value={genero}
          onChangeText={setGenero}
          placeholder="Ex: Drama, Ação, Comédia..."
        />

        <Text style={styles.label}>Diretor</Text>
        <TextInput
          style={styles.input}
          value={diretor}
          onChangeText={setDiretor}
          placeholder="Ex: Francis Ford Coppola"
        />

        <Pressable
          style={[styles.botao, salvando && styles.botaoDesabilitado]}
          onPress={salvar}
          disabled={salvando}
        >
          <Text style={styles.textoBotao}>
            {salvando ? "Salvando..." : "Salvar Filme"}
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f5f5f5",
    flexGrow: 1,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 6,
    color: "#333",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 18,
  },
  botao: {
    backgroundColor: "#1e88e5",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  botaoDesabilitado: {
    opacity: 0.6,
  },
  textoBotao: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});