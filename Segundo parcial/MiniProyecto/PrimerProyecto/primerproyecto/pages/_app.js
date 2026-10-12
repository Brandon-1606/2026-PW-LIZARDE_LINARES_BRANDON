import Menu from '../Components/Menu'
import '../styles/styles.css';

export default function App({ Component, pageProps }) {
    return(
        <>
            <Menu />
            <Component {...pageProps} />
        </>
    );
}