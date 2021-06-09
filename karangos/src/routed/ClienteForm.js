import React from 'react';
import { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import InputMask from 'react-input-mask';
import MenuItem from '@material-ui/core/MenuItem';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { useHistory, useParams } from 'react-router-dom';
import ConfirmDialog from '../ui/ConfirmDialog';


// Constante para estilos de página
const useStyles = makeStyles(() => ({
    form: {
        //backgroundColor: 'green',  // Cor de debug
        maxWidth: '90%',
        margin: '0 auto ',
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        '& .MuiFormControl-root': {
            minWidth: '170px',
            maxWidth: '800px',
            marginBottom: '20px'
        }
    },
    toolbar: {
        marginTop: '46px',
        width: '100%',
        display: 'flex',
        justifyContent: 'space-around',
    },
    checkbox: {
        alignItems: 'center'
    },
    textfield: {
        align: 'center',
        width: '550px',
    },
}))

// Máscara como objeto
const formatChars = {

    '9': '[0-9]',
    '*': '[0-9xX]',
    '#': '[9, ]',
}

// Máscara de entrada
const cpfMask = '999.999.999-99'
const rgMask = '99.999.999-*'
const foneMask = '(99) # 9999-9999'


export default function ClienteForm() {

    // Declaração dos useStates
    const classes = useStyles()

    const [cliente, setCliente] = useState({
        id: null,
        nome: '',
        cpf: '',
        rg: '',
        logradouro: '',
        num_imovel: '',
        complemento: '',
        bairro: '',
        municipio: '',
        uf: '',
        telefone: '',
        email: ''
    })

    const [snackState, setSnackState] = useState({
        open: false,
        severity: 'success',
        message: 'Cliente salvo com sucesso.'
    })

    const [btnSendState, setBtnSendState] = useState({
        disabled: false,
        label: 'Enviar'
    })

    const [error, setError] = useState({
        nome: '',
        cpf: '',
        rg: '',
        logradouro: '',
        num_imovel: '',
        complemento: '',
        bairro: '',
        municipio: '',
        uf: '',
        telefone: '',
        email: ''
    })

    const [isModified, setIsModified] = useState(false)

    const [dialogOpen, setDialogOpen] = useState(false) // O diálogo de confirmação está aberto?

    const [title, setTitle] = useState('Cadastrar Cliente')


    const history = useHistory()
    const params = useParams()

    useEffect(() => {

        // Verificac se tem o parâmetro id na rota. Se tiver, temos que buscar
        // os dados do registro no back-end para edição
        if (params.id) {
            setTitle('Editando Cliente')
            getData(params.id)
        }
    }, [])

    // Funcão de apresentação dos dados para edição com erro
    async function getData(id) {
        try {
            let response = await axios.get(`https://api.faustocintra.com.br/clientes/${id}`)
            setCliente(response.data)
        }
        catch (error) {
            setSnackState({
                open: true,
                severity: 'error',
                message: 'Não foi possível carregar os dados para edição.'
            })
        }
    }

    function handleInputChange(event, property) {

        const clienteTemp = { ...cliente }

        if (event.target.id) property = event.target.id

        if ((property === 'cpf') || (property === 'telefone') || (property === 'uf')) {

            clienteTemp[property] = event.target.value

        } else if (property === 'rg') {

            clienteTemp[property] = event.target.value.toUpperCase()

        } else if (property === 'email') {

            clienteTemp[property] = event.target.value.toLowerCase()

        } else

        clienteTemp[property] = event.target.value

        setCliente(clienteTemp)
        setIsModified(true)
        validate(clienteTemp)
    }

    // Validação dos inputs
    function validate(data) {

        const errorTemp = {
            nome: '',
            cpf: '',
            rg: '',
            logradouro: '',
            num_imovel: '',
            complemento: '',
            bairro: '',
            municipio: '',
            uf: '',
            telefone: '',
            email: ''
        }
        const validTemp = {
            telefone: '',
        }
        let isValid = true

        // Validação do campo nome
        if (data.nome.trim() === '') {     // trim(): retira os espaços em branco do nício e do final de uma string
            errorTemp.nome = 'O nome deve ser preenchido'
            isValid = false
        }

        // Validação do campo cpf
        if (data.cpf.trim() === '' || data.cpf.includes('_')) {
            errorTemp.cpf = 'O CPF deve ser preenchido corretamente'
            isValid = false
        }

        // Validação do campo rg
        if (data.rg.trim() === '' || data.rg.includes('_')) {
            errorTemp.rg = 'O RG deve ser preenchido corretamente'
            isValid = false
        }

        // Validação do campo logradouro
        if (data.logradouro.trim() === '') {
            errorTemp.logradouro = 'O logradouro deve ser preenchido'
            isValid = false
        }

        // Validação do campo complemento
        if (data.complemento.trim() === '') {
            errorTemp.complemento = 'Escolha um complemento'
            isValid = false
        }

        // Validação do campo bairro
        if (data.bairro.trim() === '') {
            errorTemp.bairro = 'O bairro deve ser preenchido'
            isValid = false
        }

        // Validação do campo município
        if (data.municipio.trim() === '') {
            errorTemp.municipio = 'O município deve ser preenchido'
            isValid = false
        }

        // Validação do campo uf
        if (data.uf.trim() === '') {
            errorTemp.uf = 'Escolha uma UF'
            isValid = false
        }

        // Validação do campo telefone
        if (data.telefone.trim() === '' || data.telefone.includes('_')) {
            errorTemp.telefone = `O telefone deve ser preenchido corretamente - Utilize espaço para não usar o 9 de celular`
            isValid = false
        }

        if (Number(data.num_imovel) <= 0) {
            errorTemp.num_imovel = 'O número deve ser preenchido corretamente e deve ser maior que zero'
            isValid = false
        }

        if (!data.email.includes('@') || data.email.trim() === '' || data.email.length <= 5) {
            errorTemp.email = 'O e-mail deve ser preenchido corretemente'
            isValid = false
        }

        setError(errorTemp)
        return isValid
    }

    // Função salvar ou editar com erro
    async function saveData() {
        try {
            // Desabilitar o botão Enviar
            setBtnSendState({ disabled: true, label: 'Enviando...' })

            // Se o registro já existe (edição)
            if (params.id) {
                await axios.put(`https://api.faustocintra.com.br/clientes/${params.id}`, cliente)
            }
            // Registro não existe, cria um novo (verbo HTTP POST)
            else {
                await axios.post(`https://api.faustocintra.com.br/clientes`, cliente)
            }
            //alert('Dados salvos com sucesso!')
            setSnackState({
                open: true,
                severity: 'success',
                message: 'Cliente salvo com sucesso!'
            })
            // A FAZER: retornar à página de listagem
        }
        catch (error) {
            //alert('ERRO: ' + error.message)
            setSnackState({
                open: true,
                severity: 'error',
                message: 'ERRO: ' + error.message
            })
        }
        // Reabilita o botão Enviar
        setBtnSendState({ disabled: false, label: 'Enviar' })
    }


    function handleSubmit(event) {

        event.preventDefault()   // Evitar o recarregamento da página

        if (validate(cliente)) saveData()
    }

    function Alert(props) {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
    }

    function handleSnackClose(event, reason) {
        // Evita que a Snackbar seja fechada clicando-se fora dela
        if (reason === 'clickway') return
        setSnackState({ ...snackState, open: false })  // Fecha a Snackbar

        // Retorna à página de listagem
        history.push('/list2')
    }

    function handleDialogClose(result) {
        setDialogOpen(false)

        // Se o usuário concordou em voltar 
        if (result) history.push('/list2')
    }

    function handleGoBack() {

        // Se o formulário estiver modificado, mostramos o diálogo de confirmação
        if (isModified) setDialogOpen(true)

        // Senão, voltamos diretamente à de listagem
        else history.push('/list2')
    }

    return (
        <>
            <ConfirmDialog
                isOpen={dialogOpen}
                onClose={handleDialogClose}>
                Há dados não salvos. Deseja realmente voltar?
            </ConfirmDialog>

            <Snackbar
                open={snackState.open}
                autoHideDuration={6000}
                onClose={handleSnackClose}>
                <Alert
                    onClose={handleSnackClose}
                    severity={snackState.severity}>
                    {snackState.message}
                </Alert>
            </Snackbar>

            <h1>{title}</h1>

            <form className={classes.form} onSubmit={handleSubmit} >

                <TextField
                    className={classes.textfield}
                    id="nome"
                    label="Nome"
                    variant="filled"
                    value={cliente.nome}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    error={error.nome !== ''}
                    helperText={error.nome} />

                <InputMask
                    formatChars={formatChars}
                    mask={cpfMask}
                    id="cpf"
                    value={cliente.cpf}
                    onChange={event => handleInputChange(event, 'cpf')}>
                    {() => <TextField
                        className={classes.textfield}
                        label="CPF"
                        variant="filled"
                        fullWidth
                        required
                        error={error.cpf !== ''}
                        helperText={error.cpf} />}
                </InputMask>

                <InputMask
                    formatChars={formatChars}
                    mask={rgMask}
                    id="rg"
                    value={cliente.rg}
                    onChange={event => handleInputChange(event, 'rg')}>
                    {() => <TextField
                        className={classes.textfield}
                        label="RG"
                        variant="filled"
                        fullWidth
                        required
                        error={error.rg !== ''}
                        helperText={error.rg} />}
                </InputMask>

                <TextField
                    className={classes.textfield}
                    id="logradouro"
                    label="Logradouro"
                    variant="filled"
                    value={cliente.logradouro}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    error={error.logradouro !== ''}
                    helperText={error.logradouro} />

                <TextField
                    className={classes.textfield}
                    id="num_imovel"
                    label="Número Imóvel"
                    variant="filled"
                    value={cliente.num_imovel}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    error={error.num_imovel !== ''}
                    helperText={error.num_imovel} />

                <TextField
                    className={classes.textfield}
                    id="complemento"
                    label="Complemento"
                    variant="filled"
                    value={cliente.complemento}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    error={error.complemento !== ''}
                    helperText={error.complemento} />
                    {/* <MenuItem value="Casa">Casa</MenuItem> */}
                    {/* <MenuItem value="Apartamento">Apartamento</MenuItem> */}
                    {/* <MenuItem value="Sitio">Sítio</MenuItem> */}
                    {/* <MenuItem value="Chacara">Chácara</MenuItem> */}
                {/* </TextField> */}

                <TextField
                    className={classes.textfield}
                    id="bairro"
                    label="Bairro"
                    variant="filled"
                    value={cliente.bairro}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    error={error.bairro !== ''}
                    helperText={error.bairro} />

                <TextField
                    className={classes.textfield}
                    id="municipio"
                    label="Município"
                    variant="filled"
                    value={cliente.municipio}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    error={error.municipio !== ''}
                    helperText={error.municipio} />

                <TextField
                    className={classes.textfield}
                    id="uf"
                    label="UF"
                    variant="filled"
                    value={cliente.uf}
                    onChange={event => handleInputChange(event, 'uf')}
                    select fullWidth
                    required
                    error={error.uf !== ''}
                    helperText={error.uf} >
                    <MenuItem value="AC">Acre</MenuItem>
                    <MenuItem value="AL">Alagoas</MenuItem>
                    <MenuItem value="AP">Amapá</MenuItem>
                    <MenuItem value="AM">Amazonas</MenuItem>
                    <MenuItem value="BA">Bahia</MenuItem>
                    <MenuItem value="CE">Ceará</MenuItem>
                    <MenuItem value="DF">Distrito Federal</MenuItem>
                    <MenuItem value="ES">Espírito Santo</MenuItem>
                    <MenuItem value="GO">Goiás</MenuItem>
                    <MenuItem value="MA">Maranhão</MenuItem>
                    <MenuItem value="MG">Mato Grosso</MenuItem>
                    <MenuItem value="MS">Mato Grosso do Sul</MenuItem>
                    <MenuItem value="MG">Minas Gerais</MenuItem>
                    <MenuItem value="PA">Pará</MenuItem>
                    <MenuItem value="PB">Paraíba</MenuItem>
                    <MenuItem value="PR">Paraná</MenuItem>
                    <MenuItem value="PE">Pernambuco</MenuItem>
                    <MenuItem value="PI">Piauí</MenuItem>
                    <MenuItem value="RJ">Rio de Janeiro</MenuItem>
                    <MenuItem value="RN">Rio Grande do Norte</MenuItem>
                    <MenuItem value="RS">Rio Grande do Sul</MenuItem>
                    <MenuItem value="RO">Rondônia</MenuItem>
                    <MenuItem value="RR">Roraima</MenuItem>
                    <MenuItem value="SC">Santa Catarina</MenuItem>
                    <MenuItem value="SP">São Paulo</MenuItem>
                    <MenuItem value="SE">Sergipe</MenuItem>
                    <MenuItem value="TO">Tocantins</MenuItem>
                </TextField>

                <InputMask
                    formatChars={formatChars}
                    mask={foneMask}
                    id="telefone"
                    value={cliente.telefone}
                    onChange={event => handleInputChange(event, 'telefone')}>
                    {() => <TextField
                        className={classes.textfield}
                        label="Telefone"
                        variant="filled"
                        palceholder="Use as setas para mover o cursor"
                        fullWidth
                        required
                        error={error.telefone !== ''}
                        helperText={error.telefone} />}
                    </InputMask>

                <TextField
                    className={classes.textfield}
                    id="email"
                    label="E-mail"
                    variant="filled"
                    value={cliente.email}
                    onChange={event => handleInputChange(event, 'email')}
                    fullWidth
                    required
                    error={error.email !== ''}
                    helperText={error.email} />
                <Toolbar
                    className={classes.toolbar} >
                    <Button
                        variant="contained"
                        color="secondary"
                        type="submit"
                        disabled={btnSendState.disabled} >

                        {btnSendState.label}
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleGoBack} >
                        Voltar
                    </Button>
                </Toolbar>
                {/* <div>{JSON.stringify(cliente)}</div>  */}
            </form>
        </>
    )
}