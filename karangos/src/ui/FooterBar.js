import { Typography } from '@material-ui/core';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';
import LocalCafeRoundedIcon from '@material-ui/icons/LocalCafeRounded';
import SvgIcon from '@material-ui/core/SvgIcon';
import { green } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
    text: {
        //backgroundColor: 'yellow',
        width: '100%',
        color: theme.palette.text.secondary
    },
    toolbar: {
        backgroundColor: theme.palette.background.paper,
        minHeight: '40px',
        // Posicionando a barra no rodapé da página
        width: '100%',
        position: 'fixed',
        bottom: 0
    },
    link: {
        color: theme.palette.secondary.light,
        textDecoration: 'none',         // tira o sublinhado do link
        '&:hover': {                    // mouse passando sobre o link
            textDecoration: 'underline' // retorna o sublinhado
        }
    }
}));

export default function FooterBar() {

    function HomeIcon(props) {
        return (
          <SvgIcon {...props}>
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </SvgIcon>
        );
      }


    const classes = useStyles();
    return (
        <Toolbar className={classes.toolbar}>
            <Typography variant="caption" style={{fontSize: 16}}align="center" className={classes.text}>
                Desenvolvido de  < HomeIcon style={{ color: green[500] }} fontSize ="small"/> com <LocalCafeRoundedIcon style={{ color: green[500] }}fontSize="small"/> por <a style={{ color: green[500] }} href="https://github.com/JPCarrijo" className={classes.link}>João Paulo Carrijo</a>
            </Typography>
        </Toolbar>
    )
}