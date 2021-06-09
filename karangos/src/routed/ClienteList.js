import axios from 'axios';
import { useEffect, useState } from 'react';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
//import Table from '@material-ui/core/Table';
//import TableBody from '@material-ui/core/TableBody';
//mport TableCell from '@material-ui/core/TableCell';
//import TableContainer from '@material-ui/core/TableContainer';
//import TableHead from '@material-ui/core/TableHead';
//import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
//import Checkbox from '@material-ui/core/Checkbox'
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import AddBoxIcon from '@material-ui/icons/AddBox';
import { useHistory } from 'react-router-dom';
import ConfirmDialog from '../ui/ConfirmDialog';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { DataGrid, GridColDef } from '@material-ui/data-grid';
//import { XGrid } from '@material-ui/x-grid';

// Constante para estilos de página
const useStyles = makeStyles((theme) => ({
    table: {
        minWidth: 650,
    },
    dataGrid: {
        '& .MuiDataGrid-row button': {       // Esconde os botões na linha de tabela "normal"
            visibility: 'hidden',
        },
        '& .MuiDataGrid-row:hover button': { // Exibe os botões de volta quando o mouse passar por cima
            visibility: 'visible'
        },
        /*editButton: {
            color: theme.palette.success.dark,
        },*/
        /*
        tableRow: {
            '& button': {       // Linha da tabela em estado "normal"
                visibility: 'hidden'
            },
            '&:hover': {        // Linha da tabela com mouse sobreposto
                backgroundColor: theme.palette.action.hover
            },
            '&:hover button': { // Botões na linha com mouse sobreposto
                visibility: 'visible'
            },*/
    },
    toolbar: {
        justifyContent: 'flex-end',
        paddingRight: 0,
        margin: theme.spacing(2, 0)
    },

}));

export default function ClienteList() {
    // Declaração dos useStates
    const classes = useStyles();

    const history = useHistory()

    const [cliente, setCliente] = useState([])
    const [deletable, setDeletable] = useState()

    const [dialogOpen, setDialogOpen] = useState(false)

    const [open, setOpen] = useState(false)
    const [severity, setSeverity] = useState('sucess')
    const [message, setMessage] = useState('Cliente excluído com sucesso.')


    useEffect(() => {
        getData()
    }, [])

    // Função tenta buscar os dados
    async function getData() {
        try {
            let response = await axios.get('https://api.faustocintra.com.br/clientes?by=nome,cpf')
            if (response.data.length > 0) setCliente(response.data)
        }
        catch (error) {
            console.error(error);
        }
    }

    // Função deletar cliente
    async function deleteCliente() {
        try {
            await axios.delete(`https://api.faustocintra.com.br/clientes/${deletable}`)
            getData()   // Atualiza os dados das tabelas

            setSeverity('success')
            setMessage('Cliente excluído com sucesso.')
        }
        catch (error) {
            //alert(`ERRO: ${error.message}`)
            setSeverity('error')
            setMessage('ERRO: ' + error.message)
        }
        setOpen(true)   // snackbar
    }

    function handleDialogClose(result) {
        setDialogOpen(false)

        //  Exclusão pelo usuário
        if (result) deleteCliente()
    }

    function handleDeleteClick(id) {
        setDeletable(id)
        setDialogOpen(true)
    }

    function handleClose() {
        setOpen(false)
    }

    // Colunas da tabela
    const columns: GridColDef[] = [
        {
            field: 'id',
            headerClassName: 'super-app-theme--header',
            headerName: 'ID',
            align: 'center',
            headerAlign: 'center',
            width: 90,
            //flex: true,
            sortComparator: (n1, n2) => Number(n1) > Number(n2) ? 1 : -1
        },
        {
            field: 'nome',
            headerName: 'Nome',
            align: 'left',
            headerAlign: 'left',
            width: 150,
            //flex: true
        },
        {
            field: 'cpf',
            headerName: 'CPF',
            align: 'left',
            headerAlign: 'left',
            width: 125,
            //flex: true,
            sortComparator: (n1, n2) => Number(n1) > Number(n2) ? 1 : -1
        },
        {
            field: 'rg',
            headerName: 'RG',
            align: 'center',
            headerAlign: 'center',
            width: 125,
            //flex: true,
            sortComparator: (n1, n2) => Number(n1) > Number(n2) ? 1 : -1
        },
        {
            field: 'logradouro',
            headerName: 'Logradouro',
            width: 160,
            //flex: true,
        },
        {
            field: 'num_imovel',
            headerName: 'Nº Imóvel',
            width: 90,
            //flex: true,
            sortComparator: (n1, n2) => Number(n1) > Number(n2) ? 1 : -1
        },
        {
            field: 'complemento',
            headerName: 'Complemento',
            width: 150,
            //flex: true
        },
        {
            field: 'bairro',
            headerName: 'Bairro',
            width: 120,
            //flex: true
        },
        {
            field: 'municipio',
            headerName: 'Município',
            width: 150,
            //flex: true
        },
        {
            field: 'uf',
            headerName: 'UF',
            width: 100,
            //flex: true
        },
        {
            field: 'telefone',
            headerName: 'Telefone',
            width: 150,
            //flex: true,
            sortComparator: (n1, n2) => Number(n1) > Number(n2) ? 1 : -1
        },
        {
            field: 'email',
            headerName: 'E-mail',
            width: 260,
            //flex: true
        },
        {
            field: 'editar',
            headerName: 'Editar',
            align: 'center',
            headerAlign: 'center',
            width: 150,
            //flex: true,
            renderCell: params => (
                <IconButton aria-label="editar" onClick={() => history.push(`/edit2/${params.id}`)}>
                    <EditIcon />
                </IconButton>
            )
        },
        {
            field: 'excluir',
            headerName: 'Excluir',
            align: 'center',
            headerAlign: 'center',
            width: 120,
            //flex: true,
            renderCell: params => (
                <IconButton aria-label="excluir" onClick={() => handleDeleteClick(params.id)}>
                    <DeleteIcon color="error" />
                </IconButton>
            )
        }
    ]

    return (
        <>
            <ConfirmDialog
                isOpen={dialogOpen}
                onClose={handleDialogClose}>
                Deseja realmente excluir esse cliente?
            </ConfirmDialog>

            <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}>
                <MuiAlert
                    elevation={6}
                    variant="filled"
                    onClose={handleClose}
                    severity={severity}>
                    {message}
                </MuiAlert>
            </Snackbar>

            <h1>Registro de Clientes</h1>

            <Toolbar
                className={classes.toolbar}>
                <Button
                    color="secondary"
                    variant="contained"
                    size="large"
                    startIcon={<AddBoxIcon />}
                    onClick={() => history.push("/new2")}>
                    Novo Cliente
                </Button>
            </Toolbar>

            <Paper
                elevation={5} >
                <DataGrid
                    className={classes.dataGrid}
                    rows={cliente}
                    columns={columns}
                    pageSize={4}
                    autoHeight={true}
                    disableSelectionOnClick={true} />
            </Paper>
        </>
    )
}