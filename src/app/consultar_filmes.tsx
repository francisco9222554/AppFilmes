import { useRouter } from "expo-router";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { useState } from "react";
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { db } from "../../firebaseConfig";
import { Filme } from "../types/Filme";

export default function ConsultaFilmes() {
    const [lista, setLista] = useState<Filme[]>([]);
    const [listaOriginal, setListaOriginal] = useState<Filme[]>([]);

    async function consultar() {
        setLista([]);
        setListaOriginal([]);

        const querySnapshot = await getDocs(collection(db, "filmes"));

        querySnapshot.docs.map((doc) => {
            const filme = {
                id: doc.id,
                ...doc.data()
            } as Filme;

            setLista((listaAnterior) => [...listaAnterior, filme]);
            setListaOriginal((listaAnterior) => [...listaAnterior, filme]);
        });
    }

    function ordenarPorAno() {
        const ordenada = [...lista].sort((a, b) => Number(a.ano) - Number(b.ano));
        setLista(ordenada);
    }

    function ordenarAlfabetica() {
        const ordenada = [...lista].sort((a, b) =>
            a.nome.localeCompare(b.nome, "pt-BR", { sensitivity: "base" })
        );
        setLista(ordenada);
    }

    function restaurarOrdem() {
        setLista([...listaOriginal]);
    }

    async function deletar(identificador: string) {
        try {
            await deleteDoc(doc(db, "filmes", identificador));
            Alert.alert("Filme removido");

            const novaLista = lista.filter((value) => value.id !== identificador);
            setLista(novaLista);
            setListaOriginal(novaLista);
        } catch (e) {
            Alert.alert("Erro", String(e));
        }
    }

    const router = useRouter();

    function alterar(id: string) {
        router.push({
            pathname: '/alterar_filmes',
            params: {
                idParam: id
            }
        })
    }

    return (
        <View style={styles.container}>
            <Pressable onPress={consultar}>
                <Text style={styles.texto}>Consultar</Text>
            </Pressable>

            <View style={styles.botoesOrdenacao}>
                <Pressable onPress={ordenarPorAno}>
                    <Text style={styles.texto}>Por Ano</Text>
                </Pressable>

                <Pressable onPress={ordenarAlfabetica}>
                    <Text style={styles.texto}>A-Z</Text>
                </Pressable>

                <Pressable onPress={restaurarOrdem}>
                    <Text style={styles.texto}>Original</Text>
                </Pressable>
            </View>

            <FlatList
                data={lista}
                renderItem={(item) => {
                    return (
                        <View style={styles.card}>
                            <Text>ID: {item.item.id}</Text>
                            <Text>NOME: {item.item.nome}</Text>
                            <Text>ANO: {item.item.ano}</Text>
                            <Text>IDADE: {item.item.idadeIndicativa}</Text>
                            <Text>GÊNERO: {item.item.genero}</Text>
                            <Text>DIRETOR: {item.item.diretor}</Text>

                            <Pressable onPress={() => { deletar(item.item.id) }}>
                                <Text style={styles.texto}>Del</Text>
                            </Pressable>

                            <Pressable onPress={() => { alterar(item.item.id) }}>
                                <Text style={styles.texto}>Alt</Text>
                            </Pressable>
                        </View>
                    )
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    texto: {
        fontSize: 20
    },
    card: {
        borderWidth: 1,
        margin: 8,
        padding: 8,
        width: 300
    },
    botoesOrdenacao: {
        flexDirection: "row",
        gap: 20,
        marginVertical: 10
    }
});