import { useFocusEffect, useRouter } from "expo-router";
import { collection, deleteDoc, doc, getDocs, orderBy, query } from "firebase/firestore";
import { useCallback, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { db } from "../../firebaseConfig";

type Filme = {
  id: string;
  nome: string;
  ano: number;
  idadeIndicativa: string;
  genero: string;
  diretor: string;
};

export default function Index() {
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [carregando, setCarregando] = useState(true);
  const router = useRouter();

  async function carregarFilmes() {
    try {
      setCarregando(true);
      const q = query(collection(db, "filmes"), orderBy("nome"));
      const snapshot = await getDocs(q);

      const lista: Filme[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<Filme, "id">),
      }));

      setFilmes(lista);
    } catch (e) {
      console.error(e);
      Alert.alert("Erro", "Não foi possível carregar os filmes.");
    } finally {
      setCarregando(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      carregarFilmes();
    }, [])
  );

  function confirmarExclusao(filme: Filme) {
    Alert.alert(
      "Excluir filme",
      `Deseja realmente excluir "${filme.nome}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => excluirFilme(filme.id),
        },
      ]
    );
  }

  async function excluirFilme(id: string) {
    try {
      await deleteDoc(doc(db, "filmes", id));
      Alert.alert("Sucesso", "Filme excluído com sucesso!");
      carregarFilmes();
    } catch (e) {
      console.error(e);
      Alert.alert("Erro", "Não foi possível excluir o filme.");
    }
  }

  function renderItem({ item }: { item: Filme }) {
    return (
      <View style={styles.card}>
        <View style={styles.info}>
          <Text style={styles.nome}>{item.nome}</Text>
          <Text style={styles.detalhe}>Ano: {item.ano}</Text>
          <Text style={styles.detalhe}>
            Idade: {item.idadeIndicativa} | Gênero: {item.genero}
          </Text>
          <Text style={styles.detalhe}>Diretor: {item.diretor}</Text>
        </View>

        <Pressable
          style={styles.botaoExcluir}
          onPress={() => confirmarExclusao(item)}
        >
          <Text style={styles.textoBotaoExcluir}>Excluir</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.botaoCadastrar}
        onPress={() => router.push("/cadastro")}
      >
        <Text style={styles.textoBotaoCadastrar}>+ Cadastrar Filme</Text>
      </Pressable>

      {carregando ? (
        <ActivityIndicator
          size="large"
          color="#1e88e5"
          style={{ marginTop: 40 }}
        />
      ) : filmes.length === 0 ? (
        <Text style={styles.vazio}>Nenhum filme cadastrado.</Text>
      ) : (
        <FlatList
          data={filmes}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.lista}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  botaoCadastrar: {
    backgroundColor: "#1e88e5",
    margin: 16,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  textoBotaoCadastrar: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  lista: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  info: {
    flex: 1,
  },
  nome: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#222",
  },
  detalhe: {
    fontSize: 14,
    color: "#555",
    marginTop: 2,
  },
  botaoExcluir: {
    backgroundColor: "#e53935",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginLeft: 12,
  },
  textoBotaoExcluir: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },
  vazio: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#777",
  },
});