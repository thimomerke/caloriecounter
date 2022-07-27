import Head from "next/head";
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
   return (
      <>
         <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <script async type="text/javascript" src="static/bootstrap.bundle.min.js"></script>
         </Head>
         <Component {...pageProps} />
      </>
   );
}
export default MyApp;