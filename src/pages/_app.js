import Layout from 'Components/Layout';
import 'Styles/common.css';

import { Provider as SettingsProvider } from 'Contexts/Settings';

function MyApp({ Component, pageProps }) {
  return (
    <SettingsProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SettingsProvider>
  );
}

export default MyApp;
