import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { db } from "../../firebaseConfig";

export default function AlterarFilme() {
    const { idParam } = useLocalSearchParams<{ idParam: string }>();
    const router = useRouter();

    const [nome, setNome] = useState("");
    const [ano, setAno] = useState("");
    const [idadeIndicativa, setIdadeIndicativa] = useState("");
    const [genero, setGenero] = useState("");
    const [diretor, setDiretor] = useState("");

    useEffect(() => {
        async function carregar() {
            if (!idParam) return;

            const docRef = doc(db, "filmes", idParam);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const dados = docSnap.data();
                setNome(dados.nome || "");
                setAno(String(dados.ano || ""));
                setIdadeIndicativa(dados.idadeIndicativa || "");
                setGenero(dados.genero || "");
                setDiretor(dados.diretor || "");
            } else {
                Alert.alert("Erro", "Filme não encontrado");
                router.back();
            }
        }

        carregar();
    }, [idParam]);

    async function salvar() {
        try {
            await updateDoc(doc(db, "filmes", idParam), {
                nome: nome,
                ano: Number(ano),
                idadeIndicativa: idadeIndicativa,
                genero: genero,
                diretor: diretor
            });

            Alert.alert("Filme atualizado");
            router.back();
        } catch (e) {
            Alert.alert("Erro", String(e));
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.texto}>Alterar Filme</Text>

            <Text>Nome:</Text>
            <TextInput
                style={styles.input}
                value={nome}
                onChangeText={setNome}
            />

            <Text>Ano:</Text>
            <TextInput
                style={styles.input}
                value={ano}
                onChangeText={setAno}
                keyboardType="numeric"
            />

            <Text>Idade Indicativa:</Text>
            <TextInput
                style={styles.input}
                value={idadeIndicativa}
                onChangeText={setIdadeIndicativa}
            />

            <Text>Gênero:</Text>
            <TextInput
                style={styles.input}
                value={genero}
                onChangeText={setGenero}
            />

            <Text>Diretor:</Text>
            <TextInput
                style={styles.input}
                value={diretor}
                onChangeText={setDiretor}
            />

            <Pressable onPress={salvar}>
                <Text style={styles.texto}>Salvar</Text>
            </Pressable>

            <Pressable onPress={() => router.back()}>
                <Text style={styles.texto}>Cancelar</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20
    },
    texto: {
        fontSize: 20,
        marginVertical: 10
    },
    input: {
        borderWidth: 1,
        width: "90%",
        padding: 8,
        marginBottom: 12,
        fontSize: 16
    }
});