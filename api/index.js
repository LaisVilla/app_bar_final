const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");
const cors = require("cors");
const jwt = require('jsonwebtoken');


// Inicializa o app Express
const app = express();
const port = 8000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Conexão com MongoDB
mongoose.connect("mongodb+srv://tiprojetosadm:tiprojeto@cluster0.r1e1l.mongodb.net/", { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log("Error connecting to MongoDB:", err);
});

// Modelos
const User = require("./models/user");
const Produto = require("./models/Produto"); // Certifique-se de que o modelo Produto exista
const Reserva = require("./models/Reserva");
const Compra = require("./models/Compra");

// Rota para buscar produtos
app.get("/produtos", async (req, res) => {
    try {
        const produtos = await Produto.find(); // Busca todos os produtos
        res.status(200).json(produtos); // Retorna os produtos
    } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        res.status(500).json({ message: "Erro ao buscar produtos." });
    }
});

// Gera uma chave secreta para JWT
const generateSecretKey = () => {
    return crypto.randomBytes(32).toString("hex");
};
const secretKey = generateSecretKey();

// Middleware para verificar se o usuário é admin
const verificarAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Captura o token do cabeçalho Authorization
    if (!token) {
        return res.status(403).json({ message: "Token não fornecido." });
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        if (decoded.role !== "admin") {
            return res.status(403).json({ message: "Acesso negado. Você não é administrador." });
        }
        req.user = decoded; // Passa as informações do token para a próxima função
        next();
    } catch (error) {
        return res.status(403).json({ message: "Token inválido." });
    }
};

// Rota para registrar usuário
app.post("/register", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email já está sendo usado." });
        }

        const newUser = new User({ name, email, password, role });
        await newUser.save();
        return res.status(201).json({ message: "Usuário registrado com sucesso." });

    } catch (error) {
        console.log("Erro ao registrar usuário:", error);
        res.status(500).json({ message: "Falha no registro." });
    }
});


// Rota para login
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Email inválido ou senha inválida." });
        }
        if (user.password !== password) {
            return res.status(401).json({ message: "Senha inválida." });
        }
        // Inclui o papel do usuário (role) no token
        const token = jwt.sign({ UserId: user._id, role: user.role  }, secretKey);
        res.status(200).json({ token });

    } catch (error) {
        console.error("Login falhou:", error);
        res.status(500).json({ message: "Login falhou." });
    }
});

// Rota para criar reserva
app.post("/reservas/create", async (req, res) => {
    const { data, numeroDeConvidados, observacoes } = req.body;

    if (numeroDeConvidados > 100) {
        return res.status(400).json({ error: "Capacidade máxima excedida." });
    }

    const novaReserva = new Reserva({ data, numeroDeConvidados, observacoes });

    try {
        await novaReserva.save();
        res.status(201).json({ message: "Reserva criada com sucesso." });
    } catch (error) {
        console.error("Erro ao criar reserva:", error);
        res.status(500).json({ error: "Erro ao criar reserva." });
    }
});

// Rota para registrar compra
app.post("/compras", async (req, res) => {
    const { produtos, total } = req.body;

    try {
        const novaCompra = new Compra({ produtos, total });
        await novaCompra.save();
        res.status(201).json({ message: "Compra registrada com sucesso!" });
    } catch (error) {
        console.error("Erro ao registrar compra:", error);
        res.status(500).json({ message: "Falha ao registrar a compra." });
    }
});

// Rota para cadastrar produtos
app.post("/produtos", verificarAdmin, async (req, res) => {
    console.log("Requisição para cadastrar produto recebida:", req.body); // Adicione esta linha
    const { nome, preco, quantidade, imgUrl } = req.body;

    try {
        const novoProduto = new Produto({ nome, preco, quantidade, imgUrl });
        await novoProduto.save();
        res.status(201).json({ message: "Produto cadastrado com sucesso!" });
    } catch (error) {
        console.error("Erro ao cadastrar produto:", error);
        res.status(500).json({ message: "Falha ao cadastrar produto." });
    }
});

// Rota para atualizar produto
app.put("/produtos/:id", verificarAdmin, async (req, res) => {
    const { id } = req.params;
    const { nome, preco, quantidade, imgUrl } = req.body;

    try {
        const produtoAtualizado = await Produto.findByIdAndUpdate(
            id,
            { nome, preco, quantidade, imgUrl },
            { new: true } // Retorna o produto atualizado
        );

        if (!produtoAtualizado) {
            return res.status(404).json({ message: "Produto não encontrado." });
        }

        res.status(200).json({ message: "Produto atualizado com sucesso!", produto: produtoAtualizado });
    } catch (error) {
        console.error("Erro ao atualizar produto:", error);
        res.status(500).json({ message: "Falha ao atualizar produto." });
    }
});

// Rota para excluir produto
app.delete("/produtos/:id", verificarAdmin, async (req, res) => {
    const { id } = req.params;

    try {
        const produtoExcluido = await Produto.findByIdAndDelete(id);

        if (!produtoExcluido) {
            return res.status(404).json({ message: "Produto não encontrado." });
        }

        res.status(200).json({ message: "Produto excluído com sucesso!" });
    } catch (error) {
        console.error("Erro ao excluir produto:", error);
        res.status(500).json({ message: "Falha ao excluir produto." });
    }
});

// Inicia o servidor
app.listen(port, () => {
    console.log("Servidor rodando na porta", port);
});
